import { z } from "zod";

export const portfolioContentSchema = z.object({
  imageSlides: z
    .array(
      z.object({
        src: z.string(),
        alt: z.string().optional(),
      }),
    )
    .optional(),
  videoSlides: z
    .array(
      z.object({
        src: z.string(),
        title: z.string(),
        note: z.string().optional(),
      }),
    )
    .optional(),
});

export const leadCreateSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  message: z.string().max(10_000).optional(),
  source: z.enum(["contact", "resources", "booking", "other"]).default("contact"),
  utmSource: z.string().max(120).optional(),
  utmMedium: z.string().max(120).optional(),
  utmCampaign: z.string().max(120).optional(),
});

export const portfolioCreateSchema = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  eyebrow: z.string().min(1).max(200),
  title: z.string().min(1).max(300),
  intro: z.string().min(1).max(5000),
  body: z.string().min(1).max(50_000),
  heroImage: z
    .union([z.string().url(), z.string().regex(/^\/.+/)])
    .nullable()
    .optional(),
  content: portfolioContentSchema,
  sortOrder: z.number().int().optional(),
  published: z.boolean().optional(),
});

export const portfolioUpdateSchema = portfolioCreateSchema.partial();

export const journalCreateSchema = z.object({
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/),
  category: z.string().min(1).max(120),
  title: z.string().min(1).max(300),
  excerpt: z.string().min(1).max(2000),
  body: z.string().min(1).max(100_000),
  status: z.enum(["draft", "published"]).optional(),
  publishedAt: z.string().datetime().nullable().optional(),
});

export const journalUpdateSchema = journalCreateSchema.partial();

export const resourceCreateSchema = z.object({
  type: z.string().min(1).max(80),
  title: z.string().min(1).max(300),
  description: z.string().min(1).max(5000),
  linkUrl: z.string().url().nullable().optional(),
  sortOrder: z.number().int().optional(),
  published: z.boolean().optional(),
});

export const resourceUpdateSchema = resourceCreateSchema.partial();

export const testimonialCreateSchema = z.object({
  quote: z.string().min(1).max(10_000),
  name: z.string().min(1).max(200),
  role: z.string().max(200).nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  sortOrder: z.number().int().optional(),
  published: z.boolean().optional(),
});

export const testimonialUpdateSchema = testimonialCreateSchema.partial();
