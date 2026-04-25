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

const RESEND_API_URL = "https://api.resend.com/emails";

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendLeadNotification(input: LeadNotificationInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RESEND_TO_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  // Resend is optional. When env vars are missing we skip sending.
  if (!apiKey || !to || !from) return;

  const safeName = escapeHtml(input.name);
  const safeEmail = escapeHtml(input.email);
  const safeSource = escapeHtml(input.source);
  const safeMessage = escapeHtml((input.message ?? "").trim()) || "—";
  const safeUtmSource = escapeHtml(input.utmSource ?? "") || "—";
  const safeUtmMedium = escapeHtml(input.utmMedium ?? "") || "—";
  const safeUtmCampaign = escapeHtml(input.utmCampaign ?? "") || "—";

  const subject = `New ${input.source} lead: ${input.name}`;
  const html = `
    <h2>New lead received</h2>
    <p><strong>Name:</strong> ${safeName}</p>
    <p><strong>Email:</strong> ${safeEmail}</p>
    <p><strong>Source:</strong> ${safeSource}</p>
    <p><strong>Message:</strong><br/>${safeMessage.replace(/\n/g, "<br/>")}</p>
    <hr/>
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
    `Message: ${(input.message ?? "").trim() || "—"}`,
    "",
    `Lead ID: ${input.id}`,
    `Created at: ${input.createdAt}`,
    `utm_source: ${input.utmSource ?? "—"}`,
    `utm_medium: ${input.utmMedium ?? "—"}`,
    `utm_campaign: ${input.utmCampaign ?? "—"}`,
  ].join("\n");

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
      text,
      reply_to: input.email,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend request failed (${response.status}): ${details}`);
  }
}

