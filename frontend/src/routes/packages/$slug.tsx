import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import {
  formatGbp,
  getInstalmentBreakdown,
  getPackageBySlug,
  getScopePricing,
  PACKAGES,
  type Package,
  type PaymentScope,
} from "@/lib/services";
import { createCheckoutSession } from "@/lib/publicApi";
import { ArrowLeft, ArrowRight, Check, ShieldCheck, Sparkles } from "lucide-react";

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
  const related = PACKAGES.filter((item) => item.slug !== p.slug).slice(0, 3);
  const [selectedScope, setSelectedScope] = useState<PaymentScope>("one_time_item");
  const [customerEmail, setCustomerEmail] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const search = Route.useSearch() as { checkout?: "success" | "cancel" };

  const pricing = useMemo(() => getScopePricing(p, selectedScope), [p, selectedScope]);
  const instalment = useMemo(() => getInstalmentBreakdown(p), [p]);

  const runCheckout = async () => {
    setIsRedirecting(true);
    setCheckoutMessage(null);
    const response = await createCheckoutSession({
      packageSlug: p.slug,
      paymentScope: selectedScope,
      customerEmail: customerEmail || undefined,
    });
    setIsRedirecting(false);

    if (!response.ok || !response.checkoutUrl) {
      setCheckoutMessage(
        response.error ??
          "Checkout session could not be created. Please try again in a moment.",
      );
      return;
    }
    window.location.href = response.checkoutUrl;
  };

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
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Start by choosing exactly what you want below. Your total updates immediately, then you
              continue to secure Stripe checkout.
            </p>
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
                to="/services"
                className="inline-flex items-center justify-center gap-2 border border-foreground bg-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-background hover:bg-background hover:text-foreground"
              >
                View all packages <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
              >
                Ask a question
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7 border border-border p-6 lg:p-8">
            <div className="editorial-eyebrow">How this page works</div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="border border-border bg-secondary/20 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">01</div>
                <h2 className="mt-2 font-serif text-xl">Pick your option</h2>
                <p className="mt-2 text-sm text-muted-foreground">Click one option to set your exact path.</p>
              </div>
              <div className="border border-border bg-secondary/20 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">02</div>
                <h2 className="mt-2 font-serif text-xl">Review pricing</h2>
                <p className="mt-2 text-sm text-muted-foreground">See what is due now and what is left.</p>
              </div>
              <div className="border border-border bg-secondary/20 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">03</div>
                <h2 className="mt-2 font-serif text-xl">Checkout</h2>
                <p className="mt-2 text-sm text-muted-foreground">Pay securely in Stripe to confirm.</p>
              </div>
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
                      Instalment plan: first payment is half of the larger full-package fee.
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
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="editorial-eyebrow">Choose your option</div>
            <h2 className="display-lg mt-5">Select exactly what you want to pay for</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              This is the action step. Click one option below and your checkout total updates instantly.
            </p>

            <div className="mt-8 grid gap-3">
              <button
                type="button"
                onClick={() => setSelectedScope("one_time_item")}
                className={`border px-5 py-4 text-left transition-colors ${
                  selectedScope === "one_time_item"
                    ? "border-foreground bg-secondary/30"
                    : "border-border hover:border-foreground/40"
                }`}
              >
                <div className="text-sm font-medium">One-time item</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {p.oneTimeItem.display} · Best when you only want one focused service.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedScope("full_package_full")}
                className={`border px-5 py-4 text-left transition-colors ${
                  selectedScope === "full_package_full"
                    ? "border-foreground bg-secondary/30"
                    : "border-border hover:border-foreground/40"
                }`}
              >
                <div className="text-sm font-medium">Full package · pay in full</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {p.fullPackage.display} · Best if you want complete support in one payment.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedScope("full_package_instalments")}
                disabled={!p.allowsInstalmentsForFullPackage}
                className={`border px-5 py-4 text-left transition-colors disabled:opacity-50 ${
                  selectedScope === "full_package_instalments"
                    ? "border-foreground bg-secondary/30"
                    : "border-border hover:border-foreground/40"
                }`}
              >
                <div className="text-sm font-medium">Full package · instalments</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {formatGbp(instalment.dueNowGbp)} due now, {formatGbp(instalment.remainingGbp)} remaining.
                </div>
              </button>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-28 border border-border p-6">
              <div className="editorial-eyebrow">Checkout summary</div>
              <h3 className="mt-3 font-serif text-2xl">{pricing.headline}</h3>
              <div className="mt-5 border border-border bg-secondary/20 p-4">
                <div className="text-[0.64rem] uppercase tracking-[0.18em] text-muted-foreground">Due now</div>
                <div className="mt-2 font-serif text-3xl">{formatGbp(pricing.dueNowGbp)}</div>
                <p className="mt-2 text-sm text-muted-foreground">{pricing.note}</p>
              </div>
              <div className="mt-4 border border-border p-4 text-sm">
                <p><span className="font-medium">Selected option:</span> {pricing.dueNowLabel}</p>
                <p className="mt-2">
                  <span className="font-medium">Instalment rule:</span> first payment is half of the larger fee.
                </p>
              </div>

              <label className="mt-5 block text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Email for receipt (optional)
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
              />

              <button
                type="button"
                onClick={runCheckout}
                disabled={isRedirecting}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 border border-foreground bg-foreground px-5 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-background hover:bg-background hover:text-foreground disabled:opacity-60"
              >
                {isRedirecting ? "Redirecting..." : "Continue to secure checkout"}
                <ArrowRight className="size-4" />
              </button>
              {checkoutMessage && <p className="mt-3 text-xs text-muted-foreground">{checkoutMessage}</p>}
              {search.checkout === "success" && (
                <p className="mt-3 text-xs text-emerald-700">Payment successful. We will contact you with next steps.</p>
              )}
              {search.checkout === "cancel" && (
                <p className="mt-3 text-xs text-amber-700">Checkout canceled. You can choose another option and try again.</p>
              )}
              <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4" /> Secure Stripe checkout in GBP.
              </p>
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
            <div className="text-[0.64rem] uppercase tracking-[0.18em] text-muted-foreground">Before you checkout</div>
            <div className="mt-2 text-lg">What happens after payment</div>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>We confirm your selected option and payment receipt.</li>
              <li>You receive onboarding details and next-step guidance.</li>
              <li>Your coaching timeline starts with clear deliverables.</li>
            </ul>
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
