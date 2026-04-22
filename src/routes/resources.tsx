import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import resourcesImage from "@/assets/resources.jpg";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { ArrowRight, Download } from "lucide-react";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: pageMeta({
      title: "Free Resources · Runway Refined by Alek",
      description:
        "Free runway, branding, and casting resources for models. Join the list for new drops.",
      image: resourcesImage,
      path: "/resources",
    }),
  }),
  component: ResourcesPage,
});

const RESOURCES = [
  {
    type: "Guide",
    title: "The Runway Walk Foundations Guide",
    desc: "A 14-page PDF covering posture, stride, tempo and the small details castings notice.",
  },
  {
    type: "Checklist",
    title: "Casting Day Preparation Checklist",
    desc: "Everything to pack, prepare and rehearse the night before any casting.",
  },
  {
    type: "Drills",
    title: "5-Minute Daily Walk Drills",
    desc: "A short, repeatable routine to refine your walk between sessions.",
  },
  {
    type: "Video",
    title: "Walk Analysis Walkthrough",
    desc: "How to film a walk video that is actually useful for feedback: angle, light, and length.",
  },
];

function ResourcesPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect this form to your mailing list provider.
    setSent(true);
    setEmail("");
  };

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Free tools to grow your model career."
        intro="Practical downloads and guides for runway, branding, and content that earns attention."
      />

      <Section className="border-b border-border pt-0">
        <img
          src={resourcesImage}
          alt="Editorial photograph of a model holding a portfolio"
          loading="lazy"
          className="aspect-[21/8] w-full object-cover"
          width={1400}
          height={1000}
        />
      </Section>

      <Section className="border-b border-border">
        <div className="grid gap-px bg-border md:grid-cols-2">
          {RESOURCES.map((r) => (
            <div key={r.title} className="flex flex-col bg-background p-8 lg:p-10">
              <div className="editorial-eyebrow">{r.type}</div>
              <h2 className="font-serif text-2xl mt-4 leading-tight">{r.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {r.desc}
              </p>
              <button
                type="button"
                className="mt-8 inline-flex items-center gap-2 self-start text-[0.72rem] font-medium uppercase tracking-[0.22em] underline-offset-8 hover:underline"
              >
                <Download className="size-4" /> Coming soon
              </button>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <div className="editorial-eyebrow">Get the resources first</div>
          <h2 className="display-lg mt-6">
            Join the list. New tools, no spam.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Leave your email and we will let you know when something new is
            ready. Delivery automation is still being finalised.
          </p>
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-10 flex max-w-lg flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 border border-foreground bg-background px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-3 border border-foreground bg-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-background hover:bg-background hover:text-foreground"
            >
              Subscribe <ArrowRight className="size-4" />
            </button>
          </form>
          {sent && (
            <p className="mt-4 text-sm text-muted-foreground">
              Thank you. You are on the list. New resources will show up here
              and in your inbox.
            </p>
          )}
        </div>
      </Section>
    </>
  );
}
