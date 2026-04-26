type LeadNotificationInput = {
  id: string;
  name: string;
  email: string;
  source: "contact" | "resources" | "booking" | "other";
  message?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  createdAt: string;
};

type PaymentStartedInput = {
  customerEmail: string;
  packageSlug: string;
  paymentScope: string;
  selectedOneTimeOption?: string | null;
  intakeDetails?: string | null;
  stripeSessionId: string;
  createdAt: string;
};

type PaymentCompletedInput = {
  customerEmail?: string | null;
  packageSlug?: string | null;
  paymentScope?: string | null;
  selectedOneTimeOption?: string | null;
  stripeSessionId: string;
  stripePaymentId?: string | null;
  amountCents?: number | null;
  currency?: string | null;
  completedAt: string;
};

const RESEND_API_URL = "https://api.resend.com/emails";
const PAYMENT_ALERT_TO = "runwayrefinedofficial@gmail.com";

function getLogoUrl(): string {
  const siteUrl = (process.env.SITE_URL ?? "http://localhost:5173").replace(/\/$/, "");
  return `${siteUrl}/email-assets/runway-refined-email-logo.png`;
}

function buildEmailShell(contentHtml: string): string {
  const logoUrl = getLogoUrl();
  return `
    <div style="margin:0;background:#0b0b0d;padding:28px 12px;font-family:Arial,sans-serif;color:#e8e8ea;">
      <div style="max-width:640px;margin:0 auto;background:#121216;border:1px solid #2a2a2f;border-radius:12px;overflow:hidden;">
        <div style="padding:22px 24px;border-bottom:1px solid #25252a;background:#101014;text-align:center;">
          <img src="${logoUrl}" alt="Runway Refined" style="max-width:220px;width:100%;height:auto;display:block;margin:0 auto;" />
        </div>
        <div style="padding:22px 24px;line-height:1.55;font-size:14px;">
          ${contentHtml}
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type SendEmailInput = {
  to: string;
  subject: string;
  htmlContent: string;
  text: string;
  replyTo?: string;
};

async function sendEmail(input: SendEmailInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return;

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      html: buildEmailShell(input.htmlContent),
      text: input.text,
      reply_to: input.replyTo,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend request failed (${response.status}): ${details}`);
  }
}

