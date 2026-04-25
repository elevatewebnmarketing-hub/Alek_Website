import { Hono } from "hono";
import { leadCreateSchema } from "../schemas.js";
import { prisma } from "../db.js";
import { sendLeadNotification } from "../services/resend.js";

export const leadsRoute = new Hono();

leadsRoute.post("/", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const parsed = leadCreateSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Validation failed", details: parsed.error.flatten() }, 400);
  }

  const lead = await prisma.lead.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message ?? null,
      source: parsed.data.source,
      utmSource: parsed.data.utmSource,
      utmMedium: parsed.data.utmMedium,
      utmCampaign: parsed.data.utmCampaign,
    },
  });

  // Persisting the lead is the primary action. Email notifications are best-effort.
  try {
    await sendLeadNotification({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      source: lead.source,
      message: lead.message,
      utmSource: lead.utmSource,
      utmMedium: lead.utmMedium,
      utmCampaign: lead.utmCampaign,
      createdAt: lead.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("[resend] Failed to send lead notification:", error);
  }

  return c.json({ id: lead.id }, 201);
});
