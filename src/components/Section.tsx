import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

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
