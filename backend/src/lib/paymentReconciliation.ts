import type { PaymentRecord, PaymentStatus, Prisma } from "@prisma/client";
import Stripe from "stripe";
import { prisma } from "../db.js";
import { sendPaymentCompletedNotification } from "../services/resend.js";

type MetadataObject = Record<string, unknown>;

const SUCCESS_EMAIL_SENT_KEY = "paymentCompletedEmailSentAt";

export function getStripeClient(): Stripe | null {
  const secret = process.env.STRIPE_SECRET_KEY;
  return secret ? new Stripe(secret) : null;
}

function toMetadataObject(value: Prisma.JsonValue | null | undefined): MetadataObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as MetadataObject;
}

export function isPaymentCompletedEmailSent(value: Prisma.JsonValue | null | undefined): boolean {
  const metadata = toMetadataObject(value);
  const sentAt = metadata[SUCCESS_EMAIL_SENT_KEY];
  return typeof sentAt === "string" && sentAt.length > 0;
}

function withPaymentCompletedEmailSent(
  value: Prisma.JsonValue | null | undefined,
  timestampIso: string,
): Prisma.InputJsonValue {
  const metadata = toMetadataObject(value);
  return { ...metadata, [SUCCESS_EMAIL_SENT_KEY]: timestampIso } as Prisma.InputJsonValue;
}

function deriveStatus(session: Stripe.Checkout.Session): PaymentStatus {
  if (session.payment_status === "paid") return "succeeded";
  if (session.status === "expired") return "failed";
  if (session.status === "complete" && session.payment_status !== "paid") return "failed";
  return "pending";
}

export async function reconcilePaymentRecordBySessionId(
  stripe: Stripe,
  stripeSessionId: string,
): Promise<PaymentRecord | null> {
  const existing = await prisma.paymentRecord.findFirst({ where: { stripeSessionId } });
  if (!existing) return null;
  return reconcilePaymentRecord(stripe, existing);
}

export async function reconcilePaymentRecord(stripe: Stripe, existing: PaymentRecord): Promise<PaymentRecord> {
  if (!existing.stripeSessionId) return existing;

  const session = await stripe.checkout.sessions.retrieve(existing.stripeSessionId, {
    expand: ["payment_intent"],
  });
  const nextStatus = deriveStatus(session);
  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;
  const statusChanged = existing.status !== nextStatus;

  if (!statusChanged && !(nextStatus === "succeeded" && !isPaymentCompletedEmailSent(existing.metadata))) {
    return existing;
  }

  let mergedMetadata = {
    ...toMetadataObject(existing.metadata),
    ...(session.metadata ?? {}),
  } as Prisma.InputJsonValue;

  if (nextStatus === "succeeded" && !isPaymentCompletedEmailSent(mergedMetadata)) {
    try {
      await sendPaymentCompletedNotification({
        customerEmail: session.customer_details?.email ?? existing.customerEmail,
        packageSlug:
          typeof session.metadata?.packageSlug === "string"
            ? session.metadata.packageSlug
            : (toMetadataObject(existing.metadata).packageSlug as string | undefined) ?? null,
        paymentScope:
          typeof session.metadata?.paymentScope === "string"
            ? session.metadata.paymentScope
            : (toMetadataObject(existing.metadata).paymentScope as string | undefined) ?? null,
        selectedOneTimeOption:
          typeof session.metadata?.selectedOneTimeOption === "string"
            ? session.metadata.selectedOneTimeOption
            : (toMetadataObject(existing.metadata).selectedOneTimeOption as string | undefined) ?? null,
        stripeSessionId: session.id,
        stripePaymentId: paymentIntentId,
        amountCents: session.amount_total ?? existing.amountCents,
        currency: session.currency ?? existing.currency,
        completedAt: new Date().toISOString(),
      });
      mergedMetadata = withPaymentCompletedEmailSent(mergedMetadata, new Date().toISOString());
    } catch (error) {
      console.error("[resend] Failed to send payment-completed notification:", error);
    }
  }

  const updated = await prisma.paymentRecord.update({
    where: { id: existing.id },
    data: {
      status: nextStatus,
      stripePaymentId: paymentIntentId ?? existing.stripePaymentId,
      customerEmail: session.customer_details?.email ?? existing.customerEmail,
      metadata: mergedMetadata,
    },
  });

  return updated;
}
