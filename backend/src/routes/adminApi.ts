import type { Prisma } from "@prisma/client";
import { Hono } from "hono";
import { prisma } from "../db.js";
import {
  journalCreateSchema,
  journalUpdateSchema,
  portfolioCreateSchema,
  portfolioUpdateSchema,
  resourceCreateSchema,
  resourceUpdateSchema,
  testimonialCreateSchema,
  testimonialUpdateSchema,
} from "../schemas.js";

export const adminApiRoute = new Hono();

adminApiRoute.get("/dashboard/summary", async (c) => {
  const now = new Date();
  const d7 = new Date(now);
  d7.setDate(d7.getDate() - 7);
  const d30 = new Date(now);
  d30.setDate(d30.getDate() - 30);
  const d14 = new Date(now);
  d14.setDate(d14.getDate() - 14);

  const [
    leads7,
    leads30,
    leadsBySource,
    portfolioCount,
    journalPublished,
    resourcesCount,
    testimonialsCount,
    paymentsAgg,
    leadsDaily,
  ] = await Promise.all([
    prisma.lead.count({ where: { createdAt: { gte: d7 } } }),
    prisma.lead.count({ where: { createdAt: { gte: d30 } } }),
    prisma.lead.groupBy({
      by: ["source"],
      _count: { id: true },
      where: { createdAt: { gte: d30 } },
    }),
    prisma.portfolioProject.count({ where: { published: true } }),
    prisma.journalPost.count({ where: { status: "published" } }),
    prisma.resourceItem.count({ where: { published: true } }),
    prisma.testimonial.count({ where: { published: true } }),
    prisma.paymentRecord.aggregate({
      where: { status: "succeeded", createdAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) } },
      _sum: { amountCents: true },
      _count: { id: true },
    }),
    prisma.lead.findMany({
      where: { createdAt: { gte: d14 } },
      select: { createdAt: true },
    }),
  ]);

  const byDay = new Map<string, number>();
  for (const l of leadsDaily) {
    const k = l.createdAt.toISOString().slice(0, 10);
    byDay.set(k, (byDay.get(k) ?? 0) + 1);
  }
  const daily = [...byDay.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));

  const paymentRecords = await prisma.paymentRecord.findMany({
    where: { createdAt: { gte: d14 } },
    orderBy: { createdAt: "asc" },
    select: { amountCents: true, currency: true, status: true, createdAt: true },
  });

  return c.json({
    leads: {
      last7Days: leads7,
      last30Days: leads30,
      bySource: leadsBySource.map((r) => ({ source: r.source, count: r._count.id })),
      daily,
    },
    content: {
      portfolio: portfolioCount,
      journalPublished,
      resources: resourcesCount,
      testimonials: testimonialsCount,
    },
    payments: {
      connected: false,
      note: "Wire Stripe webhooks to populate PaymentRecord; charts will fill automatically.",
      mtdCents: paymentsAgg._sum.amountCents ?? 0,
      mtdCount: paymentsAgg._count.id,
      recent: paymentRecords,
    },
  });
});

adminApiRoute.get("/leads", async (c) => {
  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: 500 });
  return c.json({ items: leads });
});

adminApiRoute.delete("/leads/:id", async (c) => {
  const id = c.req.param("id");
  await prisma.lead.delete({ where: { id } });
  return c.json({ ok: true });
});

adminApiRoute.get("/portfolio", async (c) => {
  const items = await prisma.portfolioProject.findMany({ orderBy: { sortOrder: "asc" } });
  return c.json({ items });
});

adminApiRoute.post("/portfolio", async (c) => {
  const body = await c.req.json();
  const parsed = portfolioCreateSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
  const item = await prisma.portfolioProject.create({
    data: {
      slug: parsed.data.slug,
      eyebrow: parsed.data.eyebrow,
      title: parsed.data.title,
      intro: parsed.data.intro,
      body: parsed.data.body,
      heroImage: parsed.data.heroImage ?? null,
      content: parsed.data.content as object,
      sortOrder: parsed.data.sortOrder ?? 0,
      published: parsed.data.published ?? true,
    },
  });
  return c.json(item, 201);
});

