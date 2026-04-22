import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { PortfolioCarousel, CarouselItem } from "@/components/PortfolioCarousel";
import { WONDERLAND_IMAGE_SLIDES, wonderlandCover } from "@/lib/portfolio/wonderland";

const AHLUWALIA_WONDERLAND_URL =
  "https://ahluwalia.world/blogs/our-world/wonderland-magazine";

export const Route = createFileRoute("/portfolio/wonderland")({
  head: () => ({
    meta: pageMeta({
      title: "Portfolio · Wonderland × Ahluwalia · Runway Refined by Alek",
      description:
        "Wonderland Magazine editorial with Ahluwalia SS24—red studio set, Acknowledgements collection, and full carousel of selects.",
      image: wonderlandCover,
      path: "/portfolio/wonderland",
    }),
  }),
  component: PortfolioWonderlandPage,
});

function PortfolioWonderlandPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio · Wonderland"
        title="Wonderland × Ahluwalia SS24."
        intro="Editorial frames from a Wonderland story tied to Ahluwalia’s Spring–Summer 24 collection, Acknowledgements—shot on a saturated red field with the label’s knit, patchwork, and tailoring signatures."
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
            <a
              href={AHLUWALIA_WONDERLAND_URL}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Ahluwalia’s official write-up of its Wonderland Magazine feature
            </a>{" "}
            situates the season around “different perspectives”: Creative Director
            Priya Ahluwalia discusses SS24 research into overlooked artists and
            makers, and techniques such as illusion knit—where jacquard and knit
            surfaces can read as a different colour depending on the angle.
          </p>
          <p>
            The same story spotlights specific SS24 pieces that appear in this
            edit—among them the Calypso knitted mini and Chikari patchwork boots
            on the red set, the Banebi embellished top and skirt, and the Akin
            track top and trousers in the two-model frame. (Wonderland has also covered
            other Ahluwalia seasons separately—for example AW24 with photography
            by Jivan West—so this page is scoped to the SS24 editorial world
            described on ahluwalia.world.)
          </p>
          <p>
            Below is a full-width carousel of selects; use previous and next to
            move through every frame. For the canonical masthead credits
            (photography, styling, beauty), refer to the published Wonderland
            piece—this site does not reproduce a masthead we have not verified
            line-by-line online.
          </p>
        </div>

        <div className="mt-14">
          <PortfolioCarousel>
            {WONDERLAND_IMAGE_SLIDES.map((image) => (
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
            to="/portfolio/vogue-africa"
            className="inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:underline"
          >
            <ArrowLeft className="size-4" /> Vogue Africa
          </Link>
          <Link
            to="/portfolio/runway"
            className="inline-flex items-center gap-3 border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
          >
            Runway highlights <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
