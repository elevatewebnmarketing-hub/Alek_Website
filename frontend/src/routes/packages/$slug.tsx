import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
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
import { createCheckoutSession, fetchCheckoutStatus } from "@/lib/publicApi";
import { AlertTriangle, ArrowDown, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";

const packageSearchSchema = z.object({
  checkout: z.enum(["cancel", "failed"]).optional(),
  session_id: z.string().optional(),
});

export const Route = createFileRoute("/packages/$slug")({
  validateSearch: packageSearchSchema,
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
  const [selectedOneTimeOption, setSelectedOneTimeOption] = useState("");
  const [intakeDetails, setIntakeDetails] = useState("");
  const [mediaUploadPreference, setMediaUploadPreference] = useState<"secure_link" | "wetransfer_request" | "dropbox_file_request">("secure_link");
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const search = Route.useSearch();
  const paySentinelRef = useRef<HTMLDivElement>(null);
  const [showPayBar, setShowPayBar] = useState(false);
  const noticeDialogRef = useRef<HTMLDialogElement>(null);
  const [noticeTitle, setNoticeTitle] = useState("Checkout update");
  const [noticeBody, setNoticeBody] = useState("");

  useEffect(() => {
    const el = paySentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setShowPayBar(!entry.isIntersecting);
      },
      { root: null, rootMargin: "-72px 0px 0px 0px", threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [p.slug]);

  useEffect(() => {
    if (!p.oneTimeOptions.length) {
      setSelectedOneTimeOption("");
      return;
    }
    setSelectedOneTimeOption(p.oneTimeOptions[0].value);
  }, [p.slug, p.oneTimeOptions]);

  useEffect(() => {
    const openNotice = (title: string, body: string) => {
      setNoticeTitle(title);
      setNoticeBody(body);
      noticeDialogRef.current?.showModal();
    };
    if (search.checkout === "cancel") {
      openNotice("Payment cancelled", "Your payment was not completed. You can review your option and try checkout again.");
      return;
    }
    if (search.checkout === "failed") {
      openNotice("Payment failed", "Your payment attempt failed. Please retry with another method or contact us for support.");
      return;
    }
    if (search.session_id) {
      fetchCheckoutStatus(search.session_id).then((res) => {
        if (!res.ok) return;
        if (res.status === "failed") {
          openNotice("Payment failed", "This checkout session is marked as failed. Please retry when you are ready.");
        }
      });
    }
  }, [search.checkout, search.session_id]);

  const pricing = useMemo(() => getScopePricing(p, selectedScope), [p, selectedScope]);
  const instalment = useMemo(() => getInstalmentBreakdown(p), [p]);

  const runCheckout = async () => {
    if (selectedScope === "one_time_item" && !selectedOneTimeOption) {
      setCheckoutMessage("Please select one one-time option before continuing.");
      return;
    }
    setIsRedirecting(true);
    setCheckoutMessage(null);
    const response = await createCheckoutSession({
      packageSlug: p.slug,
      paymentScope: selectedScope,
      customerEmail: customerEmail || undefined,
      selectedOneTimeOption: selectedScope === "one_time_item" ? selectedOneTimeOption : undefined,
      intakeDetails: intakeDetails || undefined,
      mediaUploadPreference: selectedScope === "one_time_item" ? mediaUploadPreference : undefined,
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
              You book and pay on this page: choose your option, watch the total update, then continue to secure Stripe
              checkout. Use the guide on the right and the sticky bar when you scroll—it points you straight to the
              payment block.
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
          <div id="package-flow" className="lg:col-span-7 scroll-mt-28 border border-border p-6 lg:p-8">
            <div className="editorial-eyebrow">How this page works</div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              On this page you move from context to commitment: read outcomes and structure, understand pricing, then
              scroll to the payment section to select your option and pay. Jump links below match each block.
            </p>
            <nav
              className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border border-border bg-secondary/10 px-3 py-3 text-[0.65rem] font-medium uppercase tracking-[0.14em]"
              aria-label="On this page"
            >
              <a href="#package-outcomes" className="text-foreground/80 underline-offset-4 hover:text-foreground hover:underline">
                Outcomes
              </a>
              <span className="text-muted-foreground/40" aria-hidden>
                ·
              </span>
              <a href="#package-pricing" className="text-foreground/80 underline-offset-4 hover:text-foreground hover:underline">
                Pricing
              </a>
              <span className="text-muted-foreground/40" aria-hidden>
                ·
              </span>
              <a href="#package-pay" className="text-foreground/80 underline-offset-4 hover:text-foreground hover:underline">
                Select &amp; pay
              </a>
              <span className="text-muted-foreground/40" aria-hidden>
                ·
              </span>
              <a href="#checkout" className="text-foreground underline-offset-4 hover:underline">
                Payment
              </a>
            </nav>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="border border-border bg-secondary/20 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">01</div>
                <h2 className="mt-2 font-serif text-lg leading-snug">Outcomes &amp; deliverables</h2>
                <p className="mt-2 text-sm text-muted-foreground">What you leave with and what is included.</p>
              </div>
              <div className="border border-border bg-secondary/20 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">02</div>
                <h2 className="mt-2 font-serif text-lg leading-snug">Structure &amp; session arc</h2>
                <p className="mt-2 text-sm text-muted-foreground">How the coaching block is built.</p>
              </div>
              <div className="border border-border bg-secondary/20 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">03</div>
                <h2 className="mt-2 font-serif text-lg leading-snug">Pricing logic</h2>
                <p className="mt-2 text-sm text-muted-foreground">One-time item vs full package and instalments.</p>
              </div>
              <div className="border border-border bg-secondary/20 p-4">
                <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">04</div>
                <h2 className="mt-2 font-serif text-lg leading-snug">Pay on this page</h2>
                <p className="mt-2 text-sm text-muted-foreground">Select an option, then Stripe checkout.</p>
              </div>
            </div>
          </div>
        </div>
        <div ref={paySentinelRef} className="h-px w-full" aria-hidden />
      </Section>

      <Section id="package-outcomes" className="scroll-mt-28 border-b border-border">
        <div className="editorial-eyebrow">What&apos;s included</div>
        <h2 className="display-lg mt-4">Everything included in this package, explained clearly</h2>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          Each item below is written as a service component with practical detail so you understand what you are paying
          for and how it supports runway performance, casting confidence, and professional delivery.
        </p>
        <div className="mt-8 grid gap-5">
          {(p.includeDetails ?? p.includes.map((item) => ({ title: item, body: item }))).map((item) => (
            <article key={item.title} className="border border-border bg-secondary/20 p-6 lg:p-7">
              <h3 className="font-serif text-2xl">{item.title}</h3>
              <p className="mt-3 max-w-4xl text-base leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="border-b border-border">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 scroll-mt-28">
            <div className="editorial-eyebrow">How it&apos;s structured</div>
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
          <aside id="package-pricing" className="lg:col-span-5 scroll-mt-28">
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

      <Section id="package-pay" className="scroll-mt-28 border-b border-border">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="editorial-eyebrow">Choose your option</div>
            <h2 className="display-lg mt-5">Select exactly what you want to pay for</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              This is the commitment step on this page. Tap one option—your summary and due-now total update
              immediately in the payment panel on the right (or below on small screens). Then continue to Stripe.
            </p>

            <div className="mt-8 grid gap-3">
              <button
                type="button"
                onClick={() => setSelectedScope("one_time_item")}
                className={`border px-5 py-4 text-left transition-colors ${
                  selectedScope === "one_time_item"
                    ? "border-foreground bg-zinc-900/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]"
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
                    ? "border-foreground bg-zinc-900/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]"
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
                    ? "border-foreground bg-zinc-900/60 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]"
                    : "border-border hover:border-foreground/40"
                }`}
              >
                <div className="text-sm font-medium">Full package · instalments</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {formatGbp(instalment.dueNowGbp)} due now, {formatGbp(instalment.remainingGbp)} remaining.
                </div>
              </button>
            </div>
            {selectedScope === "one_time_item" && (
              <div className="mt-6 space-y-4 border border-border bg-secondary/10 p-4">
                <label className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Choose your one-time service
                </label>
                <select
                  value={selectedOneTimeOption}
                  onChange={(e) => setSelectedOneTimeOption(e.target.value)}
                  className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                >
                  {p.oneTimeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  {p.oneTimeOptions.find((option) => option.value === selectedOneTimeOption)?.description}
                </p>
                <label className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Upload preference
                </label>
                <select
                  value={mediaUploadPreference}
                  onChange={(e) =>
                    setMediaUploadPreference(
                      e.target.value as "secure_link" | "wetransfer_request" | "dropbox_file_request",
                    )
                  }
                  className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                >
                  <option value="secure_link">Secure upload link (recommended)</option>
                  <option value="wetransfer_request">WeTransfer transfer request</option>
                  <option value="dropbox_file_request">Dropbox File Request</option>
                </select>
                <label className="block text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Intake notes (optional)
                </label>
                <textarea
                  value={intakeDetails}
                  onChange={(e) => setIntakeDetails(e.target.value)}
                  rows={3}
                  placeholder="Share goals, deadlines, or context we should consider."
                  className="w-full border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                />
              </div>
            )}
          </div>

          <aside className="lg:col-span-5">
            <div id="checkout" className="sticky top-28 scroll-mt-28 border border-border p-6">
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
              <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-4" /> Secure Stripe checkout in GBP.
              </p>
              {p.slug === "walk-analysis" && p.intakeInfo && (
                <div className="mt-4 rounded border border-border bg-secondary/20 p-3 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">{p.intakeInfo.heading}</p>
                  <p className="mt-2">{p.intakeInfo.body}</p>
                  <p className="mt-2">
                    Preferred upload path: secure link. Alternatives: {p.intakeInfo.uploadAlternatives.join(", ")}.
                  </p>
                </div>
              )}
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

      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] backdrop-blur-md transition-transform duration-300 md:px-8 ${
          showPayBar ? "translate-y-0" : "pointer-events-none translate-y-full"
        }`}
        role="region"
        aria-label="Jump to payment"
      >
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
          <p className="max-w-xl text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Payment is on this page.</span> Scroll to the panel marked
            Payment, or jump directly to checkout.
          </p>
          <a
            href="#checkout"
            className="inline-flex shrink-0 items-center gap-2 border border-foreground bg-foreground px-5 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.2em] text-background hover:bg-background hover:text-foreground"
          >
            Jump to payment <ArrowDown className="size-4" />
          </a>
        </div>
      </div>
      <dialog
        ref={noticeDialogRef}
        className="w-[min(100vw-2rem,520px)] rounded border border-border bg-background p-0 shadow-xl backdrop:bg-black/65"
        onClick={(e) => {
          if (e.target === noticeDialogRef.current) noticeDialogRef.current?.close();
        }}
      >
        <div className="p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 text-amber-600" />
            <div>
              <h3 className="font-serif text-2xl">{noticeTitle}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{noticeBody}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                noticeDialogRef.current?.close();
                window.location.hash = "checkout";
              }}
              className="inline-flex items-center justify-center gap-2 border border-foreground bg-foreground px-5 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.2em] text-background hover:bg-background hover:text-foreground"
            >
              Try checkout again
            </button>
            <button
              type="button"
              onClick={() => noticeDialogRef.current?.close()}
              className="inline-flex items-center justify-center border border-border px-5 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.2em] hover:border-foreground"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
