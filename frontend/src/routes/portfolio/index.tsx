import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { safePublicFetch } from "@/lib/publicApi";
import graziaCover from "@/assets/portfolio/grazia-cover.png";

type PortfolioListItem = {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  heroImage: string | null;
};

export const Route = createFileRoute("/portfolio/")({
  loader: async () => {
    const j = await safePublicFetch<{ items: PortfolioListItem[] }>("/api/public/portfolio");
    if (!j) return { items: [] as PortfolioListItem[], offline: true as const };
    return { items: j.items, offline: false as const };
  },
  head: () => ({
    meta: pageMeta({
      title: "Portfolio · Runway Refined by Alek",
      description:
        "Editorial (Grazia, Vogue Africa, Wonderland × Ahluwalia), runway, and behind-the-scenes portfolio work by Alek Deng Malek.",
      image: graziaCover,
      path: "/portfolio",
    }),
  }),
  component: PortfolioIndexPage,
});

function PortfolioIndexPage() {
  const { items, offline } = Route.useLoaderData();

  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Editorial and runway work."
        intro="Explore each project in full: copy, context, and media. Galleries and multi-clip sections use a carousel with previous and next controls."
      />

      <Section className="border-b border-border">
        {offline ? (
          <p className="max-w-xl text-sm text-muted-foreground">
            Connect <code className="text-foreground">VITE_PUBLIC_API_URL</code> to load portfolio projects
            from the API.
          </p>
        ) : null}
        <div className="grid auto-rows-fr gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
          {items.map((p) => (
            <Link
              key={p.slug}
              to="/portfolio/$slug"
              params={{ slug: p.slug }}
              className="group flex h-full min-h-[280px] flex-col border border-border bg-background p-10 transition-[box-shadow,background-color,border-color] hover:border-foreground/20 hover:bg-secondary/30 hover:shadow-md sm:min-h-[300px] sm:p-12 lg:min-h-0 lg:p-14"
            >
              <div className="editorial-eyebrow">{p.eyebrow}</div>
              <h2 className="font-serif mt-7 text-3xl leading-[1.12] sm:text-[2rem] sm:leading-[1.1] lg:mt-8 lg:text-4xl lg:leading-[1.08]">
                {p.title}
              </h2>
              <p className="mt-6 max-w-md flex-1 text-base leading-[1.65] text-muted-foreground sm:text-[1.0625rem] sm:leading-[1.7] lg:mt-7">
                {p.intro}
              </p>
              <span className="mt-10 inline-flex items-center gap-2.5 border-t border-border pt-8 text-[0.78rem] font-medium uppercase tracking-[0.22em] text-foreground/90 transition-colors group-hover:border-foreground/15 group-hover:text-foreground lg:pt-9">
                View project{" "}
                <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
