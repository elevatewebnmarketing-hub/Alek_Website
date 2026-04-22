import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { PortfolioVideoCarousel } from "@/components/PortfolioVideoCarousel";
import { BTS_VIDEO_SLIDES } from "@/lib/portfolio/btsVideos";
import { graziaCover } from "@/lib/portfolio/grazia";

export const Route = createFileRoute("/portfolio/bts")({
  head: () => ({
    meta: pageMeta({
      title: "Portfolio · Behind the scenes · Runway Refined by Alek",
      description:
        "Behind-the-scenes video from set days and production with Alek Deng Malek.",
      image: graziaCover,
      path: "/portfolio/bts",
    }),
  }),
  component: PortfolioBtsPage,
});

function PortfolioBtsPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio · BTS"
        title="What the process looks like."
        intro="Behind-the-scenes footage shows how direction, timing, and environment shape the final image. These clips are from real set days and production moments."
      />

      <Section className="border-b border-border">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All portfolio
        </Link>

        <div className="mt-10 max-w-3xl space-y-6 text-base leading-relaxed text-muted-foreground">
          <p>
            BTS material matters for models learning the industry: you see pacing
            on set, how teams communicate, and how small adjustments in posture
            or timing change the frame. It is also honest proof of experience in
            professional environments.
          </p>
          <p>
            Scroll the carousel with the previous and next controls, or open any
            clip in a new tab if inline playback is limited on your device.
          </p>
        </div>

        <div className="mt-14">
          <PortfolioVideoCarousel slides={BTS_VIDEO_SLIDES} />
        </div>
      </Section>

      <Section>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <Link
            to="/portfolio/runway"
            className="inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:underline"
          >
            <ArrowLeft className="size-4" /> Runway highlights
          </Link>
          <Link
            to="/booking"
            className="inline-flex items-center gap-3 border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
          >
            Book a Session <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
