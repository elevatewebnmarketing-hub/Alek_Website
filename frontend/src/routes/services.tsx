import { createFileRoute, Link } from "@tanstack/react-router";
import walkImage from "@/assets/services-walk.jpg";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { SERVICES } from "@/lib/services";
import { ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: pageMeta({
      title: "Model Coaching Services · Runway, Casting, Confidence, Mentorship",
      description:
        "Runway, casting, walk analysis, presence, and mentorship—1:1 coaching for models worldwide. Transparent GBP pricing; book and pay per package page.",
      image: walkImage,
      path: "/services",
    }),
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Coaching, refined to where you are."
        intro="Each package aligns with where you are in your career—runway line, casting floor, analysis from footage, or ongoing mentorship. Amounts are in GBP: open a package to compare options, preview your total, and complete secure checkout on the same page."
      />

      <Section className="border-b border-border pt-0">
        <img
          src={walkImage}
          alt="Black and white editorial photograph of model legs on a runway"
          loading="lazy"
          className="aspect-[16/7] w-full object-cover"
          width={1920}
          height={1080}
        />
      </Section>

      <Section className="border-b border-border">
        <div className="grid gap-px bg-border md:grid-cols-2">
          {SERVICES.map((s, i) => (
            <article
              key={s.slug}
              className="flex flex-col bg-background p-8 lg:p-12"
            >
              <div className="flex items-center justify-between">
                <div className="editorial-eyebrow">
                  Package {String(i + 1).padStart(2, "0")}
                </div>
                <div className="editorial-eyebrow text-foreground">
                  {s.priceRange}
                </div>
              </div>
              <h2 className="font-serif text-3xl mt-6 leading-tight lg:text-4xl">
                {s.name}
              </h2>
              <p className="mt-3 font-serif text-lg italic text-muted-foreground">
                {s.tagline}
              </p>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                {s.description}
              </p>

              <ul className="mt-8 space-y-3">
                {s.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm text-foreground/80"
                  >
                    <Check className="mt-0.5 size-4 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  to="/packages/$slug"
                  params={{ slug: s.slug }}
                  className="inline-flex items-center gap-3 self-start border border-foreground px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
                >
                  View package <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/packages/$slug"
                  params={{ slug: s.slug }}
                  className="inline-flex items-center gap-3 self-start text-[0.72rem] font-medium uppercase tracking-[0.2em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Choose option
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <section className="bg-foreground py-20 text-background lg:py-28">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
          <div className="editorial-eyebrow text-background/60">Not sure where to start?</div>
          <h2 className="display-lg mt-6">
            Begin with a discovery call.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-background/75">
            We will talk through where you are, where you want to be, and the
            next practical steps in between.
          </p>
          <Link
            to="/services"
            className="mt-10 inline-flex items-center gap-3 border border-background bg-background px-7 py-4 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-foreground hover:bg-transparent hover:text-background"
          >
            Explore Packages <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
