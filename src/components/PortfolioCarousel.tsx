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

type PortfolioCarouselProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Wraps Embla carousel with in-viewport prev/next controls and pauses any
 * HTML5 videos inside the carousel when the slide changes.
 */
export function PortfolioCarousel({ children, className }: PortfolioCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!api) return;

    const pauseVideos = () => {
      const root = containerRef.current;
      if (!root) return;
      root.querySelectorAll("video.portfolio-carousel-video").forEach((el) => {
        (el as HTMLVideoElement).pause();
      });
    };

    const onSelect = () => {
      pauseVideos();
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div ref={containerRef}>
      <Carousel
        setApi={setApi}
        className={cn("mx-auto w-full max-w-3xl", className)}
        opts={{ align: "start", loop: true }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">{children}</CarouselContent>
        <div className="mt-6 flex items-center justify-center gap-3">
          <CarouselPrevious className="static left-auto top-auto translate-y-0" />
          <CarouselNext className="static right-auto top-auto translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
}

export { CarouselItem };
