import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { ArrowRight } from "lucide-react";
import { safePublicFetch } from "@/lib/publicApi";

type JournalListItem = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  publishedAt: string | null;
};

export const Route = createFileRoute("/blog")({
  loader: async () => {
    const j = await safePublicFetch<{ items: JournalListItem[] }>("/api/public/journal");
    if (!j) return { items: [] as JournalListItem[], offline: true as const };
    return { items: j.items, offline: false as const };
  },
  head: () => ({
    meta: pageMeta({
      title: "Journal · Runway Refined by Alek",
      description:
        "Fashion industry trend notes, runway guidance, and market insights from Alek Deng Malek.",
      path: "/blog",
    }),
  }),
  component: BlogPage,
});

function BlogPage() {
  const { items, offline } = Route.useLoaderData();

  return (
    <>
      <PageHero
        eyebrow="The Journal"
        title="Fashion trends, strategy, and model growth insights."
        intro="Short reads focused on fashion industry trends and what they mean for model growth, bookings, and long-term positioning."
      />

      <Section className="border-b border-border">
        {offline ? (
          <p className="mb-8 max-w-xl text-sm text-muted-foreground">
            Set <code className="text-foreground">VITE_PUBLIC_API_URL</code> to load posts from the CMS.
          </p>
        ) : null}
        <div className="grid gap-px bg-border md:grid-cols-2">
          {items.map((p, i) => (
            <article
              key={p.slug}
              className="group flex flex-col bg-background p-8 lg:p-12"
            >
              <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
                <span>{p.category}</span>
                <span>
                  {p.publishedAt
                    ? new Date(p.publishedAt).toLocaleDateString("en-GB", {
                        month: "short",
                        year: "numeric",
                      })
                    : "Draft"}
                </span>
              </div>
              <h2 className="font-serif text-3xl mt-6 leading-tight lg:text-4xl">
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="hover:underline decoration-1 underline-offset-4"
                >
                  {p.title}
                </Link>
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
              <Link
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="mt-8 inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
              >
                Read article {String(i + 1).padStart(2, "0")}{" "}
                <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </div>
        {items.length === 0 && !offline ? (
          <p className="py-12 text-center text-muted-foreground">No published posts yet.</p>
        ) : null}
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <div className="editorial-eyebrow">Want it in your inbox?</div>
          <h2 className="display-lg mt-6">Get notified when essays drop.</h2>
          <Link
            to="/resources"
            className="mt-8 inline-flex items-center gap-3 border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
          >
            Join the list <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
