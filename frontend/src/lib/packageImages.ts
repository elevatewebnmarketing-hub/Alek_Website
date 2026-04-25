import aboutPortrait from "@/assets/about-portrait.jpg";
import heroRunway from "@/assets/hero-runway.jpg";
import servicesWalk from "@/assets/services-walk.jpg";
import transformation from "@/assets/transformation.jpg";
import resources from "@/assets/resources.jpg";
import graziaCover from "@/assets/portfolio/grazia-cover.png";
import wonderland01 from "@/assets/portfolio/wonderland-01-seated.png";
import alekHome from "@/assets/alek-home-portrait.png";

import type { PackageImageKey } from "./services";

/** Resolved asset URLs for package detail galleries (edit `services.ts` keys only). */
export const PACKAGE_IMAGE_URLS: Record<PackageImageKey, string> = {
  walk: servicesWalk,
  runway: heroRunway,
  portrait: aboutPortrait,
  about: aboutPortrait,
  home: alekHome,
  transformation,
  resources,
  grazia: graziaCover,
  wonderland: wonderland01,
};
