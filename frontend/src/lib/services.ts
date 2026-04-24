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
    tagline: "One-to-one time to lift your walk and your presence on the runway.",
    description:
      "A focused session on your walk, posture, and how you read on the runway. You leave with notes you can rehearse the same day.",
    includes: [
      "45–60 minute live video session",
      "Posture correction and walk training",
      "Feedback you can act on before the next session",
      "A clear practice focus between calls",
    ],
  },
  {
    slug: "beginner-foundations",
    name: "Beginner Model Foundations (Runway Basics)",
    priceRange: "£120 – £300",
    tagline: "A calm runway foundation if you are new and want to feel ready sooner.",
    description:
      "For newer models who want the basics down before castings and shoots: fundamentals, confidence, and what the room expects from you.",
    includes: [
      "60 minute runway basics session",
      "How to walk in heels, posture, and clean turns",
      "Facial expression and body awareness",
      "What new models are usually expected to know",
    ],
  },
  {
    slug: "advanced-runway",
    name: "Advanced Runway Training",
    priceRange: "£150 – £350",
    tagline: "For when you already walk well and want a signature that travels.",
    description:
      "For experienced models who want a stronger signature walk and the flexibility to adapt when the brief changes.",
    includes: [
      "60 minute advanced runway coaching session",
      "Signature walk development and transitions",
      "Pacing control and runway rhythm",
      "Adapting your walk to different brands and styles",
    ],
  },
  {
    slug: "walk-analysis",
    name: "Walk Analysis & Feedback",
    priceRange: "£30 – £80",
    tagline: "Send a clip. Get a clear read on what to fix first.",
    description:
      "Upload a runway or practice clip and get a tight review of what is working, what is not, and what to drill next.",
    includes: [
      "10–15 minute pre-recorded review",
      "Detailed video feedback",
      "Voice note or written feedback",
      "Specific corrections to take into practice",
    ],
  },
  {
    slug: "casting-prep",
    name: "Casting Preparation Coaching",
    priceRange: "£60 – £120",
    tagline: "Walk in clear-headed and leave them with a strong impression.",
    description:
      "Targeted prep so you can present yourself cleanly and confidently, in line with what agencies and clients scan for.",
    includes: [
      "45 minute casting preparation session",
      "How to enter and exit professionally",
      "What agencies and clients look for",
      "Body language and first impression coaching",
    ],
  },
  {
    slug: "confidence-presence",
    name: "Confidence & Presence Training",
    priceRange: "£60 – £120",
    tagline: "Mindset and body language when stiffness or nerves get in the way.",
    description:
      "Mindset and presence work for models who want to feel more natural on the runway and less stuck in their head.",
    includes: [
      "45 minute confidence coaching session",
      "Body language and stage presence training",
      "Ways to ease nerves and physical stiffness",
      "Confidence drills you can repeat on your own",
    ],
  },
  {
    slug: "monthly-mentorship",
    name: "Monthly Mentorship Programme",
    priceRange: "£250 – £700 / month",
    tagline: "Steady support when you are serious about compounding progress.",
    description:
      "An ongoing partnership for runway, confidence, content direction, and career moves, with room to adjust as you grow.",
    includes: [
      "Weekly 45–60 minute coaching calls",
      "Regular progress tracking and check-ins",
      "Ongoing feedback and strategic direction",
      "Priority support between sessions",
    ],
  },
];

export const CALENDLY_URL = "https://calendly.com/your-calendly-link";
