import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-grazia.png";
import transformationImage from "@/assets/transformation.jpg";
import portraitImage from "@/assets/alek-home-portrait.png";
import { Section } from "@/components/Section";
import { SERVICES } from "@/lib/services";
import { pageMeta } from "@/components/PageMeta";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: pageMeta({
      title: "Runway Refined by Alek · Refine Your Walk. Build Your Brand.",
      description:
        "Personalised coaching with Alek for models who want to build confidence, create stronger content, and turn social media attention into paying clients.",
      image: heroImage,
      path: "/",
    }),
  }),
  component: HomePage,
});

const AUDIENCES = [
  {
    label: "Beginner models",
    body: "New to modelling and ready for straight talk on runway basics, confidence, and a profile that feels like you.",
  },
  {
    label: "Intermediate models",
    body: "You have mileage and now want sharper content, clearer positioning, and paid work that shows up more often.",
  },
  {
    label: "Experienced models",
    body: "Working models who want to grow income and reach, and to show up with polish at castings and online.",
  },
];

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-border bg-foreground text-background">
        <div className="relative grid min-h-[88vh] grid-cols-1 lg:grid-cols-12">
          <div className="z-10 flex flex-col justify-end bg-foreground/95 px-6 pb-16 pt-20 lg:col-span-6 lg:px-12 lg:pb-24 lg:pt-32">
            <div className="editorial-eyebrow text-background/70 fade-in">
              Runway · Brand · Income
            </div>
            <h1 className="display-xl mt-6 fade-up">
              Refine Your Walk.
              <br />
              Build Your Presence.
              <br />
              <em className="italic text-background/80">Turn Attention Into Income.</em>
            </h1>
            <p className="mt-8 max-w-md text-base leading-relaxed text-background/75 fade-up">
              For models who are tired of generic tips. We work on runway,
              confidence, content that holds up, and growth you can sustain.
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

          <div className="absolute inset-0 lg:relative lg:col-span-6">
            <img
              src={heroImage}
              alt="Grazia cover image featuring Alek in an editorial gown"
              className="absolute inset-0 size-full object-cover object-center opacity-90 lg:object-contain lg:object-center"
              width={819}
              height={1024}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/55 to-transparent lg:from-foreground lg:via-foreground/15 lg:to-transparent" />
          </div>
        </div>

        <div className="border-t border-background/15">
          <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-6 py-5 text-[0.65rem] uppercase tracking-[0.3em] text-background/60 lg:px-12">
            <span>Coaching Worldwide</span>
            <span className="hidden md:inline">Runway · Content · Personal Brand</span>
            <span>Built for long-term model growth</span>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <Section className="border-b border-border">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="editorial-eyebrow">Who it's for</div>
            <h2 className="display-lg mt-6">
              Built for models at every stage of growth.
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
              Plenty of models know how to be seen but not how to get booked.
              Here you get a plan that fits you, honest feedback, and support
              while you build real momentum.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-background/15 pt-8">
              {[
                ["1:1", "Tailored coaching"],
                ["UK", "Based · Coaching worldwide"],
                ["∞", "Long-term results"],
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
              alt="Alek Malek in a tailored white suit with pearl accessories, editorial portrait"
              loading="lazy"
              className="aspect-[4/5] w-full object-cover"
              width={1080}
              height={1350}
            />
          </div>
          <div className="md:col-span-7 md:pl-8">
            <div className="editorial-eyebrow">About the coach</div>
            <h2 className="display-lg mt-6">
              Alek Deng Malek · model coach.
            </h2>
            <p className="mt-8 text-base leading-relaxed text-muted-foreground">
              Alek works with aspiring and professional models to build
              confidence, sharpen runway presence, and grow a personal brand
              that attracts paying clients. Her coaching weaves together
              technique, strategy, and honest feedback tailored to you.
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
            want. You will have personal direction at every step.
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
