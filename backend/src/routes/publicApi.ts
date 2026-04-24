import { Hono } from "hono";
import { prisma } from "../db.js";

export const publicApiRoute = new Hono();

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
