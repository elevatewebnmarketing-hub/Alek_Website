import { createFileRoute, Link } from "@tanstack/react-router";
import portrait from "@/assets/alek-about-portrait.png";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: pageMeta({
      title: "About Alek Deng Malek — Model Coach",
      description:
        "Meet Alek Deng Malek, a model coach helping aspiring and professional models build confidence, refine their craft, and grow in fashion and commercial work.",
      image: portrait,
      path: "/about",
    }),
  }),
  component: AboutPage,
});

const PILLARS = [
  {
    label: "Runway craft",
    body: "Posture, stride, turns, pacing, and runway presence built around your level and goals.",
  },
  {
    label: "Mindset & professionalism",
    body: "Confidence, body language, preparation, and professional habits that help you perform under pressure.",
  },
  {
    label: "Brand & content",
    body: "Personalised strategy to improve content quality, strengthen your online presence, and convert attention into paying clients.",
  },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Alek Deng Malek — model coach for confident, consistent growth."
        intro="Alek helps aspiring and professional models build confidence, improve their runway and camera presence, and grow a personal brand that leads to real opportunities."
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
                Alek is a dedicated model coach with a passion for helping
                aspiring and professional models build confidence, develop
                their personal brand, and succeed in the fashion and
                commercial industries.
              </p>
              <p>
                With experience across posing, runway, photoshoots, and
                industry expectations, he works closely with each model to
                bring out their strengths and presence in front of the camera
                and on the runway.
              </p>
              <p>
                His coaching goes beyond technique. Alek focuses on mindset,
                professionalism, and confidence so models are not only
                photogenic, but prepared, expressive, and ready to perform at
                castings and paid opportunities.
              </p>
              <p>
                Whether you are just starting out or refining existing skills,
                his approach is personalised for long-term progress: clear
                direction, honest feedback, and strategies built for real
                growth instead of quick, unsustainable tactics.
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
