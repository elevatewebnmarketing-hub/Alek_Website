import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { ArrowRight, Clock3 } from "lucide-react";
import { getPublicApiBase } from "@/lib/publicApi";

type T = {
  id: string;
  quote: string;
  name: string;
  role: string | null;
  imageUrl: string | null;
};

export const Route = createFileRoute("/testimonials")({
  loader: async () => {
    const base = getPublicApiBase();
    if (!base) return { items: [] as T[], offline: true as const };
    const r = await fetch(`${base}/api/public/testimonials`);
    if (!r.ok) return { items: [] as T[], offline: true as const };
    const j = (await r.json()) as { items: T[] };
    return { items: j.items, offline: false as const };
  },
  head: () => ({
    meta: pageMeta({
      title: "Testimonials · Runway Refined by Alek",
      description: "Client stories and transformations from Runway Refined coaching.",
      path: "/testimonials",
    }),
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const { items, offline } = Route.useLoaderData();

  if (items.length === 0) {
    return (
      <>
        <PageHero
          eyebrow="Testimonials"
          title={offline ? "Connect the API to load testimonials." : "Client stories are coming soon."}
          intro={
            offline
              ? "Set VITE_PUBLIC_API_URL so published testimonials sync from the admin."
              : "As clients finish sessions and programmes, their words will land here first."
          }
        />

        <Section className="border-b border-border">
          <div className="mx-auto max-w-3xl border border-border bg-background p-10 text-center lg:p-14">
            <Clock3 className="mx-auto size-8 text-muted-foreground/60" />
            <h2 className="display-lg mt-6">No public testimonials yet.</h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              This space is for real client voices only. If you are working with Alek now, yours might be
              among the first we publish.
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

  return (
    <>
      <PageHero
        eyebrow="Testimonials"
        title="Client voices."
        intro="Stories from people who have trained and refined their path with Alek."
      />
      <Section className="border-b border-border">
        <div className="grid gap-8 md:grid-cols-2">
          {items.map((t) => (
            <blockquote
              key={t.id}
              className="border border-border bg-background p-8 lg:p-10"
            >
              <p className="font-serif text-2xl leading-snug lg:text-3xl">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-6 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{t.name}</span>
                {t.role ? ` · ${t.role}` : null}
              </footer>
            </blockquote>
          ))}
        </div>
      </Section>
      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <Link
            to="/booking"
            className="inline-flex items-center gap-3 border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
          >
            Book a Session <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
