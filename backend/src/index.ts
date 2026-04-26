import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { clerkAuth } from "./middleware/clerk.js";
import { adminApiRoute } from "./routes/adminApi.js";
import { leadsRoute } from "./routes/leads.js";
import { publicApiRoute } from "./routes/publicApi.js";
import Stripe from "stripe";
import { prisma } from "./db.js";

const app = new Hono();

const origins = (process.env.CORS_ORIGINS ?? "http://localhost:3000,http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  "*",
  cors({
    origin: origins,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.get("/health", (c) => c.json({ ok: true }));

app.route("/api/leads", leadsRoute);
app.route("/api/public", publicApiRoute);

const admin = new Hono();
admin.use("*", clerkAuth);
admin.route("/", adminApiRoute);
app.route("/api/admin", admin);

app.post("/webhooks/stripe", async (c) => {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    return c.json(
      {
        error: "stripe_not_configured",
        message: "Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET.",
      },
      500,
    );
  }

  const signature = c.req.header("stripe-signature");
  if (!signature) {
    return c.json({ error: "missing_signature" }, 400);
  }

  const rawBody = await c.req.text();
  const stripe = new Stripe(secret);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    return c.json(
      { error: "invalid_signature", message: error instanceof Error ? error.message : "Invalid signature" },
      400,
    );
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    const sessionId = session.id;
    const paymentIntentId =
      typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

    await prisma.paymentRecord.upsert({
      where: { stripeSessionId: sessionId },
      update: {
        status: "succeeded",
        stripePaymentId: paymentIntentId ?? null,
        customerEmail: session.customer_details?.email ?? undefined,
      },
      create: {
        stripeSessionId: sessionId,
        stripePaymentId: paymentIntentId ?? null,
        amountCents: session.amount_total ?? 0,
        currency: session.currency ?? "gbp",
        status: "succeeded",
        customerEmail: session.customer_details?.email ?? null,
        description: "Stripe checkout session completed",
        metadata: session.metadata ?? undefined,
      },
    });
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    await prisma.paymentRecord.updateMany({
      where: { stripeSessionId: session.id },
      data: { status: "failed" },
    });
  }

  if (event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await prisma.paymentRecord.updateMany({
      where: { stripeSessionId: session.id },
      data: { status: "failed" },
    });
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await prisma.paymentRecord.updateMany({
      where: { stripePaymentId: paymentIntent.id },
      data: { status: "failed" },
    });
  }

  return c.json({ received: true });
});

const port = Number(process.env.PORT) || 3001;
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`API listening on http://localhost:${info.port}`);
});
