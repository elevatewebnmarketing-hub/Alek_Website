import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { getCalendlyForPackage, getPackageBySlug } from "@/lib/services";
import { ArrowRight, CalendarDays, CheckCircle2 } from "lucide-react";

const searchSchema = z.object({
  package: z.string().optional(),
  session_id: z.string().optional(),
});

export const Route = createFileRoute("/checkout/success")({
  validateSearch: searchSchema,
  head: () => ({
    meta: pageMeta({
      title: "Payment successful · Runway Refined by Alek",
      description: "Your payment went through. Book your session with Calendly to continue.",
      path: "/checkout/success",
    }),
  }),
  component: CheckoutSuccessPage,
});

function CheckoutSuccessPage() {
  const { package: packageSlug, session_id: sessionId } = Route.useSearch();
  const pkg = packageSlug ? getPackageBySlug(packageSlug) : undefined;
  const calendly = pkg ? getCalendlyForPackage(pkg.slug) : null;

  return (
    <>
      <Section className="border-b border-border pt-10 lg:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex size-16 items-center justify-center border border-border bg-secondary/30">
            <CheckCircle2 className="size-9 text-foreground" aria-hidden />
          </div>
          <div className="editorial-eyebrow mt-8">Payment received</div>
          <h1 className="display-lg mt-4">Thank you. Your booking is almost complete.</h1>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Your payment was successful. The next step is to choose a time that works for you in Calendly so we can
            match your session to the package you purchased.
          </p>
          {sessionId && (
            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted-foreground">
              Reference: {sessionId}
            </p>
          )}
        </div>
      </Section>

      <Section>
        {pkg && calendly ? (
          <div className="mx-auto max-w-xl border border-border bg-background p-8 lg:p-10">
            <div className="flex items-start gap-4">
              <CalendarDays className="mt-1 size-6 shrink-0 text-muted-foreground" aria-hidden />
              <div className="min-w-0 text-left">
                <div className="text-[0.64rem] uppercase tracking-[0.18em] text-muted-foreground">Your package</div>
                <h2 className="font-serif text-2xl mt-2">{pkg.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pkg.tagline}</p>
                <div className="mt-5 text-sm">
                  <span className="text-muted-foreground">Suggested slot length: </span>
                  <span className="font-medium">{calendly.label}</span>
                </div>
                <a
                  href={calendly.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex w-full items-center justify-center gap-2 border border-foreground bg-foreground px-6 py-4 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-background hover:bg-background hover:text-foreground sm:w-auto"
                >
                  Open Calendly <ArrowRight className="size-4" />
                </a>
                <p className="mt-4 text-xs text-muted-foreground">
                  Calendly opens in a new tab. If you do not see it, check your pop-up blocker.
                </p>
              </div>
            </div>
          </div>
        ) : pkg?.slug === "walk-analysis" ? (
          <div className="mx-auto max-w-xl border border-border bg-background p-8 lg:p-10">
            <h2 className="font-serif text-2xl">Walk Analysis: next step is your intake form</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Thank you for your payment. Walk Analysis follows a form-first intake so we can review your goals,
              context, and footage professionally before sending your feedback.
            </p>
            <div className="mt-5 rounded border border-border bg-secondary/20 p-4 text-sm text-muted-foreground">
              <p>What we collect: service focus, timeline, model context, and upload preference.</p>
              <p className="mt-2">
                Preferred media route: secure upload link. Alternatives: WeTransfer transfer request or Dropbox File
                Request.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-foreground bg-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-background hover:bg-background hover:text-foreground"
              >
                Open intake support <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-xl border border-border p-8 text-center">
            <p className="text-sm leading-relaxed text-muted-foreground">
              We could not match this page to a specific package. If you completed a payment, check your email for a
              receipt, or get in touch and we will help you schedule.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to="/services"
                className="inline-flex items-center gap-2 border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
              >
                View packages <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Contact
              </Link>
            </div>
          </div>
        )}

        <div className="mx-auto mt-12 max-w-xl text-center">
          <Link
            to="/"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Back to home
          </Link>
        </div>
      </Section>
    </>
  );
}
