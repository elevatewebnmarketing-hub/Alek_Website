import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: pageMeta({
      title: "Journal — Runway Refined by Alek",
      description:
        "Fashion industry insights, runway tips, and trends for working models. Written by model coach Alek Deng Malek.",
      path: "/blog",
    }),
  }),
  component: BlogPage,
});

const POSTS = [
  {
    slug: "five-runway-mistakes",
    category: "Runway",
    title: "Five Runway Mistakes Every New Model Makes",
    excerpt:
      "The small habits castings notice immediately — and how to fix them before your next walk.",
    date: "Coming soon",
  },
  {
    slug: "casting-mindset",
    category: "Mindset",
    title: "How to Walk Into a Casting Already Booked",
    excerpt:
      "The internal work that quietly separates models who get remembered from those who don't.",
    date: "Coming soon",
  },
  {
    slug: "build-personal-brand",
    category: "Brand",
    title: "Build a Personal Brand Clients Want to Pay For",
    excerpt:
      "Content, consistency and positioning — the modern formula for turning attention into income.",
    date: "Coming soon",
  },
  {
    slug: "industry-trends-2025",
    category: "Industry",
    title: "What's Shifting in Fashion Modelling Right Now",
    excerpt:
      "Quiet trends from the agencies, casting directors and brands worth paying attention to.",
    date: "Coming soon",
  },
];

function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="The Journal"
        title="Notes on runway, mindset and the modelling industry."
        intro="A place for slow, considered writing on the craft and business of modelling. New essays added regularly."
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
