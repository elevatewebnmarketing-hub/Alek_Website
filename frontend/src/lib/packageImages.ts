import type { PackageSlug } from "./services";

export type PackageMedia = {
  hero: string;
  detail: string;
  alt: string;
};

/**
 * Curated fresh editorial visuals per package (distinct from legacy site assets).
 * These are CDN image URLs for fast swap now; replace with local assets later if preferred.
 */
export const PACKAGE_MEDIA: Record<PackageSlug, PackageMedia> = {
  "runway-1to1": {
    hero: "https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=1600&q=80",
    detail: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80",
    alt: "Editorial runway coaching image with strong posture focus",
  },
  "beginner-foundations": {
    hero: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
    detail: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1600&q=80",
    alt: "Beginner runway foundations training in studio setting",
  },
  "advanced-runway": {
    hero: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=1600&q=80",
    detail: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=80",
    alt: "Advanced runway editorial with dramatic movement",
  },
  "walk-analysis": {
    hero: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
    detail: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80",
    alt: "Runway clip analysis and coaching feedback scene",
  },
  "casting-prep": {
    hero: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80",
    detail: "https://images.unsplash.com/photo-1469398715555-76331a6c7cf7?auto=format&fit=crop&w=1600&q=80",
    alt: "Casting preparation editorial with poised entrance energy",
  },
  "confidence-presence": {
    hero: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1600&q=80",
    detail: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1600&q=80",
    alt: "Confidence and stage presence portrait image",
  },
  "monthly-mentorship": {
    hero: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=1600&q=80",
    detail: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80",
    alt: "Mentorship planning session in a modern creative studio",
  },
};

export function getPackageMedia(slug: PackageSlug): PackageMedia {
  return PACKAGE_MEDIA[slug];
}
