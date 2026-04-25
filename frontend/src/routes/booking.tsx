import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import {
  PACKAGES,
  getCalendlyForPackage,
  getPackageBySlug,
  getPackageSnapshotForApi,
  type Package,
} from "@/lib/services";
import { getPackageMedia } from "@/lib/packageImages";
import { postBookingIntent } from "@/lib/publicApi";
import { ArrowRight, Check, CalendarDays, CreditCard, Sparkles } from "lucide-react";

const searchSchema = z.object({
  service: z.string().optional(),
  package: z.string().optional(),
});

export const Route = createFileRoute("/booking")({
  validateSearch: searchSchema,
  head: () => ({
    meta: pageMeta({
      title: "Book a Session · Runway Refined by Alek",
      description:
        "Choose a package, set how you want to pay the full package side, then schedule in Calendly. Card payments will follow after Calendly is finalised.",
      path: "/booking",
    }),
  }),
  component: BookingPage,
});

const STEPS = [
  {
    id: "01",
    title: "Select package",
    desc: "Choose the coaching package that matches your goal.",
    icon: Sparkles,
  },
  {
    id: "02",
    title: "Set scope",
    desc: "One-time item or full package now; card payment later.",
    icon: CreditCard,
  },
  {
    id: "03",
    title: "Schedule",
    desc: "Open the matching Calendly slot to lock in your session.",
    icon: CalendarDays,
  },
];

type PaymentScope = "one_time_item" | "full_package_full" | "full_package_instalments";

function firstSlug(search: { service?: string; package?: string }): string {
  const s = search.package || search.service;
  if (s) {
    const found = getPackageBySlug(s);
    if (found) return found.slug;
  }
  return PACKAGES[0].slug;
}

function scopeLabel(p: Package, scope: PaymentScope): string {
  if (scope === "one_time_item") return `One-time item (${p.oneTimeItem.display})`;
  if (scope === "full_package_full") return `Full package, pay in full (${p.fullPackage.display})`;
  return `Full package, instalments (${p.fullPackage.display})`;
}

function defaultScopeForPackage(p: Package): PaymentScope {
  if (!p.allowsInstalmentsForFullPackage) return "full_package_full";
  return "one_time_item";
}

