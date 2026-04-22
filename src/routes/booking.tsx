import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { SERVICES, CALENDLY_URL } from "@/lib/services";
import { ArrowRight, Check } from "lucide-react";

const searchSchema = z.object({
  service: z.string().optional(),
});

export const Route = createFileRoute("/booking")({
  validateSearch: searchSchema,
  head: () => ({
    meta: pageMeta({
      title: "Book a Session · Runway Refined by Alek",
      description:
        "Reserve your coaching session and choose your service. Booking automation is almost ready.",
      path: "/booking",
    }),
  }),
  component: BookingPage,
});

const STEPS = [
  { n: "01", t: "Choose a service", d: "Pick what matches your level and your next goal." },
  { n: "02", t: "Pay securely", d: "Stripe checkout in GBP (finishing touches in progress)." },
  { n: "03", t: "Schedule with Calendly", d: "Your booking link goes live as soon as setup is complete." },
  { n: "04", t: "Show up and grow", d: "Confirmation emails will run automatically at launch." },
];

function BookingPage() {
  const search = Route.useSearch();
  const initial = SERVICES.find((s) => s.slug === search.service)?.slug ?? SERVICES[0].slug;
  const [selected, setSelected] = useState(initial);
  const service = SERVICES.find((s) => s.slug === selected) ?? SERVICES[0];

  const handleBook = () => {
    // TODO: Wire to Stripe Checkout (GBP) → success redirect → Calendly + confirmation email.
    if (CALENDLY_URL.includes("your-calendly-link")) {
      alert(
        "Calendly link placeholder is still active. Please add your real Calendly booking link before launch.",
      );
      return;
    }
    alert(
      "Stripe checkout will be wired up next. For now, you'll be taken to Calendly to schedule.",
    );
    window.open(CALENDLY_URL, "_blank", "noreferrer");
  };

  return (
    <>
      <PageHero
        eyebrow="Booking"
        title="Reserve your session."
        intro="Choose what fits where you are. Stripe and Calendly are being finalised before launch."
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
            <h2 className="display-lg mt-6">Choose your session.</h2>
            <div className="mt-10 grid gap-px bg-border sm:grid-cols-2">
              {SERVICES.map((s) => {
                const active = s.slug === selected;
                return (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => setSelected(s.slug)}
                    className={`flex flex-col items-start bg-background p-6 text-left transition-colors ${
                      active ? "ring-2 ring-foreground" : "hover:bg-secondary"
                    }`}
                  >
                    <div className="editorial-eyebrow">{s.priceRange}</div>
                    <div className="font-serif text-xl mt-3 leading-tight">
                      {s.name}
                    </div>
                    <div className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      {s.tagline}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-28 border border-border bg-background p-8">
              <div className="editorial-eyebrow">Your selection</div>
              <h3 className="font-serif text-3xl mt-4">{service.name}</h3>
              <div className="mt-2 editorial-eyebrow text-foreground">
                {service.priceRange}
              </div>
              <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
              <ul className="mt-6 space-y-2">
                {service.includes.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0" /> {i}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={handleBook}
                className="mt-8 inline-flex w-full items-center justify-center gap-3 border border-foreground bg-foreground px-6 py-4 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-background hover:bg-background hover:text-foreground"
              >
                Pay & Book <ArrowRight className="size-4" />
              </button>
              <p className="mt-4 text-center text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                Booking setup in progress · GBP pricing
              </p>
            </div>
          </aside>
        </div>
      </Section>

      <Section className="border-b border-border">
        <div className="editorial-eyebrow">Prefer to talk first?</div>
        <h2 className="display-lg mt-6 max-w-2xl">
          Book a free discovery call.
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          If you'd like to chat through your goals before committing to a
          paid session, schedule a short discovery call.
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
