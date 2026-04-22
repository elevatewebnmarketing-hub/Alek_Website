import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import graziaLook1 from "@/assets/portfolio/grazia-look-1.png";
import graziaLook2 from "@/assets/portfolio/grazia-look-2.png";
import graziaLook3 from "@/assets/portfolio/grazia-look-3.png";
import graziaCover from "@/assets/portfolio/grazia-cover.png";
import giorgioArmaniRunway from "../../Videos/Giorgio Armani.mov";
import runwayFeature from "../../Videos/Modeling on the Runway.mov";
import runwayWalk1 from "../../Videos/Model Walking 1.mov";
import runwayWalk2 from "../../Videos/Model walking 2.mov";
import runwayWalk3 from "../../Videos/Model Walking 3.mov";
import runwayWalk4 from "../../Videos/Model walking.mov";
import bts1 from "../../Videos/BTS 1.mov";
import bts2 from "../../Videos/BTS 2.mov";
import bts3 from "../../Videos/BTS 3.mov";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: pageMeta({
      title: "Portfolio · Runway Refined by Alek",
      description:
        "Selected editorial and runway portfolio work by Alek Deng Malek, including Grazia feature imagery and runway highlights.",
      image: graziaCover,
      path: "/portfolio",
    }),
  }),
  component: PortfolioPage,
});

const GRAZIA_IMAGES = [
  {
    src: graziaCover,
    alt: "Grazia cover feature with Alek in an editorial white and black gown",
  },
  {
    src: graziaLook1,
    alt: "Alek in a Grazia editorial look with circular halo set design",
  },
  {
    src: graziaLook2,
    alt: "Alek in Grazia editorial collaboration with another model in studio",
  },
  {
    src: graziaLook3,
    alt: "Alek in a black and magenta editorial dress from the Grazia shoot",
  },
];

const RUNWAY_VIDEOS = [
  {
    src: giorgioArmaniRunway,
    title: "Giorgio Armani Runway",
    note: "A featured runway moment showcasing clean pacing, posture, and controlled transitions.",
  },
  {
    src: runwayFeature,
    title: "Modeling on the Runway",
    note: "Runway footage focused on presence, confidence, and floor command.",
  },
  {
    src: runwayWalk1,
    title: "Model Walking 1",
    note: "Practice-to-performance runway progression clip.",
  },
  {
    src: runwayWalk2,
    title: "Model Walking 2",
    note: "Additional runway segment focused on consistency in movement.",
  },
  {
    src: runwayWalk3,
    title: "Model Walking 3",
    note: "Runway clip highlighting controlled rhythm and presentation.",
  },
  {
    src: runwayWalk4,
    title: "Model Walking",
    note: "Editorial runway walk variation captured in live conditions.",
  },
];

const BTS_VIDEOS = [
  { src: bts1, title: "BTS 1" },
  { src: bts2, title: "BTS 2" },
  { src: bts3, title: "BTS 3" },
];

function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Editorial and runway work."
        intro="A curated look at standout collaborations, campaign imagery, and runway footage that reflect Alek's growth, discipline, and presence."
      />

      <Section className="border-b border-border">
        <div className="editorial-eyebrow">Featured collaboration</div>
        <h2 className="display-lg mt-6">Grazia feature story.</h2>
        <div className="mt-8 max-w-4xl space-y-5 text-base leading-relaxed text-muted-foreground">
          <p>
            Grazia is one of fashion's most recognised editorial platforms,
            known for spotlighting bold creative direction and high-impact
            visual storytelling.
          </p>
          <p>
            This shoot focused on strong silhouette, composure, and controlled
            expression. Every frame was built to communicate elegance, edge,
            and the confidence required in premium fashion spaces.
          </p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {GRAZIA_IMAGES.map((image) => (
            <figure key={image.src} className="overflow-hidden border border-border bg-secondary/20">
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="w-full object-cover"
              />
            </figure>
          ))}
        </div>
      </Section>

      <Section className="border-b border-border">
        <div className="editorial-eyebrow">Runway highlights</div>
        <h2 className="display-lg mt-6">From training floor to show floor.</h2>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground">
          These clips capture runway execution in different contexts, including
          Giorgio Armani footage and additional live runway sequences that show
          posture control, walk rhythm, and stage presence.
        </p>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {RUNWAY_VIDEOS.map((video) => (
            <article key={video.src} className="border border-border bg-secondary/20 p-5">
              <video
                controls
                playsInline
                preload="metadata"
                className="aspect-[9/16] w-full bg-black object-cover"
              >
                <source src={video.src} type="video/quicktime" />
                Your browser does not support this video format.
              </video>
              <h3 className="mt-4 font-serif text-2xl">{video.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{video.note}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="border-b border-border">
        <div className="editorial-eyebrow">Behind the scenes</div>
        <h2 className="display-lg mt-6">What the process looks like.</h2>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground">
          BTS moments from set and production days, showing preparation,
          direction, and how polished visuals are built before the final frame.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {BTS_VIDEOS.map((video) => (
            <article key={video.src} className="border border-border bg-secondary/20 p-4">
              <video
                controls
                playsInline
                preload="metadata"
                className="aspect-[9/16] w-full bg-black object-cover"
              >
                <source src={video.src} type="video/quicktime" />
                Your browser does not support this video format.
              </video>
              <h3 className="mt-4 font-serif text-xl">{video.title}</h3>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <div className="editorial-eyebrow">Work together</div>
          <h2 className="display-lg mt-6">Ready to build your own standout portfolio?</h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Train with direction, sharpen your positioning, and build the type
            of work that gets remembered.
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
