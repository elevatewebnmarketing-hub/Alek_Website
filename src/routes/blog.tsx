import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: pageMeta({
      title: "Journal · Runway Refined by Alek",
      description:
        "Trend notes, runway guidance, and model growth ideas from Alek Deng Malek.",
      path: "/blog",
    }),
  }),
  component: BlogPage,
});

const POSTS = [
  {
    slug: "fashion-trends-models-should-watch",
    category: "Industry Trends",
    title: "Fashion Trends Models Should Watch This Season",
    excerpt:
      "The shifts in aesthetics, casting preferences, and content style that are shaping model demand right now.",
    date: "Coming soon",
  },
  {
    slug: "what-agencies-look-for-now",
    category: "Industry Trends",
    title: "What Agencies and Clients Are Looking For Right Now",
    excerpt:
      "A practical breakdown of the qualities, presentation, and professionalism decision-makers are prioritising.",
    date: "Coming soon",
  },
  {
    slug: "social-content-that-converts",
    category: "Content Strategy",
    title: "How Models Can Turn Social Media Content Into Paying Work",
    excerpt:
      "The structure, consistency, and positioning that helps online visibility turn into real client enquiries.",
    date: "Coming soon",
  },
  {
    slug: "runway-casting-readiness-checklist",
    category: "Runway",
    title: "Runway and Casting Readiness: A Practical Checklist",
    excerpt:
      "A clear prep checklist models can use before castings, training sessions, and high-stakes opportunities.",
    date: "Coming soon",
  },
];

function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="The Journal"
        title="Fashion trends, strategy, and model growth insights."
        intro="Short reads on what is shifting in fashion and how you can adapt, grow, and get paid."
      />

      <Section className="border-b border-border">
        <div className="grid gap-px bg-border md:grid-cols-2">
          {POSTS.map((p, i) => (
            <article
              key={p.slug}
              className="group flex flex-col bg-background p-8 lg:p-12"
            >
              <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
                <span>{p.category}</span>
                <span>{p.date}</span>
              </div>
              <h2 className="font-serif text-3xl mt-6 leading-tight lg:text-4xl">
                {p.title}
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {p.excerpt}
              </p>
              <span className="mt-8 inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Article {String(i + 1).padStart(2, "0")} · In progress
              </span>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <div className="editorial-eyebrow">Want it in your inbox?</div>
          <h2 className="display-lg mt-6">Get notified when essays drop.</h2>
          <Link
            to="/resources"
            className="mt-8 inline-flex items-center gap-3 border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
          >
            Join the list <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
