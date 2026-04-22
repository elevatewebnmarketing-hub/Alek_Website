import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone } from "lucide-react";
import siteLogo from "@/assets/runway-refined-logo.png";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border bg-background">
      <div className="mx-auto max-w-[1600px] px-6 py-16 lg:px-12">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <img
              src={siteLogo}
              alt="Runway Refined logo"
              className="h-24 w-auto object-contain sm:h-28"
              loading="lazy"
              width={1024}
              height={683}
            />
            <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
              UK-based coaching for models worldwide. Runway, branding,
              mindset, refined.
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
                  href="tel:+447778523990"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <Phone className="size-4" /> +44 7778 523990
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/alek_maleek?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:underline"
                >
                  <Instagram className="size-4" /> @alek_maleek
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-xs uppercase tracking-[0.18em] text-muted-foreground md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} Runway Refined by Alek</div>
          <div>UK Based · Coaching Worldwide</div>
        </div>
      </div>
    </footer>
  );
}
