import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { safePublicFetchDetail } from "@/lib/publicApi";

type JournalDetail = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  publishedAt: string | null;
};

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const res = await safePublicFetchDetail<JournalDetail>(`/api/public/journal/${params.slug}`);
    if (res.kind === "notFound") throw notFound();
    if (res.kind === "unavailable") return null;
    return res.data;
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
        <p className="max-w-xl text-muted-foreground">
          We couldn&rsquo;t load this post. If you&rsquo;re the site owner, set{" "}
          <code className="text-foreground">VITE_PUBLIC_API_URL</code> in Vercel, confirm the API is
          up, and allow this site&rsquo;s origin in the API <code className="text-foreground">CORS</code>{" "}
          settings.
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

      {data.coverImage ? (
        <div className="border-b border-border">
          <img
            src={data.coverImage}
            alt=""
            loading="eager"
            className="mx-auto max-h-[min(52vh,520px)] w-full max-w-[1600px] object-cover"
            width={1600}
            height={900}
          />
        </div>
      ) : null}

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
          className="journal-body mt-10 max-w-3xl space-y-6 text-base leading-relaxed text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-foreground [&_li]:mt-2 [&_p]:mt-6 [&_p:first-child]:mt-0 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
          dangerouslySetInnerHTML={{ __html: data.body }}
        />
      </Section>
    </>
  );
}
