import { createFileRoute, Link } from "@tanstack/react-router";
import portrait from "@/assets/about-portrait.jpg";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: pageMeta({
      title: "About Alek Deng Malek — Model Coach",
      description:
        "Meet Alek Deng Malek, a dedicated model coach helping aspiring and professional models build confidence, develop their brand, and succeed in fashion.",
      image: portrait,
      path: "/about",
    }),
  }),
  component: AboutPage,
});

const PILLARS = [
  {
    label: "Runway craft",
    body: "Posture, stride, tempo, turns, presence — the technical foundation that castings notice instantly.",
  },
  {
    label: "Mindset & confidence",
    body: "The internal work that lets your walk land. Calm in the room, bold on the runway.",
  },
  {
    label: "Brand & content",
    body: "Strategy that turns your visibility into paying clients and long-term opportunities.",
  },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Alek Deng Malek — model coach for the long career."
        intro="Alek is a dedicated model coach helping aspiring and professional models build confidence, develop their personal brand, and succeed in the fashion industry. His coaching focuses on runway skills, mindset, and industry readiness, helping models stand out and grow."
      />

      <Section className="border-b border-border">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <img
              src={portrait}
              alt="Editorial portrait suggesting Alek's coaching philosophy"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
              width={1080}
              height={1350}
            />
            <div className="editorial-eyebrow mt-4">[Replace with Alek's portrait]</div>
          </div>
          <div className="md:col-span-7 md:pl-6">
            <div className="editorial-eyebrow">The story</div>
            <h2 className="display-lg mt-6">A coach who builds careers, not just walks.</h2>
            <div className="mt-8 space-y-6 text-base leading-relaxed text-muted-foreground">
              <p>
                For Alek, modelling has never been about a single great photo
                or a single perfect walk. It's about the long, deliberate
                climb — the small refinements that, over time, separate the
                models who book consistently from the ones who don't.
              </p>
              <p>
                His approach is technical, personal and unhurried. Every
                client is met where they are: a beginner taking their first
                steps, a working model preparing for a high-stakes casting,
                or an advanced talent scaling income and opportunities.
              </p>
              <p>
                The work goes beyond the walk. Together you'll sharpen the
                way you carry yourself, the way you present online, and the
                way you turn attention into real bookings — confidence,
                consistency and craft as one.
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