function BookingPage() {
  const search = Route.useSearch();
  const initial = firstSlug(search);
  const [selected, setSelected] = useState(initial);
  const p = getPackageBySlug(selected) ?? PACKAGES[0];
  const calendly = getCalendlyForPackage(p.slug);
  const media = getPackageMedia(p.slug);
  const [paymentScope, setPaymentScope] = useState<PaymentScope>(() => defaultScopeForPackage(p));
  const [intentMessage, setIntentMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Keep payment scope valid when package changes
  const handleSelectPackage = (slug: string) => {
    setSelected(slug);
    const next = getPackageBySlug(slug) ?? PACKAGES[0];
    setPaymentScope(defaultScopeForPackage(next));
    setIntentMessage(null);
  };

  const handleOpenCalendly = async () => {
    setSaving(true);
    setIntentMessage(null);
    const res = await postBookingIntent({
      packageSlug: p.slug,
      paymentScope,
      pricingSnapshot: (() => {
        const snap = getPackageSnapshotForApi(p.slug);
        if (!snap) return undefined;
        return {
          ...snap,
          paymentScope,
          at: new Date().toISOString(),
        } as Record<string, unknown>;
      })(),
    });
    setSaving(false);
    if (!res.ok) {
      setIntentMessage(
        res.error ??
          "Could not save your booking note to the server. You can still open Calendly, or set VITE_PUBLIC_API_URL to enable saving.",
      );
    } else {
      setIntentMessage("Your plan choice is saved. Opening Calendly in a new tab.");
    }
    window.open(calendly.url, "_blank", "noreferrer");
  };

  return (
    <>
      <PageHero
        eyebrow="Booking"
        title="A cleaner booking flow, from package to session."
        intro="Pick your package, choose your payment scope, and schedule in Calendly. Payment collection in GBP follows right after this scheduling step is complete."
      />

      <Section className="border-b border-border">
        <div className="border border-border">
          <div className="grid gap-px bg-border md:grid-cols-3">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="bg-background p-6">
                  <div className="flex items-center justify-between">
                    <Icon className="size-4 text-muted-foreground" />
                    <span className="font-serif text-2xl text-muted-foreground/70">{step.id}</span>
                  </div>
                  <h3 className="mt-4 font-serif text-xl">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      <Section className="border-b border-border">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="editorial-eyebrow">Step 01</div>
            <h2 className="display-lg mt-5">Choose your package</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Select the package you want to book right now. You can still open the full package page
              for details before confirming your scope.
            </p>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {PACKAGES.map((pkg) => {
                const isActive = pkg.slug === selected;
                const pkgMedia = getPackageMedia(pkg.slug);
                return (
                  <article
                    key={pkg.slug}
                    className={`overflow-hidden border bg-background transition-all ${
                      isActive
                        ? "border-foreground ring-2 ring-foreground/20"
                        : "border-border hover:border-foreground/40"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectPackage(pkg.slug)}
                      className="w-full text-left"
                    >
                      <img
                        src={pkgMedia.hero}
                        alt={pkgMedia.alt}
                        className="aspect-[4/3] w-full object-cover"
                        width={900}
                        height={675}
                        loading="lazy"
                      />
                      <div className="p-5">
                        <div className="text-[0.64rem] uppercase tracking-[0.18em] text-muted-foreground">
                          {pkg.priceSummary}
                        </div>
                        <h3 className="mt-3 font-serif text-xl leading-tight">{pkg.name}</h3>
                        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{pkg.tagline}</p>
                      </div>
                    </button>
                    <div className="border-t border-border px-5 py-3">
                      <Link
                        to="/packages/$slug"
                        params={{ slug: pkg.slug }}
                        className="text-[0.64rem] uppercase tracking-[0.18em] underline-offset-2 hover:underline"
                      >
                        More detail
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-12 border border-border p-6">
              <div className="editorial-eyebrow">Step 02</div>
              <h3 className="mt-3 font-serif text-2xl">Set your payment scope</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Choose how this booking should be treated right now. The card payment step is still
                deferred until after scheduling.
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <button
                  type="button"
                  onClick={() => setPaymentScope("one_time_item")}
                  className={`border px-4 py-4 text-left transition-colors ${
                    paymentScope === "one_time_item"
                      ? "border-foreground bg-secondary/40"
                      : "border-border hover:border-foreground/40"
                  }`}
                >
                  <div className="text-sm font-medium">One-time item</div>
                  <div className="mt-1 text-xs text-muted-foreground">{p.oneTimeItem.display}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentScope("full_package_full")}
                  className={`border px-4 py-4 text-left transition-colors ${
                    paymentScope === "full_package_full"
                      ? "border-foreground bg-secondary/40"
                      : "border-border hover:border-foreground/40"
                  }`}
                >
                  <div className="text-sm font-medium">Full package (full pay)</div>
                  <div className="mt-1 text-xs text-muted-foreground">{p.fullPackage.display}</div>
                </button>
                <button
                  type="button"
                  disabled={!p.allowsInstalmentsForFullPackage}
                  onClick={() => setPaymentScope("full_package_instalments")}
                  className={`border px-4 py-4 text-left transition-colors disabled:opacity-50 ${
                    paymentScope === "full_package_instalments"
                      ? "border-foreground bg-secondary/40"
                      : "border-border hover:border-foreground/40"
                  }`}
                >
                  <div className="text-sm font-medium">Full package (instalments)</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Same full amount split by agreement
                  </div>
                </button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Selected: <span className="text-foreground/90">{scopeLabel(p, paymentScope)}</span>
              </p>
            </div>

            <div className="mt-12 border border-border p-6">
              <div className="editorial-eyebrow">After you schedule</div>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex gap-3">
                  <span className="font-serif text-xl text-muted-foreground/70">01</span>
                  <p>We confirm your package, scope, and session details.</p>
                </div>
                <div className="flex gap-3">
                  <span className="font-serif text-xl text-muted-foreground/70">02</span>
                  <p>You receive prep direction for your specific session goals.</p>
                </div>
                <div className="flex gap-3">
                  <span className="font-serif text-xl text-muted-foreground/70">03</span>
                  <p>Session happens, then follow-up notes and next actions are shared.</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-28 border border-border bg-background p-7">
              <img
                src={media.hero}
                alt={media.alt}
                className="aspect-[4/3] w-full object-cover"
                width={1200}
                height={900}
                loading="lazy"
              />
              <div className="mt-5 editorial-eyebrow">Step 03</div>
              <h3 className="mt-3 font-serif text-3xl">{p.name}</h3>
              <div className="mt-4 flex flex-wrap gap-2 text-[0.64rem] uppercase tracking-[0.18em]">
                <span className="border border-border px-2 py-1">{calendly.label}</span>
                <span className="border border-border px-2 py-1">{scopeLabel(p, paymentScope)}</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {p.description}
              </p>
              <ul className="mt-4 space-y-2">
                {p.includes.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0" /> {i}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={saving}
                onClick={handleOpenCalendly}
                className="mt-8 inline-flex w-full items-center justify-center gap-3 border border-foreground bg-foreground px-6 py-4 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-background hover:bg-background hover:text-foreground disabled:opacity-60"
              >
                {saving ? "Please wait" : "Save choice and open Calendly"}{" "}
                <ArrowRight className="size-4" />
              </button>
              {intentMessage && <p className="mt-4 text-center text-xs text-muted-foreground">{intentMessage}</p>}
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Selected slot: {calendly.label}
              </p>
              <p className="mt-4 border-t border-border pt-4 text-center text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                GBP · Calendly first, then checkout
              </p>
            </div>
          </aside>
        </div>
      </Section>

      <Section className="border-b border-border">
        <div className="editorial-eyebrow">Prefer to talk first?</div>
        <h2 className="display-lg mt-6 max-w-2xl">Book a free discovery call.</h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          If you would like to chat through your goals before choosing a package, we can do that
          on a short discovery call.
        </p>
        <Link
          to="/contact"
          className="mt-8 inline-flex items-center gap-3 border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
        >
          Get in touch <ArrowRight className="size-4" />
        </Link>
      </Section>
    </>
  );
}
