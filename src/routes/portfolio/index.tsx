import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { graziaCover } from "@/lib/portfolio/grazia";

export const Route = createFileRoute("/portfolio/")({
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

const PROJECTS = [
  {
    to: "/portfolio/grazia" as const,
    eyebrow: "Editorial",
    title: "Grazia feature",
    body: "Cover and campaign imagery with brand context and shoot notes.",
  },
  {
    to: "/portfolio/vogue-africa" as const,
    eyebrow: "Editorial",
    title: "Vogue Africa",
    body: "Cover-style concepts with bold colour, masthead styling, and portrait direction.",
  },
  {
    to: "/portfolio/wonderland" as const,
    eyebrow: "Editorial",
    title: "Wonderland × Ahluwalia",
    body: "SS24 Acknowledgements story on a red seamless set—knit, patchwork boots, and tailoring.",
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
        intro="Explore each project in full: copy, context, and media. Galleries and multi-clip sections use a carousel with previous and next controls."
      />

      <Section className="border-b border-border">
        <div className="grid auto-rows-fr gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-8">
          {PROJECTS.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="group flex h-full min-h-[280px] flex-col border border-border bg-background p-10 transition-[box-shadow,background-color,border-color] hover:border-foreground/20 hover:bg-secondary/30 hover:shadow-md sm:min-h-[300px] sm:p-12 lg:min-h-0 lg:p-14"
            >
              <div className="editorial-eyebrow">{p.eyebrow}</div>
              <h2 className="font-serif mt-7 text-3xl leading-[1.12] sm:text-[2rem] sm:leading-[1.1] lg:mt-8 lg:text-4xl lg:leading-[1.08]">
                {p.title}
              </h2>
              <p className="mt-6 max-w-md flex-1 text-base leading-[1.65] text-muted-foreground sm:text-[1.0625rem] sm:leading-[1.7] lg:mt-7">
                {p.body}
              </p>
              <span className="mt-10 inline-flex items-center gap-2.5 border-t border-border pt-8 text-[0.78rem] font-medium uppercase tracking-[0.22em] text-foreground/90 transition-colors group-hover:border-foreground/15 group-hover:text-foreground lg:pt-9">
                View project{" "}
                <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" />
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
