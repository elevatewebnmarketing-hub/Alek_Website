import * as React from "react";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import type { PortfolioVideoSlide } from "@/lib/portfolio/types";

type PortfolioVideoCarouselProps = {
  slides: PortfolioVideoSlide[];
  className?: string;
};

/**
 * Video carousel: only the active slide's <video> receives a `src` (preload none)
 * so multiple large files are not requested in parallel.
 */
export function PortfolioVideoCarousel({ slides, className }: PortfolioVideoCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [selected, setSelected] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!api) return;

    const applySelected = () => {
      setSelected(api.selectedScrollSnap());
    };
    const pauseVideos = () => {
      const root = containerRef.current;
      if (!root) return;
      root.querySelectorAll("video.portfolio-carousel-video").forEach((el) => {
        (el as HTMLVideoElement).pause();
      });
    };
    const onSelect = () => {
      applySelected();
      pauseVideos();
    };
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  return (
    <div ref={containerRef}>
      <Carousel
        setApi={setApi}
        className={cn("mx-auto w-full max-w-3xl", className)}
        opts={{ align: "start", loop: true }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {slides.map((video, slideIndex) => {
            const isActive = slideIndex === selected;
            return (
              <CarouselItem key={video.src} className="pl-2 md:pl-4">
                <div className="border border-border bg-secondary/20 p-4 md:p-5">
                  <video
                    src={isActive ? video.src : undefined}
                    controls
                    playsInline
                    preload="none"
                    className="portfolio-carousel-video aspect-[9/16] w-full bg-black object-cover"
                  />
                  <h3 className="mt-4 font-serif text-2xl">{video.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{video.note}</p>
                  <a
                    href={video.src}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-[0.72rem] font-medium uppercase tracking-[0.2em] underline-offset-8 hover:underline"
                  >
                    Open video
                  </a>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <div className="mt-6 flex items-center justify-center gap-3">
          <CarouselPrevious className="static left-auto top-auto translate-y-0" />
          <CarouselNext className="static right-auto top-auto translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
}
