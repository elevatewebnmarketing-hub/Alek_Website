import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { PortfolioCarousel, CarouselItem } from "@/components/PortfolioCarousel";
import { GRAZIA_IMAGE_SLIDES, graziaCover } from "@/lib/portfolioData";

export const Route = createFileRoute("/portfolio/grazia")({
  head: () => ({
    meta: pageMeta({
      title: "Portfolio · Grazia · Runway Refined by Alek",
      description:
        "Grazia editorial feature: brand context, shoot story, and image gallery.",
      image: graziaCover,
      path: "/portfolio/grazia",
    }),
  }),
  component: PortfolioGraziaPage,
});

function PortfolioGraziaPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio · Grazia"
        title="Grazia feature story."
        intro="An editorial collaboration with one of fashion's most recognised magazine platforms, built around silhouette, composure, and high-impact visual storytelling."
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
            Grazia is an international fashion and lifestyle title known for sharp
            editorial direction and campaigns that blend luxury with cultural
            relevance. Features in Grazia sit alongside seasonal fashion narratives,
            designer spotlights, and the conversations shaping how brands show up
            in print and online.
          </p>
          <p>
            This shoot leaned into sculptural tailoring, graphic contrast, and a
            calm, deliberate presence in front of the camera. The creative brief
            called for clarity in posture, a controlled gaze, and wardrobe that
            reads as confident rather than decorative, so the images would hold
            up as both editorial art direction and professional portfolio work.
          </p>
          <p>
            Below is the full set of selects from this collaboration. Use the
            previous and next controls to move through each frame.
          </p>
        </div>

        <div className="mt-14">
          <PortfolioCarousel>
            {GRAZIA_IMAGE_SLIDES.map((image) => (
              <CarouselItem key={image.src} className="pl-2 md:pl-4">
                <figure className="overflow-hidden border border-border bg-secondary/20">
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="w-full object-cover"
                  />
                </figure>
              </CarouselItem>
            ))}
          </PortfolioCarousel>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="editorial-eyebrow">Next</div>
            <h2 className="font-serif text-2xl mt-4">Runway highlights</h2>
          </div>
          <Link
            to="/portfolio/runway"
            className="inline-flex items-center gap-3 border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
          >
            Continue <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
