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
      title: "FAQ · Runway Refined by Alek",
      description:
        "Answers to common questions about Alek's model coaching: who it is for, how sessions work, pricing, and what results to expect.",
      path: "/faq",
    }),
  }),
  component: FaqPage,
});

const FAQS = [
  {
    q: "Who is this coaching for?",
    a: "Beginners finding their feet, intermediates building visibility, and advanced models pushing income and opportunities. If modelling is a real career goal for you, you are in the right place.",
  },
  {
    q: "How do sessions work?",
    a: "Most sessions are one-to-one on video. In person is sometimes possible depending on where you are. You pick a service and send a booking request. Stripe and Calendly are being wired up for launch.",
  },
  {
    q: "How much does it cost?",
    a: "From about £30 for a walk analysis up to £700 a month for full mentorship. Each service lists a clear band on the Services page so you can match spend to your stage.",
  },
  {
    q: "What results should I expect?",
    a: "Wins stack over time. Many people feel a shift in confidence and walk quality within the first few sessions. Bookings, agency interest, and paid jobs tend to follow when you keep showing up and refining the work.",
  },
  {
    q: "Are sessions online or in person?",
    a: "Both. Online reaches anywhere and is usually easiest to schedule. In person depends on location and availability.",
  },
  {
    q: "What's your refund policy?",
    a: "Need to move a session? Give us at least 24 hours' notice when you can. Refunds are looked at case by case. Message us and we will find something fair.",
  },
  {
    q: "Do you work with male and non-binary models?",
    a: "Yes. Coaching is open to models of every gender. Nothing here is one-size-fits-all.",
  },
  {
    q: "How should I prepare before my first session?",
    a: "Wear something fitted you can move in, bring heels if runway is on the plan, and come ready to talk goals. If you have practice clips, share them so feedback can be specific.",
  },
  {
    q: "Can I switch services after booking?",
    a: "Usually, yes. If your goals shift, we can move you to a better fit and adjust what you have already paid in a fair way.",
  },
  {
    q: "How often should I train to see progress?",
    a: "Weekly or fortnightly sessions plus practice between calls is what most people find works. Mentorship clients often keep a steady weekly rhythm.",
  },
  {
    q: "Do you help with social media and personal branding?",
    a: "Yes. Alongside runway and confidence, we can cover content direction, how you position your profile, and brand choices that support paid work.",
  },
  {
    q: "What do I get after a coaching session?",
    a: "You leave with clear notes and next steps. Depending on the service, that might mean correction points, drills, or a short plan to carry until the next call.",
  },
  {
    q: "What happens if I miss a session?",
    a: "Life happens. Message us as soon as you can. Rescheduling is simpler with notice, and missed sessions are handled fairly one case at a time.",
  },
  {
    q: "Can I book if I'm outside the UK?",
    a: "Yes. Online coaching runs worldwide, and we can find times that work across zones.",
  },
];

function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="The questions, answered."
        intro="Straight answers on how coaching works here. If yours is not listed, just ask."
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
          <h2 className="display-lg mt-6">Send a message. We will reply.</h2>
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
