import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { getCalendlyForPackage, getPackageBySlug, type Package } from "@/lib/services";
import { PACKAGE_IMAGE_URLS } from "@/lib/packageImages";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

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

function gallerySrcs(pkg: Package) {
  const seen = new Set<Package["heroImageKey"]>();
  const out: { src: string; alt: string }[] = [];
  const add = (key: Package["heroImageKey"] | (typeof pkg.galleryImageKeys)[number], alt: string) => {
    if (seen.has(key as Package["heroImageKey"])) return;
    seen.add(key as Package["heroImageKey"]);
    const u = PACKAGE_IMAGE_URLS[key as keyof typeof PACKAGE_IMAGE_URLS];
    if (u) out.push({ src: u, alt: alt });
  };
  add(pkg.heroImageKey, `${pkg.name} hero image`);
  for (const k of pkg.galleryImageKeys) {
    if (k !== pkg.heroImageKey) add(k, `${pkg.name} gallery`);
  }
  return out;
}

function PackageDetailPage() {
  const p = Route.useLoaderData() as Package;
  const calendly = getCalendlyForPackage(p.slug);
  const hero = PACKAGE_IMAGE_URLS[p.heroImageKey];
  const gallery = gallerySrcs(p);

  return (
    <>
      <div className="border-b border-border">
        <div className="mx-auto max-w-4xl px-6 pt-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> All services
          </Link>
        </div>
      </div>

      <PageHero
        eyebrow="Package"
        title={p.name}
        intro={p.tagline}
      />

      <Section className="border-b border-border pt-0">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            {hero && (
              <img
                src={hero}
                alt=""
                className="aspect-[4/3] w-full object-cover"
                width={1200}
                height={900}
              />
            )}
            {gallery
              .filter((g) => g.src !== hero)
              .slice(0, 2)
              .map((g) => (
                <img
                  key={g.src + g.alt}
                  src={g.src}
                  alt={g.alt}
                  className="aspect-[3/2] w-full object-cover"
                  width={1000}
                  height={666}
                />
              ))}
          </div>
          <div className="py-4 lg:py-8">
            <div className="editorial-eyebrow text-foreground">Pricing</div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Each package has a <span className="text-foreground">one-time item amount</span> (smaller, paid once for that item) and, where it applies, a <span className="text-foreground">full package amount</span> (larger fee). The full amount can be paid in one go or by instalment once the payment step is live (after Calendly).
            </p>
            <div className="mt-8 space-y-4 border border-border bg-background p-6">
              <div>
                <div className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">One-time item</div>
                <div className="mt-2 font-serif text-2xl">{p.oneTimeItem.display}</div>
                {p.oneTimeItem.notes && <p className="mt-2 text-sm text-muted-foreground">{p.oneTimeItem.notes}</p>}
              </div>
              <div className="border-t border-border pt-4">
                <div className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">Full package</div>
                <div className="mt-2 font-serif text-2xl">{p.fullPackage.display}{p.fullPackage.period ? ` ${p.fullPackage.period}` : ""}</div>
                {p.fullPackage.notes && <p className="mt-2 text-sm text-muted-foreground">{p.fullPackage.notes}</p>}
                {p.allowsInstalmentsForFullPackage && (
                  <p className="mt-2 text-sm text-foreground/80">Full package may be paid in full or in instalments (agreed at booking; gateway comes after Calendly).</p>
                )}
              </div>
            </div>

            {p.walkAnalysisNotes && (
              <div className="mt-6 space-y-3 border border-border p-5 text-sm">
                <p>
                  <span className="font-medium text-foreground">Only this service: </span>
                  {p.walkAnalysisNotes.singleService}
                </p>
                <p>
                  <span className="font-medium text-foreground">Everything together: </span>
                  {p.walkAnalysisNotes.bundle}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/booking"
                search={{ service: p.slug, package: p.slug }}
                className="inline-flex items-center justify-center gap-2 border border-foreground bg-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-background hover:bg-background hover:text-foreground"
              >
                Book with Calendly <ArrowRight className="size-4" />
              </Link>
              <a
                href={calendly.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
              >
                Open {calendly.label}
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
              >
                Ask a question
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section className="border-b border-border">
        <div className="max-w-3xl">
          <h2 className="font-serif text-2xl">About this package</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{p.description}</p>
          <ul className="mt-8 space-y-3">
            {p.includes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 size-4 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {p.detailSections.length > 0 && (
        <Section>
          {p.detailSections.map((d) => (
            <div key={d.title} className="mb-16 last:mb-0">
              <h2 className="font-serif text-2xl">{d.title}</h2>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{d.body}</p>
            </div>
          ))}
        </Section>
      )}
    </>
  );
}
