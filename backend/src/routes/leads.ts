import { Hono } from "hono";
import { leadCreateSchema } from "../schemas.js";
import { prisma } from "../db.js";

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

  return c.json({ id: lead.id }, 201);
});
