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
import { postBookingIntent } from "@/lib/publicApi";
import { ArrowRight, Check } from "lucide-react";

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
  { n: "01", t: "Choose a package", d: "Match your level and the kind of help you need." },
  { n: "02", t: "Set payment scope", d: "One-time item, or the full package (pay in full or in instalments later; no card yet)." },
  { n: "03", t: "Schedule in Calendly", d: "Book a time first. The payment gateway is added only after this step is set." },
  { n: "04", t: "Complete payment later", d: "We will take payment in GBP once checkout is live." },
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
        title="Start with a time, then we wire up payment."
        intro="We are prioritising Calendly first. You choose a package and how the fee should work, then you schedule. Stripe checkout in GBP is added in a later pass once Calendly is set."
      />

      <Section className="border-b border-border">
        <div className="grid gap-px bg-border md:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-background p-8">
              <div className="font-serif text-4xl text-muted-foreground/60">{s.n}</div>
              <div className="mt-5 font-serif text-xl">{s.t}</div>
              <div className="rule mt-4" />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-b border-border">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="editorial-eyebrow">Step 01 · Select</div>
            <h2 className="display-lg mt-6">Choose your package.</h2>
            <div className="mt-10 grid gap-px bg-border sm:grid-cols-2">
              {PACKAGES.map((pkg) => {
                const active = pkg.slug === selected;
                return (
                  <div
                    key={pkg.slug}
                    className={`flex flex-col items-start bg-background p-6 text-left transition-colors ${
                      active ? "ring-2 ring-foreground ring-inset" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectPackage(pkg.slug)}
                      className="w-full text-left"
                    >
                      <div className="editorial-eyebrow">{pkg.priceSummary}</div>
                      <div className="mt-3 font-serif text-xl leading-tight">
                        {pkg.name}
                      </div>
                      <div className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        {pkg.tagline}
                      </div>
                    </button>
                    <Link
                      to="/packages/$slug"
                      params={{ slug: pkg.slug }}
                      className="mt-4 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-foreground underline underline-offset-2"
                    >
                      More detail
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 border border-border p-6">
              <div className="editorial-eyebrow">Step 02 · Payment scope</div>
              <h3 className="mt-3 font-serif text-2xl">How should the fee be treated?</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                The smaller <span className="text-foreground/90">one-time item</span> amount is paid once for that item. The <span className="text-foreground/90">full package</span> is the larger fee, payable in one go or in instalments once checkout is on (after Calendly). No card is taken on this page yet.
              </p>
              <div className="mt-6 space-y-3">
                <label className="flex cursor-pointer items-start gap-3 border border-border p-3 transition-colors has-[:checked]:border-foreground has-[:checked]:bg-secondary/30">
                  <input
                    type="radio"
                    className="mt-1"
                    name="scope"
                    checked={paymentScope === "one_time_item"}
                    onChange={() => setPaymentScope("one_time_item")}
                  />
                  <div>
                    <div className="text-sm font-medium">One-time item only</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{p.oneTimeItem.display}</div>
                  </div>
                </label>
                <label className="flex cursor-pointer items-start gap-3 border border-border p-3 transition-colors has-[:checked]:border-foreground has-[:checked]:bg-secondary/30">
                  <input
                    type="radio"
                    className="mt-1"
                    name="scope"
                    checked={paymentScope === "full_package_full"}
                    onChange={() => setPaymentScope("full_package_full")}
                  />
                  <div>
                    <div className="text-sm font-medium">Full package, pay in full</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{p.fullPackage.display}{p.fullPackage.period ? ` ${p.fullPackage.period}` : ""}</div>
                  </div>
                </label>
                <label
                  className={`flex cursor-pointer items-start gap-3 border border-border p-3 transition-colors has-[:checked]:border-foreground has-[:checked]:bg-secondary/30 ${
                    !p.allowsInstalmentsForFullPackage ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  <input
                    type="radio"
                    className="mt-1"
                    name="scope"
                    disabled={!p.allowsInstalmentsForFullPackage}
                    checked={paymentScope === "full_package_instalments"}
                    onChange={() => setPaymentScope("full_package_instalments")}
                  />
                  <div>
                    <div className="text-sm font-medium">Full package, pay in instalments</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Same full package amount, agreed schedule when checkout is live</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-28 border border-border bg-background p-8">
              <div className="editorial-eyebrow">Step 03 · Calendly</div>
              <h3 className="mt-3 font-serif text-3xl">{p.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="text-foreground/80">You chose: </span>
                {scopeLabel(p, paymentScope)}
              </p>
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
              <p className="mt-4 text-center text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
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
