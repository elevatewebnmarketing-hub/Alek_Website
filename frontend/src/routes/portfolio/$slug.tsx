import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageHero, Section } from "@/components/Section";
import { PortfolioCarousel, CarouselItem } from "@/components/PortfolioCarousel";
import { PortfolioVideoCarousel } from "@/components/PortfolioVideoCarousel";
import { pageMeta } from "@/components/PageMeta";
import { safePublicFetchDetail } from "@/lib/publicApi";
import type { PortfolioVideoSlide } from "@/lib/portfolio/types";

type PortfolioDetail = {
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  body: string;
  heroImage: string | null;
  content: {
    imageSlides?: { src: string; alt?: string }[];
    videoSlides?: PortfolioVideoSlide[];
  };
};

export const Route = createFileRoute("/portfolio/$slug")({
  loader: async ({ params }) => {
    const res = await safePublicFetchDetail<PortfolioDetail>(`/api/public/portfolio/${params.slug}`);
    if (res.kind === "notFound") throw notFound();
    if (res.kind === "unavailable") return null;
    return res.data;
  },
  head: ({ loaderData, params }) => {
    const siteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "");
    const path = `/portfolio/${params.slug}`;
    if (!loaderData) {
      return {
        meta: pageMeta({
          title: "Portfolio · Runway Refined by Alek",
          description: "Editorial and runway work.",
          path,
        }),
      };
    }
    const ogImage =
      loaderData.heroImage && siteUrl ? `${siteUrl}${loaderData.heroImage}` : undefined;
    return {
      meta: pageMeta({
        title: `${loaderData.title} · Portfolio · Runway Refined by Alek`,
        description: loaderData.intro.slice(0, 160),
        image: ogImage,
        path,
      }),
    };
  },
  component: PortfolioProjectPage,
});

function PortfolioProjectPage() {
  const data = Route.useLoaderData();

  if (!data) {
    return (
      <Section>
        <p className="max-w-xl text-muted-foreground">
          We couldn&rsquo;t load this project. Set <code className="text-foreground">VITE_PUBLIC_API_URL</code>{" "}
          in Vercel, ensure the API is up, and allow this site&rsquo;s origin in the API CORS settings.
        </p>
      </Section>
    );
  }

  const images = data.content?.imageSlides ?? [];
  const videos = data.content?.videoSlides ?? [];

  return (
    <>
      <PageHero eyebrow={data.eyebrow} title={data.title} intro={data.intro} />

      <Section className="border-b border-border">
        <Link
          to="/portfolio"
          className="inline-flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> All portfolio
        </Link>

        <div
          className="journal-body mt-10 max-w-3xl space-y-6 text-base leading-relaxed text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_p]:mt-6 [&_p:first-child]:mt-0"
          dangerouslySetInnerHTML={{ __html: data.body }}
        />

        {images.length > 0 ? (
          <div className="mt-14">
            <PortfolioCarousel>
              {images.map((img) => (
                <CarouselItem key={img.src}>
                  <img
                    src={img.src}
                    alt={img.alt ?? ""}
                    className="w-full border border-border object-cover"
                    loading="lazy"
                  />
                </CarouselItem>
              ))}
            </PortfolioCarousel>
          </div>
        ) : null}

        {videos.length > 0 ? (
          <div className="mt-14">
            <PortfolioVideoCarousel slides={videos} />
          </div>
        ) : null}
      </Section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <div className="editorial-eyebrow">Next</div>
          <h2 className="display-lg mt-6">Book a session.</h2>
          <Link
            to="/booking"
            className="mt-8 inline-flex items-center gap-3 border border-foreground px-6 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] hover:bg-foreground hover:text-background"
          >
            Book a Session <ArrowRight className="size-4" />
          </Link>
        </div>
      </Section>
    </>
  );
}
