import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: pageMeta({
      title: "FAQ — Runway Refined by Alek",
      description:
        "Answers to the most common questions about Alek's model coaching: who it's for, how sessions work, pricing, and what results to expect.",
      path: "/faq",
    }),
  }),
  component: FaqPage,
});

const FAQS = [
  {
    q: "Who is this coaching for?",
    a: "Beginner models taking their first steps, intermediate models building visibility, and advanced models scaling income and opportunities. If you're serious about modelling as a long-term career, this is for you.",
  },
  {
    q: "How do sessions work?",
    a: "Most sessions are 1:1 over video call, with in-person sessions available depending on location. You'll book a slot, pay securely in GBP, and choose a time via Calendly. Each session is tailored to your level and goals.",
  },
  {
    q: "How much does it cost?",
    a: "Pricing ranges from £30 for a walk analysis to £700/month for full mentorship. Each service has a clear price band on the Services page so you can choose what fits your budget and stage.",
  },
  {
    q: "What results should I expect?",
    a: "Results compound. Most clients see noticeable improvement in confidence and walk quality within the first few sessions. Real career growth — bookings, agency interest, paid work — is the product of consistent, refined effort over months.",
  },
  {
    q: "Are sessions online or in person?",
    a: "Both are available. Online coaching works worldwide and is the most flexible. In-person sessions can be arranged depending on location and availability.",
  },
  {
    q: "What's your refund policy?",
    a: "If you need to reschedule, just let us know at least 24 hours in advance. Refunds are handled case-by-case — get in touch and we'll find a fair solution.",
  },
  {
    q: "Do you work with male and non-binary models?",
    a: "Yes — coaching is open to models of every gender. The work is personalised, never one-size-fits-all.",
  },
];

function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="The questions, answered."
        intro="A quick guide to how the coaching works. Anything else, get in touch."
      />

      <Section className="border-b border-border">
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`q-${i}`} className="border-b border-border">
                <AccordionTrigger className="py-6 text-left font-serif text-xl hover:no-underline lg:text-2xl">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <div className="editorial-eyebrow">Still wondering?</div>
          <h2 className="display-lg mt-6">Send a message — we'll reply.</h2>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-3 border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
          >
            Contact Alek <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
