import giorgioArmaniRunway from "../../../Videos/Giorgio Armani.mov";
import runwayFeature from "../../../Videos/Modeling on the Runway.mov";
import runwayWalk1 from "../../../Videos/Model Walking 1.mov";
import runwayWalk2 from "../../../Videos/Model walking 2.mov";
import runwayWalk3 from "../../../Videos/Model Walking 3.mov";
import runwayWalk4 from "../../../Videos/Model walking.mov";
import type { PortfolioVideoSlide } from "./types";

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
