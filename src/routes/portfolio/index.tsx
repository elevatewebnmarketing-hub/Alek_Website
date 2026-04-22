import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { graziaCover } from "@/lib/portfolioData";

export const Route = createFileRoute("/portfolio/")({
  head: () => ({
    meta: pageMeta({
      title: "Portfolio · Runway Refined by Alek",
      description:
        "Editorial, runway, and behind-the-scenes portfolio work by Alek Deng Malek.",
      image: graziaCover,
      path: "/portfolio",
    }),
  }),
  component: PortfolioIndexPage,
});

const PROJECTS = [
  {
    to: "/portfolio/grazia" as const,
    eyebrow: "Editorial",
    title: "Grazia feature",
    body: "Cover and campaign imagery with brand context and shoot notes.",
  },
  {
    to: "/portfolio/runway" as const,
    eyebrow: "Runway",
    title: "Runway highlights",
    body: "Show footage including Giorgio Armani and additional runway clips.",
  },
  {
    to: "/portfolio/bts" as const,
    eyebrow: "Process",
    title: "Behind the scenes",
    body: "On-set moments from production days and preparation.",
  },
];

function PortfolioIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Editorial and runway work."
        intro="Explore each project in full: copy, context, and media. Runway and BTS sections use a carousel when there are multiple clips."
      />

      <Section className="border-b border-border">
        <div className="grid gap-px bg-border md:grid-cols-3">
          {PROJECTS.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="group flex flex-col bg-background p-8 transition-colors hover:bg-secondary lg:p-10"
            >
              <div className="editorial-eyebrow">{p.eyebrow}</div>
              <h2 className="font-serif text-2xl mt-6 leading-tight lg:text-3xl">{p.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.22em]">
                View project <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <div className="editorial-eyebrow">Work together</div>
          <h2 className="display-lg mt-6">Ready to build work at this level?</h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Book coaching to refine runway, presence, and how you show up on camera and online.
          </p>
          <Link
            to="/booking"
            className="mt-10 inline-flex items-center gap-3 border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
          >
            Book a Session <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
