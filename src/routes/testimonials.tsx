import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { ArrowRight, Clock3 } from "lucide-react";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: pageMeta({
      title: "Testimonials · Runway Refined by Alek",
      description:
        "Client stories and transformations from Runway Refined coaching.",
      path: "/testimonials",
    }),
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="Client stories are coming soon."
        intro="As clients finish sessions and programmes, their words will land here first."
      />

      <Section className="border-b border-border">
        <div className="mx-auto max-w-3xl border border-border bg-background p-10 text-center lg:p-14">
          <Clock3 className="mx-auto size-8 text-muted-foreground/60" />
          <h2 className="display-lg mt-6">No public testimonials yet.</h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            This space is for real client voices only. If you are working with
            Alek now, yours might be among the first we publish.
          </p>
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
