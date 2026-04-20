import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-runway.jpg";
import transformationImage from "@/assets/transformation.jpg";
import portraitImage from "@/assets/about-portrait.jpg";
import { Section } from "@/components/Section";
import { SERVICES } from "@/lib/services";
import { pageMeta } from "@/components/PageMeta";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: pageMeta({
      title: "Runway Refined by Alek — Refine Your Walk. Build Your Brand.",
      description:
        "Personalised model and runway coaching with Alek Deng Malek. Confidence, presence and branding strategy that turns attention into income.",
      image: heroImage,
      path: "/",
    }),
  }),
  component: HomePage,
});

const AUDIENCES = [
  { label: "Beginner", body: "Just starting and want a real foundation, not generic advice." },
  { label: "Intermediate", body: "Booking work and ready to sharpen your walk, presence and brand." },
  { label: "Advanced", body: "Already established and scaling income, opportunities and visibility." },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-border bg-foreground text-background">
        <div className="relative grid min-h-[88vh] grid-cols-1 lg:grid-cols-12">
          <div className="z-10 flex flex-col justify-end px-6 pb-16 pt-20 lg:col-span-6 lg:px-12 lg:pb-24 lg:pt-32">
            <div className="editorial-eyebrow text-background/70 fade-in">
              Runway · Brand · Income
            </div>
            <h1 className="display-xl mt-6 fade-up">
              Refine Your Walk.
              <br />
              Build Your Brand.
              <br />
              <em className="italic text-background/80">Get Paid as a Model.</em>
            </h1>
            <p className="mt-8 max-w-md text-base leading-relaxed text-background/75 fade-up">
              Personalised coaching for models who refuse to leave their career
              to chance. Runway, mindset and branding — refined together.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4 fade-up">
              <Link
                to="/booking"
                className="inline-flex items-center gap-3 border border-background bg-background px-7 py-4 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-transparent hover:text-background"
              >
                Book a Session <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/services"
                className="text-[0.72rem] font-medium uppercase tracking-[0.22em] text-background/80 underline-offset-8 hover:underline"
              >
                Explore Services
              </Link>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <img
              src={heroImage}
              alt="Editorial runway photograph of a model walking under a single spotlight"
              className="absolute inset-0 size-full object-cover opacity-90"
              width={1080}
              height={1920}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/40 to-transparent lg:from-foreground/80 lg:via-transparent lg:to-transparent" />
          </div>
        </div>

        <div className="border-t border-background/15">
          <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-6 py-5 text-[0.65rem] uppercase tracking-[0.3em] text-background/60 lg:px-12">
            <span>Coaching Worldwide</span>
            <span className="hidden md:inline">Runway · Casting · Mindset</span>
            <span>Featured in independent press</span>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <Section className="border-b border-border">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="editorial-eyebrow">Who it's for</div>
            <h2 className="display-lg mt-6">
              Built for models at every stage of the climb.
            </h2>
          </div>
          <div className="grid gap-px bg-border md:col-span-8 md:grid-cols-3">
            {AUDIENCES.map((a) => (
              <div key={a.label} className="bg-background p-8">
                <div className="font-serif text-3xl">{a.label}</div>
                <div className="rule mt-5" />
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  {a.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* SERVICES OVERVIEW */}
      <Section className="border-b border-border">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <div className="editorial-eyebrow">The work</div>
            <h2 className="display-lg mt-6 max-w-xl">
              Services tailored to where you are now.
            </h2>
          </div>
          <Link
            to="/services"
            className="text-[0.72rem] font-medium uppercase tracking-[0.22em] underline-offset-8 hover:underline"
          >
            View all services →
          </Link>
        </div>

        <div className="mt-16 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.slice(0, 6).map((s) => (
            <Link
              key={s.slug}
              to="/services"
              className="group flex flex-col bg-background p-8 transition-colors hover:bg-secondary"
            >
              <div className="editorial-eyebrow">{s.priceRange}</div>
              <h3 className="font-serif text-2xl mt-4 leading-tight">{s.name}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {s.tagline}
              </p>
              <div className="mt-8 inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.22em]">
                Learn more <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* TRANSFORMATION */}
      <section className="relative overflow-hidden border-b border-border bg-foreground text-background">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="relative lg:col-span-7">
            <img
              src={transformationImage}
              alt="Backstage editorial moment of models lined up before a runway show"
              loading="lazy"
              className="size-full object-cover opacity-85"
              width={1920}
              height={1080}
            />
          </div>
          <div className="flex flex-col justify-center px-6 py-16 lg:col-span-5 lg:px-14 lg:py-24">
            <div className="editorial-eyebrow text-background/60">The transformation</div>
            <h2 className="display-lg mt-6">
              From hesitant walks to <em className="italic">paid bookings.</em>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-background/75">
              We work on the things castings actually notice — confidence,
              tempo, presence, and the personal brand that makes clients book
              you again. Long-term growth, not quick fixes.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-background/15 pt-8">
              {[
                ["1:1", "Tailored coaching"],
                ["£0", "Wasted on guesswork"],
                ["∞", "Long-term growth"],
              ].map(([k, v]) => (
                <div key={v}>
                  <div className="font-serif text-3xl">{k}</div>
                  <div className="mt-2 text-[0.7rem] uppercase tracking-[0.2em] text-background/60">
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <Section className="border-b border-border">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <img
              src={portraitImage}
              alt="Editorial portrait suggesting Alek's coaching style"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
              width={1080}
              height={1350}
            />
          </div>
          <div className="md:col-span-7 md:pl-8">
            <div className="editorial-eyebrow">About the coach</div>
            <h2 className="display-lg mt-6">
              Alek Deng Malek — model coach.
            </h2>
            <p className="mt-8 text-base leading-relaxed text-muted-foreground">
              Alek helps aspiring and professional models build confidence,
              develop their personal brand, and succeed in the fashion
              industry. His coaching combines technical runway skills with the
              mindset and branding strategy needed to actually convert
              attention into income.
            </p>
            <Link
              to="/about"
              className="mt-10 inline-flex items-center gap-3 border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
            >
              Read the story <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* FINAL CTA */}
      <section className="bg-foreground py-24 text-background lg:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="editorial-eyebrow text-background/60">Ready to begin</div>
          <h2 className="display-xl mt-6">
            Refine the walk. <em className="italic">Refine the career.</em>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-background/75">
            Book a session and start building the model career you actually
            want — with personal direction every step of the way.
          </p>
          <Link
            to="/booking"
            className="mt-10 inline-flex items-center gap-3 border border-background bg-background px-8 py-4 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-foreground hover:bg-transparent hover:text-background"
          >
            Book a Session <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
