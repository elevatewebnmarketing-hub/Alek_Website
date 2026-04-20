import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/BrandMark";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
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
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-5 lg:px-12">
        <Link to="/" className="group inline-flex items-center gap-3 leading-none" onClick={() => setOpen(false)}>
          <BrandMark className="size-8 text-foreground sm:size-9" />
          <span className="flex flex-col">
            <span className="font-serif text-xl tracking-tight text-foreground sm:text-2xl">
              Runway Refined
            </span>
            <span className="editorial-eyebrow mt-1">by Alek</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.slice(1).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-[0.78rem] font-medium uppercase tracking-[0.18em] text-foreground/70 transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
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
          className="lg:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
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
