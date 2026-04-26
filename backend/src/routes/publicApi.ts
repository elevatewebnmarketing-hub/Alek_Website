import { Hono } from "hono";
import type { Prisma } from "@prisma/client";
import { prisma } from "../db.js";
import { checkoutSessionCreateSchema } from "../schemas.js";
import { checkoutAmountForScope } from "../lib/pricing.js";
import Stripe from "stripe";

export const publicApiRoute = new Hono();

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret) : null;

publicApiRoute.post("/checkout-session", async (c) => {
  if (!stripe) {
    return c.json(
      { error: "stripe_not_configured", message: "Set STRIPE_SECRET_KEY to enable checkout." },
      500,
    );
  }

  const raw = await c.req.json().catch(() => null);
  const parsed = checkoutSessionCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return c.json(
      { error: "validation_error", details: parsed.error.flatten() },
      400,
    );
  }

  const d = parsed.data;
  const amount = checkoutAmountForScope(d.packageSlug, d.paymentScope);
  if (!amount) {
    return c.json(
      { error: "invalid_package_or_scope", message: "Package or payment option is not available." },
      400,
    );
  }

  const siteUrl = (process.env.SITE_URL ?? "http://localhost:5173").replace(/\/$/, "");
  // Stripe replaces {CHECKOUT_SESSION_ID} in the redirect URL; keep it literal (do not URL-encode the braces).
  const successUrl = `${siteUrl}/checkout/success?package=${encodeURIComponent(d.packageSlug)}&session_id={CHECKOUT_SESSION_ID}`;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: successUrl,
    cancel_url: `${siteUrl}/packages/${d.packageSlug}?checkout=cancel`,
    customer_email: d.customerEmail ?? undefined,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "gbp",
          unit_amount: amount.amountGbp * 100,
          product_data: {
            name: `Runway Refined · ${d.packageSlug}`,
            description:
              d.paymentScope === "full_package_instalments"
                ? `First instalment collected now. Remaining balance: £${amount.instalmentRemainingGbp}.`
                : `Payment option: ${d.paymentScope.replaceAll("_", " ")}${d.selectedOneTimeOption ? ` (${d.selectedOneTimeOption})` : ""}.`,
          },
        },
      },
    ],
    metadata: {
      packageSlug: d.packageSlug,
      paymentScope: d.paymentScope,
      selectedOneTimeOption: d.selectedOneTimeOption ?? "",
      intakeDetails: d.intakeDetails ?? "",
      mediaUploadPreference: d.mediaUploadPreference ?? "",
      amountGbp: String(amount.amountGbp),
      fullPackageGbp: String(amount.fullPackageGbp),
      instalmentDueNowGbp: String(amount.instalmentDueNowGbp),
      instalmentRemainingGbp: String(amount.instalmentRemainingGbp),
    },
    expand: ["payment_intent"],
  });
  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;

  const paymentRecord = await prisma.paymentRecord.create({
    data: {
      stripeSessionId: session.id,
      stripePaymentId: paymentIntentId,
      amountCents: amount.amountGbp * 100,
      currency: "gbp",
      status: "pending",
      customerEmail: d.customerEmail ?? null,
      description: `Checkout for ${d.packageSlug} (${d.paymentScope})`,
      metadata: {
        packageSlug: d.packageSlug,
        paymentScope: d.paymentScope,
        selectedOneTimeOption: d.selectedOneTimeOption ?? null,
        intakeDetails: d.intakeDetails ?? null,
        mediaUploadPreference: d.mediaUploadPreference ?? null,
        fullPackageGbp: amount.fullPackageGbp,
        instalmentDueNowGbp: amount.instalmentDueNowGbp,
        instalmentRemainingGbp: amount.instalmentRemainingGbp,
      } as Prisma.InputJsonValue,
    },
  });

  return c.json({
    sessionId: session.id,
    checkoutUrl: session.url,
    paymentRecordId: paymentRecord.id,
  });
});

publicApiRoute.get("/checkout-status", async (c) => {
  const sessionId = c.req.query("session_id");
  if (!sessionId) {
    return c.json({ error: "missing_session_id" }, 400);
  }
  const payment = await prisma.paymentRecord.findFirst({
    where: { stripeSessionId: sessionId },
    select: { status: true, stripeSessionId: true, stripePaymentId: true, createdAt: true },
  });
  if (!payment) return c.json({ error: "not_found" }, 404);
  return c.json({ item: payment });
});

publicApiRoute.get("/portfolio", async (c) => {
  const items = await prisma.portfolioProject.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    select: {
      slug: true,
      eyebrow: true,
      title: true,
      intro: true,
      heroImage: true,
      sortOrder: true,
    },
  });
  return c.json({ items });
});

publicApiRoute.get("/portfolio/:slug", async (c) => {
  const slug = c.req.param("slug");
  const item = await prisma.portfolioProject.findFirst({
    where: { slug, published: true },
  });
  if (!item) return c.json({ error: "Not found" }, 404);
  return c.json(item);
});

publicApiRoute.get("/journal", async (c) => {
  const items = await prisma.journalPost.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    select: {
      slug: true,
      category: true,
      title: true,
      excerpt: true,
      publishedAt: true,
      status: true,
    },
  });
  return c.json({ items });
});

publicApiRoute.get("/journal/:slug", async (c) => {
  const slug = c.req.param("slug");
  const item = await prisma.journalPost.findFirst({
    where: { slug, status: "published" },
  });
  if (!item) return c.json({ error: "Not found" }, 404);
  return c.json(item);
});

publicApiRoute.get("/resources", async (c) => {
  const items = await prisma.resourceItem.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  return c.json({ items });
});

publicApiRoute.get("/testimonials", async (c) => {
  const items = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
  });
  return c.json({ items });
});
