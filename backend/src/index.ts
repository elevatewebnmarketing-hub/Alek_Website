import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { bodyLimit } from "hono/body-limit";
import type { Context, Next } from "hono";
import { clerkAuth } from "./middleware/clerk.js";
import { adminApiRoute } from "./routes/adminApi.js";
import { leadsRoute } from "./routes/leads.js";
import { publicApiRoute } from "./routes/publicApi.js";
import Stripe from "stripe";
import { prisma } from "./db.js";
import { reconcilePaymentRecordBySessionId } from "./lib/paymentReconciliation.js";

const app = new Hono();

const origins = (
  process.env.CORS_ORIGINS ??
  "http://localhost:3000,http://localhost:5173,http://localhost:5174,https://admin.runwayrefinedbyalek.com"
)
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

app.use("*", secureHeaders());

app.use(
  "*",
  bodyLimit({
    maxSize: 1 * 1024 * 1024,
    onError: (c) => c.json({ error: "payload_too_large" }, 413),
  }),
);

const _rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function rateLimit(max: number, windowMs: number) {
  return async (c: Context, next: Next) => {
    const ip =
      c.req.header("x-forwarded-for")?.split(",")[0].trim() ??
      c.req.header("x-real-ip") ??
      "unknown";
    const key = `${c.req.path}:${ip}`;
    const now = Date.now();
    const entry = _rateLimitStore.get(key);
    if (!entry || now > entry.resetAt) {
      _rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (entry.count >= max) {
      c.header("Retry-After", String(Math.ceil((entry.resetAt - now) / 1000)));
      return c.json({ error: "too_many_requests" }, 429);
    }
    entry.count++;
    return next();
  };
}

app.use("/api/leads/*", rateLimit(10, 15 * 60 * 1000));
app.use("/api/public/checkout-session", rateLimit(20, 15 * 60 * 1000));

app.get("/health", (c) => c.json({ ok: true }));
app.use("/email-assets/*", serveStatic({ root: "./public" }));

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
    console.error("[stripe-webhook] Missing stripe-signature header");
    return c.json({ error: "missing_signature" }, 400);
  }

  const rawBody = await c.req.text();
  const stripe = new Stripe(secret);
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("[stripe-webhook] Invalid signature:", error);
    return c.json(
      { error: "invalid_signature", message: error instanceof Error ? error.message : "Invalid signature" },
      400,
    );
  }

  console.log("[stripe-webhook] Event received:", event.type, { eventId: event.id });

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    const sessionId = session.id;
    const paymentIntentId =
      typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
    const resolvedStatus =
      event.type === "checkout.session.async_payment_succeeded" || session.payment_status === "paid"
        ? "succeeded"
        : "pending";

    await prisma.paymentRecord.upsert({
      where: { stripeSessionId: sessionId },
      update: {
        status: resolvedStatus,
        stripePaymentId: paymentIntentId ?? null,
        customerEmail: session.customer_details?.email ?? undefined,
      },
      create: {
        stripeSessionId: sessionId,
        stripePaymentId: paymentIntentId ?? null,
        amountCents: session.amount_total ?? 0,
        currency: session.currency ?? "gbp",
        status: resolvedStatus,
        customerEmail: session.customer_details?.email ?? null,
        description: `Stripe checkout session ${resolvedStatus}`,
        metadata: session.metadata ?? undefined,
      },
    });
    console.log("[stripe-webhook] Upserted successful checkout session", {
      sessionId,
      paymentIntentId: paymentIntentId ?? null,
    });
    await reconcilePaymentRecordBySessionId(stripe, sessionId);
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    await prisma.paymentRecord.updateMany({
      where: { stripeSessionId: session.id },
      data: { status: "failed" },
    });
    console.log("[stripe-webhook] Marked session as failed (expired)", { sessionId: session.id });
  }

  if (event.type === "checkout.session.async_payment_failed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await prisma.paymentRecord.updateMany({
      where: { stripeSessionId: session.id },
      data: { status: "failed" },
    });
    console.log("[stripe-webhook] Marked session as failed (async failed)", { sessionId: session.id });
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    await prisma.paymentRecord.updateMany({
      where: { stripePaymentId: paymentIntent.id },
      data: { status: "failed" },
    });
    console.log("[stripe-webhook] Marked payment intent as failed", { paymentIntentId: paymentIntent.id });
  }

  return c.json({ received: true });
});

const port = Number(process.env.PORT) || 3001;
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`API listening on http://localhost:${info.port}`);
});
