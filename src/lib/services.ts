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
    tagline: "Personalised coaching to improve your walk and runway presence.",
    description:
      "A personalised session focused on improving your walk, posture, and overall runway presence with practical direction you can apply immediately.",
    includes: [
      "45–60 minute live video session",
      "Posture correction and walk training",
      "Personalised feedback with actionable next steps",
      "Clear practice focus between sessions",
    ],
  },
  {
    slug: "beginner-foundations",
    name: "Beginner Model Foundations (Runway Basics)",
    priceRange: "£120 – £300",
    tagline: "Designed for new models building a strong foundation.",
    description:
      "A beginner-focused programme for new models who want to learn runway fundamentals and build confidence before castings and shoots.",
    includes: [
      "60 minute runway basics session",
      "How to walk in heels, posture, and clean turns",
      "Facial expression and body awareness",
      "Basic industry expectations for new models",
    ],
  },
  {
    slug: "advanced-runway",
    name: "Advanced Runway Training",
    priceRange: "£150 – £350",
    tagline: "For models who want to refine and elevate their runway walk.",
    description:
      "Advanced coaching for experienced models who want a stronger signature walk and better adaptability across different runway briefs.",
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
    tagline: "Detailed critique to improve your walk quickly.",
    description:
      "Submit your runway or practice video and receive a focused analysis highlighting what to improve and how to improve it.",
    includes: [
      "10–15 minute pre-recorded review",
      "Detailed video feedback",
      "Voice note or written feedback",
      "Specific corrections to apply in practice",
    ],
  },
  {
    slug: "casting-prep",
    name: "Casting Preparation Coaching",
    priceRange: "£60 – £120",
    tagline: "Prepare to show up confidently and professionally at castings.",
    description:
      "Targeted preparation for castings so you can present yourself clearly, confidently, and in line with what agencies are looking for.",
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
    tagline: "Mindset and body language coaching for stronger presence.",
    description:
      "Focused mindset and presence coaching for models who want to eliminate stiffness, feel more natural, and own the runway.",
    includes: [
      "45 minute confidence coaching session",
      "Body language and stage presence training",
      "Techniques to reduce nerves and stiffness",
      "Practical confidence exercises for consistency",
    ],
  },
  {
    slug: "monthly-mentorship",
    name: "Monthly Mentorship Programme",
    priceRange: "£250 – £700 / month",
    tagline: "Ongoing support for models serious about long-term growth.",
    description:
      "A long-term coaching partnership built for consistent improvement in runway, confidence, content direction, and career progress.",
    includes: [
      "Weekly 45–60 minute coaching calls",
      "Regular progress tracking and check-ins",
      "Ongoing feedback and strategic direction",
      "Priority support between sessions",
    ],
  },
];

export const CALENDLY_URL = "https://calendly.com/your-calendly-link";