export async function sendLeadNotification(input: LeadNotificationInput): Promise<void> {
  const to = process.env.RESEND_TO_EMAIL;
  if (!to) return;

  const safeName = escapeHtml(input.name);
  const safeEmail = escapeHtml(input.email);
  const safeSource = escapeHtml(input.source);
  const safeMessage = escapeHtml((input.message ?? "").trim()) || "N/A";
  const safeUtmSource = escapeHtml(input.utmSource ?? "") || "N/A";
  const safeUtmMedium = escapeHtml(input.utmMedium ?? "") || "N/A";
  const safeUtmCampaign = escapeHtml(input.utmCampaign ?? "") || "N/A";

  const htmlContent = `
    <h2 style="margin:0 0 10px;font-size:20px;color:#ffffff;">New lead received</h2>
    <p><strong>Name:</strong> ${safeName}</p>
    <p><strong>Email:</strong> ${safeEmail}</p>
    <p><strong>Source:</strong> ${safeSource}</p>
    <p><strong>Message:</strong><br/>${safeMessage.replace(/\n/g, "<br/>")}</p>
    <hr style="border:none;border-top:1px solid #2f2f34;margin:16px 0;" />
    <p><strong>Lead ID:</strong> ${escapeHtml(input.id)}</p>
    <p><strong>Created at:</strong> ${escapeHtml(input.createdAt)}</p>
    <p><strong>utm_source:</strong> ${safeUtmSource}</p>
    <p><strong>utm_medium:</strong> ${safeUtmMedium}</p>
    <p><strong>utm_campaign:</strong> ${safeUtmCampaign}</p>
  `;

  const text = [
    "New lead received",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Source: ${input.source}`,
    `Message: ${(input.message ?? "").trim() || "N/A"}`,
    "",
    `Lead ID: ${input.id}`,
    `Created at: ${input.createdAt}`,
    `utm_source: ${input.utmSource ?? "N/A"}`,
    `utm_medium: ${input.utmMedium ?? "N/A"}`,
    `utm_campaign: ${input.utmCampaign ?? "N/A"}`,
  ].join("\n");

  await sendEmail({
    to,
    subject: `New ${input.source} lead: ${input.name}`,
    htmlContent,
    text,
    replyTo: input.email,
  });
}

export async function sendPaymentStartedNotification(input: PaymentStartedInput): Promise<void> {
  const safeEmail = escapeHtml(input.customerEmail);
  const safePackage = escapeHtml(input.packageSlug);
  const safeScope = escapeHtml(input.paymentScope);
  const safeItem = escapeHtml(input.selectedOneTimeOption ?? "N/A");
  const safeDetails = escapeHtml((input.intakeDetails ?? "").trim()) || "N/A";
  const safeSession = escapeHtml(input.stripeSessionId);
  const safeCreatedAt = escapeHtml(input.createdAt);

  const htmlContent = `
    <h2 style="margin:0 0 10px;font-size:20px;color:#ffffff;">Payment process started</h2>
    <p>A customer has started the payment process.</p>
    <p><strong>Customer email:</strong> ${safeEmail}</p>
    <p><strong>Package:</strong> ${safePackage}</p>
    <p><strong>Payment scope:</strong> ${safeScope}</p>
    <p><strong>Selected one item:</strong> ${safeItem}</p>
    <p><strong>Intake details:</strong> ${safeDetails}</p>
    <hr style="border:none;border-top:1px solid #2f2f34;margin:16px 0;" />
    <p><strong>Stripe session ID:</strong> ${safeSession}</p>
    <p><strong>Status:</strong> started payment process</p>
    <p><strong>Created at:</strong> ${safeCreatedAt}</p>
  `;

  const text = [
    "Payment process started",
    `Customer email: ${input.customerEmail}`,
    `Package: ${input.packageSlug}`,
    `Payment scope: ${input.paymentScope}`,
    `Selected one item: ${input.selectedOneTimeOption ?? "N/A"}`,
    `Intake details: ${(input.intakeDetails ?? "").trim() || "N/A"}`,
    `Stripe session ID: ${input.stripeSessionId}`,
    "Status: started payment process",
    `Created at: ${input.createdAt}`,
  ].join("\n");

  await sendEmail({
    to: PAYMENT_ALERT_TO,
    subject: `Payment started: ${input.packageSlug}`,
    htmlContent,
    text,
    replyTo: input.customerEmail,
  });
}

export async function sendPaymentCompletedNotification(input: PaymentCompletedInput): Promise<void> {
  const safeEmail = escapeHtml(input.customerEmail ?? "N/A");
  const safePackage = escapeHtml(input.packageSlug ?? "N/A");
  const safeScope = escapeHtml(input.paymentScope ?? "N/A");
  const safeItem = escapeHtml(input.selectedOneTimeOption ?? "N/A");
  const safeSession = escapeHtml(input.stripeSessionId);
  const safePayment = escapeHtml(input.stripePaymentId ?? "N/A");
  const amount = typeof input.amountCents === "number" ? (input.amountCents / 100).toFixed(2) : "N/A";
  const currency = (input.currency ?? "gbp").toUpperCase();
  const safeCompletedAt = escapeHtml(input.completedAt);

  const htmlContent = `
    <h2 style="margin:0 0 10px;font-size:20px;color:#ffffff;">Payment completed</h2>
    <p>A payment has been completed successfully.</p>
    <p><strong>Customer email:</strong> ${safeEmail}</p>
    <p><strong>Package:</strong> ${safePackage}</p>
    <p><strong>Payment scope:</strong> ${safeScope}</p>
    <p><strong>Selected one item:</strong> ${safeItem}</p>
    <p><strong>Amount:</strong> ${amount} ${escapeHtml(currency)}</p>
    <hr style="border:none;border-top:1px solid #2f2f34;margin:16px 0;" />
    <p><strong>Stripe session ID:</strong> ${safeSession}</p>
    <p><strong>Stripe payment ID:</strong> ${safePayment}</p>
    <p><strong>Status:</strong> payment completed</p>
    <p><strong>Completed at:</strong> ${safeCompletedAt}</p>
  `;

  const text = [
    "Payment completed",
    `Customer email: ${input.customerEmail ?? "N/A"}`,
    `Package: ${input.packageSlug ?? "N/A"}`,
    `Payment scope: ${input.paymentScope ?? "N/A"}`,
    `Selected one item: ${input.selectedOneTimeOption ?? "N/A"}`,
    `Amount: ${amount} ${currency}`,
    `Stripe session ID: ${input.stripeSessionId}`,
    `Stripe payment ID: ${input.stripePaymentId ?? "N/A"}`,
    "Status: payment completed",
    `Completed at: ${input.completedAt}`,
  ].join("\n");

  await sendEmail({
    to: PAYMENT_ALERT_TO,
    subject: `Payment completed: ${input.packageSlug ?? "Unknown package"}`,
    htmlContent,
    text,
    replyTo: input.customerEmail ?? undefined,
  });
}

