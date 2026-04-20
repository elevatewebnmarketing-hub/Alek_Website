import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { ArrowRight, Instagram, Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: pageMeta({
      title: "Contact — Runway Refined by Alek",
      description:
        "Get in touch with Alek Deng Malek for model coaching enquiries, collaborations, and questions.",
      path: "/contact",
    }),
  }),
  component: ContactPage,
});

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: connect this form to your chosen backend/email workflow.
    const subject = encodeURIComponent(`New enquiry from ${name}`);
    const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
    window.location.href = `mailto:Alekm423@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's start the conversation."
        intro="Tell Alek a little about you, where you are in your modelling journey, and what you're hoping to refine. Replies usually within 48 hours."
      />

      <Section className="border-b border-border">
        <div className="grid gap-16 lg:grid-cols-12">
          <form onSubmit={onSubmit} className="lg:col-span-7 lg:pr-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="editorial-eyebrow">Name</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-b border-foreground bg-transparent px-0 py-3 text-base focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="editorial-eyebrow">Email</span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-b border-foreground bg-transparent px-0 py-3 text-base focus:outline-none"
                />
              </label>
            </div>
            <label className="mt-10 flex flex-col gap-2">
              <span className="editorial-eyebrow">Your message</span>
              <textarea
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none border-b border-foreground bg-transparent px-0 py-3 text-base focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="mt-10 inline-flex items-center gap-3 border border-foreground bg-foreground px-7 py-4 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-background hover:bg-background hover:text-foreground"
            >
              Send message <ArrowRight className="size-4" />
            </button>
            {sent && (
              <p className="mt-6 text-sm text-muted-foreground">
                Your email client should now open with the message ready to send.
              </p>
            )}
          </form>

          <aside className="lg:col-span-5 lg:border-l lg:border-border lg:pl-12">
            <div className="editorial-eyebrow">Direct</div>
            <h2 className="display-lg mt-6">Other ways to reach out.</h2>
            <ul className="mt-10 space-y-6 text-base">
              <li>
                <a
                  href="mailto:Alekm423@gmail.com"
                  className="inline-flex items-center gap-3 hover:underline"
                >
                  <Mail className="size-5" /> Alekm423@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 hover:underline"
                >
                  <Instagram className="size-5" /> Instagram
                </a>
              </li>
            </ul>
            <div className="mt-12 border-t border-border pt-8">
              <div className="editorial-eyebrow">Coverage</div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Online coaching available worldwide. In-person sessions
                arranged on request — let us know your location.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
