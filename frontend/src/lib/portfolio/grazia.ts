import graziaLook1 from "@/assets/portfolio/grazia-look-1.png";
import graziaLook2 from "@/assets/portfolio/grazia-look-2.png";
import graziaLook3 from "@/assets/portfolio/grazia-look-3.png";
import graziaCover from "@/assets/portfolio/grazia-cover.png";
import type { PortfolioImageSlide } from "./types";

export { graziaCover };

export const GRAZIA_IMAGE_SLIDES: PortfolioImageSlide[] = [
  {
    src: graziaCover,
    alt: "Grazia cover feature with Alek in an editorial white and black gown",
  },
  {
    src: graziaLook1,
    alt: "Alek in a Grazia editorial look with circular halo set design",
  },
  {
    src: graziaLook2,
    alt: "Alek in Grazia editorial collaboration with another model in studio",
  },
  {
    src: graziaLook3,
    alt: "Alek in a black and magenta editorial dress from the Grazia shoot",
  },
];
