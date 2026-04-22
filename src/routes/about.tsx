import { createFileRoute, Link } from "@tanstack/react-router";
import portrait from "@/assets/alek-about-portrait.png";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: pageMeta({
      title: "About Alek Deng Malek · Runway Refined by Alek",
      description:
        "Meet Alek Deng Malek, the coach behind Runway Refined by Alek. UK-based coaching for aspiring and professional models worldwide.",
      image: portrait,
      path: "/about",
    }),
  }),
  component: AboutPage,
});

const PILLARS = [
  {
    label: "Runway craft",
    body: "Posture, stride, turns, pacing, and runway presence shaped around where you are now and where you want to go.",
  },
  {
    label: "Mindset & professionalism",
    body: "Confidence, body language, preparation, and habits that hold up when the pressure is on.",
  },
  {
    label: "Brand & content",
    body: "A personal plan for stronger content, a clearer online presence, and turning attention into real bookings.",
  },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Alek Deng Malek · model coach for confident, consistent growth."
        intro="Alek is based in the UK and coaches aspiring and professional models worldwide to build confidence, sharpen runway and camera presence, and grow a personal brand that opens real doors."
      />

      <Section className="border-b border-border">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <img
              src={portrait}
              alt="Alek Malek in an emerald green velvet suit, professional portrait for Runway Refined by Alek"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
              width={1080}
              height={1350}
            />
          </div>
          <div className="md:col-span-7 md:pl-6">
            <div className="editorial-eyebrow">The story</div>
            <h2 className="display-lg mt-6">A coach who builds careers, not just walks.</h2>
            <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground">
              <p>
                Alek is a dedicated model coach. She cares deeply about helping
                aspiring and professional models build confidence, develop a
                personal brand they believe in, and move forward in fashion and
                commercial work.
              </p>
              <p>
                She brings experience across posing, runway, photoshoots, and
                what the industry actually expects. She works closely with each
                model to draw out their strengths and presence on camera and on
                the runway.
              </p>
              <p>
                Her coaching goes beyond technique. Alek focuses on mindset,
                professionalism, and confidence so models feel prepared and
                expressive, not just photogenic, when castings and paid work
                are on the line.
              </p>
              <p>
                Whether you are just starting out or refining what you already
                do, her approach is personalised for the long haul: clear
                direction, honest feedback, and strategies for real growth,
                not quick fixes that fall apart next week.
              </p>
            </div>
            <Link
              to="/booking"
              className="mt-10 inline-flex items-center gap-3 border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
            >
              Work with Alek <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Section>

      <Section className="border-b border-border">
        <div className="editorial-eyebrow">The approach</div>
        <h2 className="display-lg mt-6 max-w-3xl">
          Three pillars. One refined model.
        </h2>
        <div className="mt-16 grid gap-px bg-border md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <div key={p.label} className="bg-background p-8">
              <div className="font-serif text-5xl text-muted-foreground/60">
                0{i + 1}
              </div>
              <h3 className="font-serif text-2xl mt-6">{p.label}</h3>
              <div className="rule mt-5" />
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
