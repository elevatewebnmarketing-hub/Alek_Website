import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, Section } from "@/components/Section";
import { pageMeta } from "@/components/PageMeta";
import { ArrowRight, Instagram, Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: pageMeta({
      title: "Contact · Runway Refined by Alek (UK)",
      description:
        "Reach Alek Deng Malek at Runway Refined by Alek. UK-based coaching for aspiring and professional models worldwide.",
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
        intro="Tell Alek where you are on your modelling path and what would help. Every stage is welcome."
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
                  href="tel:+447778523990"
                  className="inline-flex items-center gap-3 hover:underline"
                >
                  <Phone className="size-5" /> +44 7778 523990
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/alek_maleek?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 hover:underline"
                >
                  <Instagram className="size-5" /> @alek_maleek
                </a>
              </li>
            </ul>
            <div className="mt-12 border-t border-border pt-8">
              <div className="editorial-eyebrow">Coverage</div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Based in the UK. Online coaching is available worldwide, and
                in-person sessions are arranged by request when location and
                schedule align.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
