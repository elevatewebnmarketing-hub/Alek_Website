import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { PortfolioCarousel, CarouselItem } from "@/components/PortfolioCarousel";
import { VOGUE_AFRICA_IMAGE_SLIDES, vogueAfricaCover } from "@/lib/portfolioData";

export const Route = createFileRoute("/portfolio/vogue-africa")({
  head: () => ({
    meta: pageMeta({
      title: "Portfolio · Vogue Africa · Runway Refined by Alek",
      description:
        "Vogue Africa editorial cover concepts: bold colour, masthead styling, and luxury portrait direction.",
      image: vogueAfricaCover,
      path: "/portfolio/vogue-africa",
    }),
  }),
  component: PortfolioVogueAfricaPage,
});

function PortfolioVogueAfricaPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio · Vogue Africa"
        title="Cover challenge, editorial scale."
        intro="These frames are part of the Vogue Africa cover conversation: high-contrast colour, precise typography, and portraiture that reads as campaign-level from the first glance."
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
            The Vogue Africa name signals continental fashion authority: covers
            that balance luxury codes with cultural specificity. Participating in
            cover-style challenges is a way to stress-test lighting, wardrobe
            narrative, and how you hold space when the layout is as loud as the
            clothes.
          </p>
          <p>
            The first image leans into graphic contrast: saturated yellow field,
            magenta tailoring, and a clean masthead read. The second is a tighter
            editorial portrait with warm sculpting light and jewellery as the
            secondary story. Together they show two valid directions for the same
            brief: bold set piece versus intimate luxury detail.
          </p>
          <p>
            Use the carousel controls below to move between both covers at full
            width.
          </p>
        </div>

        <div className="mt-14">
          <PortfolioCarousel>
            {VOGUE_AFRICA_IMAGE_SLIDES.map((image) => (
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
          <Link
            to="/portfolio/grazia"
            className="inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:underline"
          >
            <ArrowLeft className="size-4" /> Grazia feature
          </Link>
          <Link
            to="/portfolio/wonderland"
            className="inline-flex items-center gap-3 border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
          >
            Wonderland × Ahluwalia <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
