export type Service = {
  slug: string;
  name: string;
  priceRange: string;
  tagline: string;
  description: string;
  includes: string[];
};

export const SERVICES: Service[] = [
  {
    slug: "runway-1to1",
    name: "1:1 Runway Coaching",
    priceRange: "£80 – £150",
    tagline: "Private sessions to refine your walk and on-runway presence.",
    description:
      "A focused one-to-one session covering posture, stride, pacing, posing, turns and stage presence. Tailored to your level and the casting you're preparing for.",
    includes: [
      "60–90 min private session",
      "Live walk drills with corrections",
      "Posture & alignment audit",
      "Personalised practice plan",
    ],
  },
  {
    slug: "beginner-foundations",
    name: "Beginner Model Foundations",
    priceRange: "£120 – £300",
    tagline: "Everything a new model needs to start strong.",
    description:
      "A complete starter programme for aspiring models: how the industry works, what agencies look for, basic walk and posing, and how to build your first portfolio.",
    includes: [
      "Industry-101 walkthrough",
      "Foundational walk & posing",
      "Portfolio & digitals guidance",
      "Self-tape & casting basics",
    ],
  },
  {
    slug: "advanced-runway",
    name: "Advanced Runway Training",
    priceRange: "£150 – £350",
    tagline: "For working models levelling up to higher-tier shows.",
    description:
      "High-intensity runway training for models with experience. Refine signature walk, tempo control, garment handling and editorial expression for top-tier castings.",
    includes: [
      "Tempo & musicality drills",
      "Garment & shoe handling",
      "Editorial expression coaching",
      "Show-day preparation",
    ],
  },
  {
    slug: "walk-analysis",
    name: "Walk Analysis & Feedback",
    priceRange: "£30 – £80",
    tagline: "Send a video. Get an expert breakdown.",
    description:
      "Send a clip of your walk and receive a frame-by-frame written and voice-noted breakdown with specific corrections and drills.",
    includes: [
      "Detailed video analysis",
      "Voice + written feedback",
      "Custom drill list",
      "48-hour turnaround",
    ],
  },
  {
    slug: "casting-prep",
    name: "Casting Preparation Coaching",
    priceRange: "£60 – £120",
    tagline: "Walk in calm. Walk out remembered.",
    description:
      "Targeted prep for an upcoming casting: opening, walk, conversation, signature pose, and how to leave a lasting impression on the room.",
    includes: [
      "Casting walk-through",
      "Confidence & first-impression coaching",
      "Q&A and small-talk prep",
      "Same-week availability",
    ],
  },
  {
    slug: "confidence-presence",
    name: "Confidence & Presence Training",
    priceRange: "£60 – £120",
    tagline: "The mindset behind every great walk.",
    description:
      "Mindset and presence work for models who feel they can do more than their nerves allow. Build calm, command the room, and own every casting.",
    includes: [
      "Pre-casting mindset rituals",
      "Body-language coaching",
      "Eye contact & energy work",
      "Daily confidence practice",
    ],
  },
  {
    slug: "monthly-mentorship",
    name: "Monthly Mentorship",
    priceRange: "£250 – £700 / month",
    tagline: "Ongoing coaching to scale your career and income.",
    description:
      "A monthly partnership: personalised coaching, content & branding strategy, casting prep, and accountability. For models serious about turning visibility into paying work.",
    includes: [
      "Weekly 1:1 sessions",
      "Brand & content strategy",
      "Casting & opportunity reviews",
      "Direct messaging access",
    ],
  },
];

export const CALENDLY_URL = "https://calendly.com/alekm423/discovery";
