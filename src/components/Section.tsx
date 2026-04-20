import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import siteLogo from "@/assets/runway-refined-logo.png";

export function Section({
  children,
  className,
  as: Tag = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article";
}) {
  return (
    <Tag className={cn("px-6 py-20 lg:px-12 lg:py-28", className)}>
      <div className="mx-auto max-w-[1600px]">{children}</div>
    </Tag>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <Section className="border-b border-border pt-16 lg:pt-24">
      <img
        src={siteLogo}
        alt="Runway Refined logo"
        className="h-24 w-auto object-contain sm:h-28 lg:h-32"
        loading="lazy"
        width={1024}
        height={683}
      />
      <div className="editorial-eyebrow fade-in">{eyebrow}</div>
      <h1 className="display-xl mt-6 max-w-5xl fade-up">{title}</h1>
      {intro && (
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground fade-up">
          {intro}
        </p>
      )}
    </Section>
  );
}
