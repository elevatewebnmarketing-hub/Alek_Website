import { cn } from "@/lib/utils";

/** Transparent nav on top of media (works on both photos and dark video). */
const overlayButtonBase =
  "z-30 flex size-9 items-center justify-center rounded-full border-0 sm:size-10 bg-black/35 text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-black/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50";

export function portfolioCarouselOverlayPrevClass() {
  return cn(
    overlayButtonBase,
    "absolute !left-2 !top-1/2 !right-auto -translate-y-1/2 sm:!left-3",
  );
}

export function portfolioCarouselOverlayNextClass() {
  return cn(
    overlayButtonBase,
    "absolute !right-2 !top-1/2 !left-auto -translate-y-1/2 sm:!right-3",
  );
}