adminApiRoute.patch("/portfolio/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const parsed = portfolioUpdateSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
  const data: Prisma.PortfolioProjectUpdateInput = { ...parsed.data };
  if (parsed.data.content !== undefined) {
    data.content = parsed.data.content as Prisma.InputJsonValue;
  }
  const item = await prisma.portfolioProject.update({
    where: { id },
    data,
  });
  return c.json(item);
});

adminApiRoute.delete("/portfolio/:id", async (c) => {
  await prisma.portfolioProject.delete({ where: { id: c.req.param("id") } });
  return c.json({ ok: true });
});

adminApiRoute.get("/journal", async (c) => {
  const items = await prisma.journalPost.findMany({ orderBy: { updatedAt: "desc" } });
  return c.json({ items });
});

adminApiRoute.post("/journal", async (c) => {
  const body = await c.req.json();
  const parsed = journalCreateSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
  const item = await prisma.journalPost.create({
    data: {
      slug: parsed.data.slug,
      category: parsed.data.category,
      title: parsed.data.title,
      excerpt: parsed.data.excerpt,
      body: parsed.data.body,
      status: parsed.data.status ?? "draft",
      publishedAt: parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null,
    },
  });
  return c.json(item, 201);
});

adminApiRoute.patch("/journal/:id", async (c) => {
  const body = await c.req.json();
  const parsed = journalUpdateSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
  const raw: Prisma.JournalPostUpdateInput = { ...parsed.data };
  if (parsed.data.publishedAt !== undefined) {
    raw.publishedAt = parsed.data.publishedAt ? new Date(parsed.data.publishedAt) : null;
  }
  const item = await prisma.journalPost.update({
    where: { id: c.req.param("id") },
    data: raw,
  });
  return c.json(item);
});

adminApiRoute.delete("/journal/:id", async (c) => {
  await prisma.journalPost.delete({ where: { id: c.req.param("id") } });
  return c.json({ ok: true });
});

adminApiRoute.get("/resources", async (c) => {
  const items = await prisma.resourceItem.findMany({ orderBy: { sortOrder: "asc" } });
  return c.json({ items });
});

adminApiRoute.post("/resources", async (c) => {
  const body = await c.req.json();
  const parsed = resourceCreateSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
  const item = await prisma.resourceItem.create({
    data: {
      type: parsed.data.type,
      title: parsed.data.title,
      description: parsed.data.description,
      linkUrl: parsed.data.linkUrl ?? null,
      sortOrder: parsed.data.sortOrder ?? 0,
      published: parsed.data.published ?? true,
    },
  });
  return c.json(item, 201);
});

adminApiRoute.patch("/resources/:id", async (c) => {
  const body = await c.req.json();
  const parsed = resourceUpdateSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
  const item = await prisma.resourceItem.update({
    where: { id: c.req.param("id") },
    data: parsed.data,
  });
  return c.json(item);
});

adminApiRoute.delete("/resources/:id", async (c) => {
  await prisma.resourceItem.delete({ where: { id: c.req.param("id") } });
  return c.json({ ok: true });
});

adminApiRoute.get("/testimonials", async (c) => {
  const items = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
  return c.json({ items });
});

adminApiRoute.post("/testimonials", async (c) => {
  const body = await c.req.json();
  const parsed = testimonialCreateSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
  const item = await prisma.testimonial.create({
    data: {
      quote: parsed.data.quote,
      name: parsed.data.name,
      role: parsed.data.role ?? null,
      imageUrl: parsed.data.imageUrl ?? null,
      sortOrder: parsed.data.sortOrder ?? 0,
      published: parsed.data.published ?? true,
    },
  });
  return c.json(item, 201);
});

adminApiRoute.patch("/testimonials/:id", async (c) => {
  const body = await c.req.json();
  const parsed = testimonialUpdateSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: parsed.error.flatten() }, 400);
  const item = await prisma.testimonial.update({
    where: { id: c.req.param("id") },
    data: parsed.data,
  });
  return c.json(item);
});

adminApiRoute.delete("/testimonials/:id", async (c) => {
  await prisma.testimonial.delete({ where: { id: c.req.param("id") } });
  return c.json({ ok: true });
});
