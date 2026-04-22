import graziaLook1 from "@/assets/portfolio/grazia-look-1.png";
import graziaLook2 from "@/assets/portfolio/grazia-look-2.png";
import graziaLook3 from "@/assets/portfolio/grazia-look-3.png";
import graziaCover from "@/assets/portfolio/grazia-cover.png";
import vogueAfricaCoverYellow from "@/assets/portfolio/vogue-africa-cover-yellow.png";
import vogueAfricaCoverProfile from "@/assets/portfolio/vogue-africa-cover-profile.png";
import wonderland01 from "@/assets/portfolio/wonderland-01-seated.png";
import wonderland02 from "@/assets/portfolio/wonderland-02-standing.png";
import wonderland03 from "@/assets/portfolio/wonderland-03-three-quarter.png";
import wonderland04 from "@/assets/portfolio/wonderland-04-blue-dress.png";
import wonderland05 from "@/assets/portfolio/wonderland-05-duo.png";
import giorgioArmaniRunway from "../../Videos/Giorgio Armani.mov";
import runwayFeature from "../../Videos/Modeling on the Runway.mov";
import runwayWalk1 from "../../Videos/Model Walking 1.mov";
import runwayWalk2 from "../../Videos/Model walking 2.mov";
import runwayWalk3 from "../../Videos/Model Walking 3.mov";
import runwayWalk4 from "../../Videos/Model walking.mov";
import bts1 from "../../Videos/BTS 1.mov";
import bts2 from "../../Videos/BTS 2.mov";
import bts3 from "../../Videos/BTS 3.mov";

export type PortfolioImageSlide = {
  src: string;
  alt: string;
};

export type PortfolioVideoSlide = {
  src: string;
  title: string;
  note: string;
};

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

export const VOGUE_AFRICA_IMAGE_SLIDES: PortfolioImageSlide[] = [
  {
    src: vogueAfricaCoverYellow,
    alt: "Editorial Vogue Africa cover concept: model in magenta tailoring and headwrap against a yellow field with masthead typography",
  },
  {
    src: vogueAfricaCoverProfile,
    alt: "Editorial Vogue Africa cover concept: profile portrait with floral and leaf statement earring in warm directional light",
  },
];

export const WONDERLAND_IMAGE_SLIDES: PortfolioImageSlide[] = [
  {
    src: wonderland01,
    alt: "Wonderland editorial: model seated on a red seamless set in Ahluwalia SS24 Calypso knit mini and Chikari patchwork boots",
  },
  {
    src: wonderland02,
    alt: "Wonderland editorial: full-length portrait on red seamless backdrop in pink patterned mini dress and orange Chikari boots",
  },
  {
    src: wonderland03,
    alt: "Wonderland editorial: medium shot on red set in one-shoulder pink and green illusion-knit mini dress",
  },
  {
    src: wonderland04,
    alt: "Wonderland editorial: full-length portrait in pale blue one-shoulder midi and patchwork knee boots on red seamless",
  },
  {
    src: wonderland05,
    alt: "Wonderland editorial: two models on red set in light blue satin dress and grey Akin tracksuit",
  },
];

export const RUNWAY_VIDEO_SLIDES: PortfolioVideoSlide[] = [
  {
    src: giorgioArmaniRunway,
    title: "Giorgio Armani Runway",
    note: "A featured runway moment showcasing clean pacing, posture, and controlled transitions.",
  },
  {
    src: runwayFeature,
    title: "Modeling on the Runway",
    note: "Runway footage focused on presence, confidence, and floor command.",
  },
  {
    src: runwayWalk1,
    title: "Model Walking 1",
    note: "Practice-to-performance runway progression clip.",
  },
  {
    src: runwayWalk2,
    title: "Model Walking 2",
    note: "Additional runway segment focused on consistency in movement.",
  },
  {
    src: runwayWalk3,
    title: "Model Walking 3",
    note: "Runway clip highlighting controlled rhythm and presentation.",
  },
  {
    src: runwayWalk4,
    title: "Model Walking",
    note: "Editorial runway walk variation captured in live conditions.",
  },
];

export const BTS_VIDEO_SLIDES: PortfolioVideoSlide[] = [
  {
    src: bts1,
    title: "BTS 1",
    note: "Behind-the-scenes from set: preparation and direction before the final frame.",
  },
  {
    src: bts2,
    title: "BTS 2",
    note: "Production moments that show how polished imagery comes together.",
  },
  {
    src: bts3,
    title: "BTS 3",
    note: "On-set rhythm, styling, and the work behind the shot.",
  },
];

export const vogueAfricaCover = vogueAfricaCoverYellow;

export const wonderlandCover = wonderland01;

export { graziaCover };
