import { Link } from "@tanstack/react-router";
import { Instagram, Mail } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border bg-background">
      <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-12">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="inline-flex items-center gap-3">
              <BrandMark className="size-10 text-foreground" />
              <div>
                <div className="font-serif text-3xl leading-none">Runway Refined</div>
                <div className="editorial-eyebrow mt-2">by Alek Deng Malek</div>
              </div>
            </div>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              Personalised model coaching for those building a long-term career
              in fashion. Runway, branding, mindset — refined.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="editorial-eyebrow mb-5">Explore</div>
            <ul className="space-y-3 text-sm">
              <li><Link to="/services" className="hover:underline">Services</Link></li>
              <li><Link to="/booking" className="hover:underline">Booking</Link></li>
              <li><Link to="/resources" className="hover:underline">Resources</Link></li>
              <li><Link to="/blog" className="hover:underline">Journal</Link></li>
              <li><Link to="/faq" className="hover:underline">FAQ</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="editorial-eyebrow mb-5">Contact</div>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:Alekm423@gmail.com"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <Mail className="size-4" /> Alekm423@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <Instagram className="size-4" /> Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-xs uppercase tracking-[0.18em] text-muted-foreground md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Runway Refined by Alek</div>
          <div>Worldwide · Coaching in English</div>
        </div>
      </div>
    </footer>
  );
}
