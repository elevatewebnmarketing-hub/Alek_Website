import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import resourcesImage from "@/assets/resources.jpg";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { ArrowRight, Download } from "lucide-react";
import { postLead, safePublicFetch } from "@/lib/publicApi";

type ResourceRow = {
  id: string;
  type: string;
  title: string;
  description: string;
  linkUrl: string | null;
};

export const Route = createFileRoute("/resources")({
  loader: async () => {
    const j = await safePublicFetch<{ items: ResourceRow[] }>("/api/public/resources");
    if (!j) return { items: [] as ResourceRow[], offline: true as const };
    return { items: j.items, offline: false as const };
  },
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

function ResourcesPage() {
  const { items, offline } = Route.useLoaderData();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setPending(true);
    const res = await postLead({
      name: name.trim() || "Resources list",
      email: email.trim(),
      message: "Resources page, join the list",
      source: "resources",
    });
    setPending(false);
    if (!res.ok) {
      setErr(res.error ?? "Something went wrong");
      return;
    }
    setSent(true);
    setEmail("");
    setName("");
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
        {offline ? (
          <p className="mb-6 max-w-xl text-sm text-muted-foreground">
            Set <code className="text-foreground">VITE_PUBLIC_API_URL</code> to sync resource cards from
            the CMS.
          </p>
        ) : null}
        <div className="grid gap-px bg-border md:grid-cols-2">
          {items.map((r) => (
            <div key={r.id} className="flex flex-col bg-background p-8 lg:p-10">
              <div className="editorial-eyebrow">{r.type}</div>
              <h2 className="font-serif text-2xl mt-4 leading-tight">{r.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{r.description}</p>
              {r.linkUrl ? (
                <a
                  href={r.linkUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex items-center gap-2 self-start text-[0.72rem] font-medium uppercase tracking-[0.22em] underline-offset-8 hover:underline"
                >
                  <Download className="size-4" /> Get resource
                </a>
              ) : (
                <span className="mt-8 inline-flex items-center gap-2 self-start text-[0.72rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  <Download className="size-4" /> Coming soon
                </span>
              )}
            </div>
          ))}
        </div>
        {items.length === 0 && !offline ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No resources published yet.</p>
        ) : null}
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <div className="editorial-eyebrow">Get the resources first</div>
          <h2 className="display-lg mt-6">Join the list. New tools, no spam.</h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Leave your name and email. We will route this into your admin leads inbox. Add Resend later
            for automated sends.
          </p>
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-10 flex max-w-lg flex-col gap-3"
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full border border-foreground bg-background px-4 py-3.5 text-sm placeholder:text-muted-foreground focus:outline-none"
            />
            <div className="flex flex-col gap-3 sm:flex-row">
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
                disabled={pending}
                className="inline-flex items-center justify-center gap-3 border border-foreground bg-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-background hover:bg-background hover:text-foreground disabled:opacity-50"
              >
                Subscribe <ArrowRight className="size-4" />
              </button>
            </div>
          </form>
          {err ? <p className="mt-4 text-sm text-red-600 dark:text-red-400">{err}</p> : null}
          {sent && (
            <p className="mt-4 text-sm text-muted-foreground">
              Thank you. Your details were saved. We will be in touch when new resources drop.
            </p>
          )}
        </div>
      </Section>
    </>
  );
}
