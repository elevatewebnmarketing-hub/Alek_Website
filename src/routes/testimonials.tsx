import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { ArrowRight, Quote } from "lucide-react";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: pageMeta({
      title: "Testimonials — Runway Refined by Alek",
      description:
        "Words from models Alek has coached. Real stories of runway refinement, confidence and career growth.",
      path: "/testimonials",
    }),
  }),
  component: TestimonialsPage,
});

const TESTIMONIALS = [
  {
    quote:
      "[Placeholder quote] Alek's coaching changed the way I walk into a room — castings feel different now.",
    author: "Future client",
    role: "Beginner model",
  },
  {
    quote:
      "[Placeholder quote] I finally understood my walk. Within weeks I was booking jobs I'd been turned down for before.",
    author: "Future client",
    role: "Working model",
  },
  {
    quote:
      "[Placeholder quote] More than a runway coach — Alek helped me build a brand I'm proud of.",
    author: "Future client",
    role: "Mentorship client",
  },
  {
    quote:
      "[Placeholder quote] The walk analysis was sharper than feedback I've had in years. Worth every penny.",
    author: "Future client",
    role: "Advanced model",
  },
];

function TestimonialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="Words from the models in the work."
        intro="Real testimonials from coaching clients will live here. Until then, this layout is held open and ready for the stories to come."
      />

      <Section className="border-b border-border">
        <div className="grid gap-px bg-border md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={i}
              className="flex flex-col justify-between bg-background p-8 lg:p-12"
            >
              <Quote className="size-8 text-muted-foreground/40" />
              <blockquote className="mt-6 font-serif text-2xl italic leading-snug lg:text-3xl">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-10 border-t border-border pt-6">
                <div className="font-serif text-lg">{t.author}</div>
                <div className="editorial-eyebrow mt-1">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <div className="editorial-eyebrow">Be the next story</div>
          <h2 className="display-lg mt-6">Your refinement starts here.</h2>
          <Link
            to="/booking"
            className="mt-8 inline-flex items-center gap-3 border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
          >
            Book a Session <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
