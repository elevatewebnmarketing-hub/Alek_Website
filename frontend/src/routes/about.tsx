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
        intro="UK-based coach to models worldwide: runway and casting craft, composure under brief, and a clearer path from visibility to booked work."
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
                I'm a model coach helping aspiring models break into the
                industry with clarity, confidence, and strategy.
              </p>
              <p>
                After facing consistent rejection in my own modelling journey,
                I learned how the industry really works-what agencies look for,
                what they don't say, and why good models still get overlooked.
              </p>
              <p>
                Now I help new models avoid the same mistakes, handle rejection
                without losing confidence, and position themselves in a way
                that actually gets attention.
              </p>
              <p>
                This isn't about perfection-it's about understanding the game
                and playing it smart.
              </p>
            </div>
            <Link
              to="/services"
              className="mt-10 inline-flex items-center gap-3 border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
            >
              Explore Services <ArrowRight className="size-4" />
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
