import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { getPublicApiBase } from "@/lib/publicApi";

type JournalDetail = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  body: string;
  publishedAt: string | null;
};

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const base = getPublicApiBase();
    if (!base) return null;
    const r = await fetch(`${base}/api/public/journal/${params.slug}`);
    if (r.status === 404) throw notFound();
    if (!r.ok) throw new Error("Failed to load article");
    return (await r.json()) as JournalDetail;
  },
  head: ({ loaderData, params }) => {
    const path = `/blog/${params.slug}`;
    if (!loaderData) {
      return {
        meta: pageMeta({
          title: "Journal · Runway Refined by Alek",
          description: "Fashion industry insights and runway guidance.",
          path,
        }),
      };
    }
    return {
      meta: pageMeta({
        title: `${loaderData.title} · Journal · Runway Refined by Alek`,
        description: loaderData.excerpt,
        path,
      }),
    };
  },
  component: JournalArticlePage,
});

function JournalArticlePage() {
  const data = Route.useLoaderData();

  if (!data) {
    return (
      <Section>
        <p className="text-muted-foreground">
          Set <code className="text-foreground">VITE_PUBLIC_API_URL</code> to load journal posts.
        </p>
      </Section>
    );
  }

  const dateLabel = data.publishedAt
    ? new Date(data.publishedAt).toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <>
      <PageHero eyebrow={data.category} title={data.title} intro={data.excerpt} />

      <Section className="border-b border-border">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All journal
        </Link>
        {dateLabel ? (
          <p className="mt-6 text-sm uppercase tracking-[0.2em] text-muted-foreground">{dateLabel}</p>
        ) : null}
        <div
          className="journal-body mt-10 max-w-3xl space-y-6 text-base leading-relaxed text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_p]:mt-6 [&_p:first-child]:mt-0"
          dangerouslySetInnerHTML={{ __html: data.body }}
        />
      </Section>
    </>
  );
}
