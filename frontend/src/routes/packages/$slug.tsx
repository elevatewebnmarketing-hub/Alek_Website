import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { getCalendlyForPackage, getPackageBySlug, PACKAGES, type Package } from "@/lib/services";
import { getPackageMedia } from "@/lib/packageImages";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";

export const Route = createFileRoute("/packages/$slug")({
  loader: ({ params }) => {
    const p = getPackageBySlug(params.slug);
    if (!p) throw notFound();
    return p;
  },
  head: ({ params }) => {
    const path = `/packages/${params.slug}`;
    const p = getPackageBySlug(params.slug);
    if (!p) {
      return {
        meta: pageMeta({
          title: "Coaching package · Runway Refined by Alek",
          description: "Model coaching and runway training.",
          path,
        }),
      };
    }
    return {
      meta: pageMeta({
        title: `${p.name} · Packages · Runway Refined by Alek`,
        description: p.tagline,
        path,
      }),
    };
  },
  component: PackageDetailPage,
});

function PackageDetailPage() {
  const p = Route.useLoaderData() as Package;
  const calendly = getCalendlyForPackage(p.slug);
  const media = getPackageMedia(p.slug);
  const related = PACKAGES.filter((item) => item.slug !== p.slug).slice(0, 3);

  return (
    <>
      <div className="border-b border-border">
        <div className="mx-auto max-w-[1600px] px-6 pt-8 lg:px-12">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Services
          </Link>
          <span className="mx-2 text-muted-foreground/50">/</span>
          <Link to="/packages/$slug" params={{ slug: p.slug }} className="text-sm text-foreground">
            {p.name}
          </Link>
        </div>
      </div>

      <Section className="border-b border-border pt-10 lg:pt-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="editorial-eyebrow">Package</div>
            <h1 className="display-lg mt-5">{p.name}</h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">{p.tagline}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="border border-border bg-secondary/30 p-4">
                <div className="text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">Duration</div>
                <div className="mt-2 text-sm">{p.keyStats.duration}</div>
              </div>
              <div className="border border-border bg-secondary/30 p-4">
                <div className="text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">Format</div>
                <div className="mt-2 text-sm">{p.keyStats.format}</div>
              </div>
            </div>
            {p.keyStats.cadence && (
              <div className="mt-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Cadence: {p.keyStats.cadence}
              </div>
            )}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/booking"
                search={{ service: p.slug, package: p.slug }}
                className="inline-flex items-center justify-center gap-2 border border-foreground bg-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-background hover:bg-background hover:text-foreground"
              >
                Book with Calendly <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
              >
                Ask a question
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <img
              src={media.hero}
              alt={media.alt}
              className="aspect-[16/10] w-full object-cover"
              width={1600}
              height={1000}
              loading="eager"
            />
            <div className="border border-t-0 border-border px-4 py-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Editorial reference visual for this package
            </div>
          </div>
        </div>
      </Section>

      <Section className="border-b border-border">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
              <Sparkles className="size-3.5" /> What you will leave with
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {p.outcomes.map((outcome) => (
                <div key={outcome} className="border border-border bg-secondary/20 p-5 text-sm leading-relaxed">
                  {outcome}
                </div>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-5">
            <div className="border border-border p-6">
              <div className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">Whats included</div>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {p.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>

      <Section className="border-b border-border pt-0">
        <img
          src={media.detail}
          alt={media.alt}
          className="aspect-[16/7] w-full object-cover"
          width={1800}
          height={900}
          loading="lazy"
        />
      </Section>

      <Section className="border-b border-border">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="editorial-eyebrow">How its structured</div>
            <div className="mt-8 space-y-8">
              {p.detailSections.map((d, index) => (
                <div key={d.title} className="grid gap-3 md:grid-cols-[56px_1fr]">
                  <div className="font-serif text-3xl text-muted-foreground/60">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl">{d.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {d.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-5">
            <div className="border border-border p-6">
              <div className="editorial-eyebrow">How pricing works</div>
              <div className="mt-5 space-y-4">
                <div className="border border-border bg-secondary/20 p-4">
                  <div className="text-[0.64rem] uppercase tracking-[0.18em] text-muted-foreground">One-time item</div>
                  <div className="mt-2 font-serif text-2xl">{p.oneTimeItem.display}</div>
                  {p.oneTimeItem.notes && <p className="mt-2 text-sm text-muted-foreground">{p.oneTimeItem.notes}</p>}
                </div>
                <div className="border border-border bg-secondary/20 p-4">
                  <div className="text-[0.64rem] uppercase tracking-[0.18em] text-muted-foreground">Full package</div>
                  <div className="mt-2 font-serif text-2xl">
                    {p.fullPackage.display}
                    {p.fullPackage.period ? ` ${p.fullPackage.period}` : ""}
                  </div>
                  {p.fullPackage.notes && <p className="mt-2 text-sm text-muted-foreground">{p.fullPackage.notes}</p>}
                  {p.allowsInstalmentsForFullPackage && (
                    <p className="mt-2 text-sm text-foreground/85">
                      Full package can be paid in full or in instalments.
                    </p>
                  )}
                </div>
                {p.walkAnalysisNotes && (
                  <div className="border border-border p-4 text-sm">
                    <p>
                      <span className="font-medium">Only this service: </span>
                      {p.walkAnalysisNotes.singleService}
                    </p>
                    <p className="mt-2">
                      <span className="font-medium">Everything together: </span>
                      {p.walkAnalysisNotes.bundle}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </Section>

      <Section className="border-b border-border">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="editorial-eyebrow">Who this is for</div>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">{p.whoFor}</p>
            {p.notFor && (
              <p className="mt-4 text-sm text-foreground/80">
                <span className="font-medium">Not the right fit if:</span> {p.notFor}
              </p>
            )}
          </div>
          <div className="lg:col-span-4 border border-border p-6">
            <div className="text-[0.64rem] uppercase tracking-[0.18em] text-muted-foreground">Calendly slot</div>
            <div className="mt-2 text-lg">{calendly.label}</div>
            <a
              href={calendly.url}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 border border-foreground bg-foreground px-5 py-3 text-[0.68rem] uppercase tracking-[0.2em] text-background hover:bg-background hover:text-foreground"
            >
              Open Calendly <ArrowRight className="size-4" />
            </a>
          </div>
        </div>
      </Section>

      <Section>
        <div className="flex items-end justify-between gap-5">
          <div>
            <div className="editorial-eyebrow">Related packages</div>
            <h2 className="font-serif text-3xl mt-4">Explore next options</h2>
          </div>
          <Link to="/services" className="text-sm underline-offset-4 hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {related.map((item) => (
            <Link
              key={item.slug}
              to="/packages/$slug"
              params={{ slug: item.slug }}
              className="border border-border p-5 transition-colors hover:bg-secondary/30"
            >
              <div className="text-[0.63rem] uppercase tracking-[0.18em] text-muted-foreground">{item.priceSummary}</div>
              <h3 className="font-serif text-xl mt-3">{item.name}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{item.tagline}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
