import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { PortfolioCarousel, CarouselItem } from "@/components/PortfolioCarousel";
import { RUNWAY_VIDEO_SLIDES, graziaCover } from "@/lib/portfolioData";

export const Route = createFileRoute("/portfolio/runway")({
  head: () => ({
    meta: pageMeta({
      title: "Portfolio · Runway · Runway Refined by Alek",
      description:
        "Runway portfolio: Giorgio Armani and additional show and practice footage.",
      image: graziaCover,
      path: "/portfolio/runway",
    }),
  }),
  component: PortfolioRunwayPage,
});

function PortfolioRunwayPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio · Runway"
        title="From training floor to show floor."
        intro="Runway work demands repeatable technique: pacing, posture, turns, and the ability to stay present when the room is watching. This section gathers standout clips from shows and practice, including Giorgio Armani."
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
            The Giorgio Armani clip anchors this page: a luxury house where walk
            quality, restraint, and line matter as much as the clothes. The
            additional reels show how the same principles apply across different
            venues, from high-concept staging to more direct runway practice.
          </p>
          <p>
            Each video is labelled below the player. Use the carousel controls to
            move between clips, or open a file directly if your browser prefers
            that for playback.
          </p>
        </div>

        <div className="mt-14">
          <PortfolioCarousel>
            {RUNWAY_VIDEO_SLIDES.map((video) => (
              <CarouselItem key={video.src} className="pl-2 md:pl-4">
                <div className="border border-border bg-secondary/20 p-4 md:p-5">
                  <video
                    src={video.src}
                    controls
                    playsInline
                    preload="metadata"
                    className="portfolio-carousel-video aspect-[9/16] w-full bg-black object-cover"
                  />
                  <h3 className="mt-4 font-serif text-2xl">{video.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{video.note}</p>
                  <a
                    href={video.src}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-[0.72rem] font-medium uppercase tracking-[0.2em] underline-offset-8 hover:underline"
                  >
                    Open video
                  </a>
                </div>
              </CarouselItem>
            ))}
          </PortfolioCarousel>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <Link
            to="/portfolio/wonderland"
            className="inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:underline"
          >
            <ArrowLeft className="size-4" /> Wonderland × Ahluwalia
          </Link>
          <Link
            to="/portfolio/bts"
            className="inline-flex items-center gap-3 border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
          >
            Behind the scenes <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
