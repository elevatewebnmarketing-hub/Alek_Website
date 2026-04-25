import type { PaymentStatus, Prisma } from "@prisma/client";
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

const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "succeeded", "failed", "refunded"];

function parseDateQuery(value: string | undefined, fallback: Date): Date {
  if (!value) return fallback;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? fallback : d;
}

/** YYYY-MM-DD in UTC */
function toUtcDateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

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

adminApiRoute.get("/payments", async (c) => {
  const now = new Date();
  const defaultFrom = new Date(now);
  defaultFrom.setUTCDate(defaultFrom.getUTCDate() - 30);

  const from = parseDateQuery(c.req.query("from"), defaultFrom);
  const to = parseDateQuery(c.req.query("to"), now);
  const statusParam = c.req.query("status");
  const statusFilter: { status?: PaymentStatus } =
    statusParam && PAYMENT_STATUSES.includes(statusParam as PaymentStatus)
      ? { status: statusParam as PaymentStatus }
      : {};

  const items = await prisma.paymentRecord.findMany({
    where: {
      createdAt: { gte: from, lte: to },
      ...statusFilter,
    },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return c.json({
    items,
    range: { from: from.toISOString(), to: to.toISOString() },
  });
});

adminApiRoute.get("/payments/summary", async (c) => {
  const now = new Date();
  const defaultFrom = new Date(now);
  defaultFrom.setUTCDate(defaultFrom.getUTCDate() - 30);

  const from = parseDateQuery(c.req.query("from"), defaultFrom);
  const to = parseDateQuery(c.req.query("to"), now);

  const rows = await prisma.paymentRecord.findMany({
    where: { createdAt: { gte: from, lte: to } },
    select: { status: true, amountCents: true, createdAt: true },
  });

  let succeeded = 0;
  let failed = 0;
  let refunded = 0;
  let pending = 0;
  let succeededCents = 0;

  const perDay = new Map<
    string,
    { succeeded: number; unsuccessful: number; pending: number; succeededCents: number }
  >();

  const ensureDay = (key: string) => {
    if (!perDay.has(key)) {
      perDay.set(key, { succeeded: 0, unsuccessful: 0, pending: 0, succeededCents: 0 });
    }
    return perDay.get(key)!;
  };

  for (const row of rows) {
    const key = toUtcDateKey(row.createdAt);
    const bucket = ensureDay(key);
    if (row.status === "succeeded") {
      succeeded += 1;
      succeededCents += row.amountCents;
      bucket.succeeded += 1;
      bucket.succeededCents += row.amountCents;
    } else if (row.status === "pending") {
      pending += 1;
      bucket.pending += 1;
    } else {
      failed += row.status === "failed" ? 1 : 0;
      refunded += row.status === "refunded" ? 1 : 0;
      bucket.unsuccessful += 1;
    }
  }

  const daily: {
    date: string;
    succeeded: number;
    unsuccessful: number;
    pending: number;
    succeededCents: number;
  }[] = [];

  const cursor = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  const end = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate()));
  while (cursor <= end) {
    const key = toUtcDateKey(cursor);
    const b = perDay.get(key) ?? { succeeded: 0, unsuccessful: 0, pending: 0, succeededCents: 0 };
    daily.push({
      date: key,
      succeeded: b.succeeded,
      unsuccessful: b.unsuccessful,
      pending: b.pending,
      succeededCents: b.succeededCents,
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return c.json({
    range: { from: from.toISOString(), to: to.toISOString() },
    totals: {
      succeeded,
      failed,
      refunded,
      pending,
      succeededCents,
    },
    daily,
  });
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
