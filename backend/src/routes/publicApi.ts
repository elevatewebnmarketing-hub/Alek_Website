import { Hono } from "hono";
import type { Prisma } from "@prisma/client";
import { prisma } from "../db.js";
import { bookingIntentCreateSchema } from "../schemas.js";

export const publicApiRoute = new Hono();

/** Calendly-first: record which package and payment scope the user chose; checkout comes later. */
publicApiRoute.post("/booking-intent", async (c) => {
  const raw = await c.req.json().catch(() => null);
  const parsed = bookingIntentCreateSchema.safeParse(raw);
  if (!parsed.success) {
    return c.json(
      { error: "validation_error", details: parsed.error.flatten() },
      400,
    );
  }
  const d = parsed.data;
  const row = await prisma.bookingIntent.create({
    data: {
      packageSlug: d.packageSlug,
      paymentScope: d.paymentScope,
      contactEmail: d.contactEmail ?? null,
      notes: d.notes ?? null,
      pricingSnapshot: (d.pricingSnapshot as Prisma.InputJsonValue | undefined) ?? undefined,
    },
  });
  return c.json({ id: row.id });
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
