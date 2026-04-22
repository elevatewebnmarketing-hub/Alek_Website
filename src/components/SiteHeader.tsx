import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import siteLogo from "@/assets/runway-refined-logo.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/services", label: "Services" },
  { to: "/booking", label: "Booking" },
  { to: "/resources", label: "Resources" },
  { to: "/blog", label: "Journal" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-6 lg:px-10 2xl:px-12">
        <Link
          to="/"
          className="group inline-flex min-w-0 items-center"
          onClick={() => setOpen(false)}
        >
          <img
            src={siteLogo}
            alt="Runway Refined logo"
            className="h-12 w-auto object-contain sm:h-14 md:h-16"
            width={1024}
            height={683}
          />
        </Link>

        <nav className="hidden items-center gap-5 xl:flex 2xl:gap-7">
          {NAV.slice(1).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="whitespace-nowrap text-[0.72rem] font-medium uppercase tracking-[0.16em] text-foreground/70 transition-colors hover:text-foreground 2xl:text-[0.78rem] 2xl:tracking-[0.18em]"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden 2xl:block">
          <Link
            to="/booking"
            className="inline-flex items-center border border-foreground bg-foreground px-5 py-2.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-background transition-colors hover:bg-background hover:text-foreground"
          >
            Book a Session
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="xl:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background xl:hidden">
          <nav className="flex flex-col px-6 py-6">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/60 py-4 text-sm uppercase tracking-[0.2em] text-foreground/80"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/booking"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex items-center justify-center border border-foreground bg-foreground px-5 py-3 text-xs font-medium uppercase tracking-[0.22em] text-background"
            >
              Book a Session
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
