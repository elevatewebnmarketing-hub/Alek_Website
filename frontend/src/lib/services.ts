/**
 * Coaching packages: each has a one-time item amount and a separate full package amount.
 * Walk analysis has special rules (see `walkAnalysisNotes` on that package).
 */

export type PackageImageKey =
  | "walk"
  | "runway"
  | "portrait"
  | "about"
  | "home"
  | "transformation"
  | "resources"
  | "grazia"
  | "wonderland";

export type FullPackagePrice = {
  /** e.g. "£150" or "£250 to £700 / month" */
  display: string;
  /** Primary GBP amount when a single number applies (mentorship can use minGbp) */
  amountGbp: number;
  maxAmountGbp?: number;
  /** e.g. "per month" */
  period?: string;
  /** Extra context for detail pages */
  notes?: string;
};

export type OneTimeItemPrice = {
  display: string;
  minGbp?: number;
  maxGbp?: number;
  /** Walk analysis: £60 applies when this is the only service booked. */
  singleServiceCapGbp?: number;
  notes?: string;
};

export type Package = {
  slug: string;
  name: string;
  /** Shown on cards and listings */
  priceSummary: string;
  tagline: string;
  description: string;
  includes: string[];
  oneTimeItem: OneTimeItemPrice;
  fullPackage: FullPackagePrice;
  /** The larger full-package fee can be paid in full or in instalments. */
  allowsInstalmentsForFullPackage: boolean;
  /** Longer copy blocks for the package detail page */
  detailSections: { title: string; body: string }[];
  /** Keys into `packageImages.PACKAGE_IMAGE_URLS` */
  heroImageKey: PackageImageKey;
  galleryImageKeys: PackageImageKey[];
  /** If set, show extra walk analysis pricing callouts */
  walkAnalysisNotes?: { singleService: string; bundle: string };
};

const section = (title: string, body: string) => ({ title, body });

export const PACKAGES: Package[] = [
  {
    slug: "runway-1to1",
    name: "1:1 Runway Coaching",
    priceSummary: "Item from £80 · Full package from £150",
    tagline: "One-to-one time to lift your walk and your presence on the runway.",
    description:
      "A focused session on your walk, posture, and how you read on the runway. You leave with notes you can rehearse the same day.",
    includes: [
      "45 to 60 minute live video session",
      "Posture correction and walk training",
      "Feedback you can act on before the next session",
      "A clear practice focus between calls",
    ],
    oneTimeItem: {
      display: "£80",
      minGbp: 80,
      maxGbp: 80,
      notes: "One-time for this item when booked alone.",
    },
    fullPackage: { display: "£150", amountGbp: 150, notes: "Full package for 1:1 runway coaching (pay in full or instalments)." },
    allowsInstalmentsForFullPackage: true,
    detailSections: [
      section(
        "What this session is for",
        "Whether you are preparing for a show or levelling up your default walk, we work in real time on what reads on the runway: line, pace, and presence.",
      ),
      section(
        "How the pricing works",
        "The one-time item amount covers a single, defined deliverable. The full package is the larger fee for the full coaching block: you can pay it in one go or split it into instalments as agreed at booking (payment gateway coming after Calendly is live).",
      ),
    ],
    heroImageKey: "walk",
    galleryImageKeys: ["runway", "wonderland", "portrait"],
  },
  {
    slug: "beginner-foundations",
    name: "Beginner Model Foundations (Runway Basics)",
    priceSummary: "Item from £120 · Full package from £300",
    tagline: "A calm runway foundation if you are new and want to feel ready sooner.",
    description:
      "For newer models who want the basics down before castings and shoots: fundamentals, confidence, and what the room expects from you.",
    includes: [
      "60 minute runway basics session",
      "How to walk in heels, posture, and clean turns",
      "Facial expression and body awareness",
      "What new models are usually expected to know",
    ],
    oneTimeItem: { display: "£120", minGbp: 120, maxGbp: 120, notes: "One-time for the single foundation item when booked alone." },
    fullPackage: { display: "£300", amountGbp: 300, notes: "Full foundations package. Instalments available for the full package amount." },
    allowsInstalmentsForFullPackage: true,
    detailSections: [
      section(
        "Start clear",
        "We build from solid posture and simple, repeatable patterns so you are not guessing when the room gets quiet.",
      ),
      section("Pricing structure", "Pay the smaller item amount once. For the full programme, the full package price applies, payable in full or in instalments."),
    ],
    heroImageKey: "wonderland",
    galleryImageKeys: ["walk", "runway", "transformation"],
  },
  {
    slug: "advanced-runway",
    name: "Advanced Runway Training",
    priceSummary: "Item from £150 · Full package from £350",
    tagline: "For when you already walk well and want a signature that travels.",
    description:
      "For experienced models who want a stronger signature walk and the flexibility to adapt when the brief changes.",
    includes: [
      "60 minute advanced runway coaching session",
      "Signature walk development and transitions",
      "Pacing control and runway rhythm",
      "Adapting your walk to different brands and styles",
    ],
    oneTimeItem: { display: "£150", minGbp: 150, maxGbp: 150, notes: "One-time for the advanced item when taken alone." },
    fullPackage: { display: "£350", amountGbp: 350, notes: "Full advanced package. Instalments available on the full package amount." },
    allowsInstalmentsForFullPackage: true,
    detailSections: [
      section(
        "Refine, then own it",
        "We push past generic confidence into a walk that is memorable for the right reasons, with flexibility when the art direction changes.",
      ),
    ],
    heroImageKey: "grazia",
    galleryImageKeys: ["wonderland", "walk", "runway"],
  },
  {
    slug: "walk-analysis",
    name: "Walk Analysis and Feedback",
    priceSummary: "£20 to £60 (item) · £150 all services together",
    tagline: "Send a clip. Get a clear read on what to fix first.",
    description:
      "Upload a runway or practice clip and get a tight review of what is working, what is not, and what to drill next.",
    includes: [
      "10 to 15 minute pre-recorded review",
      "Detailed video feedback",
      "Voice note or written feedback",
      "Specific corrections to take into practice",
    ],
    oneTimeItem: {
      display: "£20 to £60",
      minGbp: 20,
      maxGbp: 60,
      singleServiceCapGbp: 60,
      notes: "The one-time item is £20 to £60. It is only £60 when you want this as your only service.",
    },
    fullPackage: {
      display: "£150 (all services together)",
      amountGbp: 150,
      notes: "The larger full-package style fee when you want everything in one bundle. The smaller one-time item amount is separate and is paid once.",
    },
    allowsInstalmentsForFullPackage: true,
    walkAnalysisNotes: {
      singleService: "£60 is when you book walk analysis and feedback as your only service. You pay the smaller one-time item once (between £20 and £60, capped at £60 for analysis-only).",
      bundle: "If you want everything all together, the full bundle is £150 (larger full-package style fee: pay in full or by instalment once that option is live).",
    },
    detailSections: [
      section(
        "What you get",
        "A structured review of your clip with priorities: what to fix first, and what to rehearse so the next take is cleaner.",
      ),
      section("How the £20 to £60 item works", "The entry is from £20. The cap is £60 when walk analysis and feedback is the only service you are booking."),
      section("The £150 bundle", "If you are booking everything together, the all-in bundle is £150. Payment gateway splits for full or instalment pay will follow the Calendly go-live."),
    ],
    heroImageKey: "transformation",
    galleryImageKeys: ["walk", "portrait", "home"],
  },
  {
    slug: "casting-prep",
    name: "Casting Preparation Coaching",
    priceSummary: "Item from £60 · Full package from £120",
    tagline: "Walk in clear-headed and leave them with a strong impression.",
    description:
      "Targeted prep so you can present yourself cleanly and confidently, in line with what agencies and clients scan for.",
    includes: [
      "45 minute casting preparation session",
      "How to enter and exit professionally",
      "What agencies and clients look for",
      "Body language and first impression coaching",
    ],
    oneTimeItem: { display: "£60", minGbp: 60, maxGbp: 60, notes: "One-time for the single casting-prep item." },
    fullPackage: { display: "£120", amountGbp: 120, notes: "Full casting package. Instalments on the full amount if you choose the full package." },
    allowsInstalmentsForFullPackage: true,
    detailSections: [section("Casting with intention", "We work on the first look, the walk-in, and how to leave the room on a high note without overplaying.")],
    heroImageKey: "home",
    galleryImageKeys: ["wonderland", "runway", "portrait"],
  },
  {
    slug: "confidence-presence",
    name: "Confidence and Presence Training",
    priceSummary: "Item from £60 · Full package from £120",
    tagline: "Mindset and body language when stiffness or nerves get in the way.",
    description:
      "Mindset and presence work for models who want to feel more natural on the runway and less stuck in their head.",
    includes: [
      "45 minute confidence coaching session",
      "Body language and stage presence training",
      "Ways to ease nerves and physical stiffness",
      "Confidence drills you can repeat on your own",
    ],
    oneTimeItem: { display: "£60", minGbp: 60, maxGbp: 60, notes: "One-time for a single session item." },
    fullPackage: { display: "£120", amountGbp: 120, notes: "Full package for deeper presence work. Instalments available for the full package price." },
    allowsInstalmentsForFullPackage: true,
    detailSections: [section("Presence, not performance anxiety", "We use small, repeatable tools so the body can stay available under pressure.")],
    heroImageKey: "portrait",
    galleryImageKeys: ["transformation", "walk", "wonderland"],
  },
  {
    slug: "monthly-mentorship",
    name: "Monthly Mentorship Programme",
    priceSummary: "Item from £250 / month · Full from £700 / month",
    tagline: "Steady support when you are serious about compounding progress.",
    description:
      "An ongoing partnership for runway, confidence, content direction, and career moves, with room to adjust as you grow.",
    includes: [
      "Weekly 45 to 60 minute coaching calls",
      "Regular progress tracking and check-ins",
      "Ongoing feedback and strategic direction",
      "Priority support between sessions",
    ],
    oneTimeItem: { display: "From £250 / month", minGbp: 250, maxGbp: 250, notes: "Lower tier item access for a single month block (one-time per period)." },
    fullPackage: { display: "Up to £700 / month", amountGbp: 250, maxAmountGbp: 700, period: "month", notes: "Full programme tiers up to £700 / month. Pay the full month or agreed instalments on the full package side." },
    allowsInstalmentsForFullPackage: true,
    detailSections: [
      section("Long-game coaching", "We set direction for the month, then adjust with what real castings, bookings, and confidence data tell us."),
    ],
    heroImageKey: "runway",
    galleryImageKeys: ["home", "wonderland", "resources"],
  },
];

export function getPackageBySlug(slug: string): Package | undefined {
  return PACKAGES.find((p) => p.slug === slug);
}

export function getAllPackageSlugs(): string[] {
  return PACKAGES.map((p) => p.slug);
}

/* -------------------------------------------------------------------------- */
/* Legacy `Service` shape (listing / backward compat)                         */
/* -------------------------------------------------------------------------- */

export type Service = {
  slug: string;
  name: string;
  priceRange: string;
  tagline: string;
  description: string;
  includes: string[];
};

export const SERVICES: Service[] = PACKAGES.map((p) => ({
  slug: p.slug,
  name: p.name,
  priceRange: p.priceSummary,
  tagline: p.tagline,
  description: p.description,
  includes: p.includes,
}));

export const CALENDLY_URL_30_MIN = "https://calendly.com/runwayrefinedofficial/30min";
export const CALENDLY_URL_45_MIN =
  "https://calendly.com/runwayrefinedofficial/45-minute-meeting";
export const CALENDLY_URL_60_MIN =
  "https://calendly.com/runwayrefinedofficial/60-minute-meeting";

/** Backwards-compatible default; package-specific links should use `getCalendlyForPackage`. */
export const CALENDLY_URL = CALENDLY_URL_30_MIN;

export function getCalendlyForPackage(slug: string): {
  url: string;
  label: string;
} {
  switch (slug) {
    case "walk-analysis":
      return { url: CALENDLY_URL_30_MIN, label: "30-minute meeting" };
    case "casting-prep":
    case "confidence-presence":
      return { url: CALENDLY_URL_45_MIN, label: "45-minute meeting" };
    case "runway-1to1":
    case "beginner-foundations":
    case "advanced-runway":
    case "monthly-mentorship":
    default:
      return { url: CALENDLY_URL_60_MIN, label: "60-minute meeting" };
  }
}

/** Snapshot of pricing for the booking intent API (mirrors `PACKAGES` numerics). */
export function getPackageSnapshotForApi(slug: string): {
  slug: string;
  oneTimeItemDisplay: string;
  fullPackageDisplay: string;
  oneTimeMinGbp: number | null;
  oneTimeMaxGbp: number | null;
  fullPackageAmountGbp: number;
  allowsInstalments: boolean;
} | null {
  const p = getPackageBySlug(slug);
  if (!p) return null;
  return {
    slug: p.slug,
    oneTimeItemDisplay: p.oneTimeItem.display,
    fullPackageDisplay: p.fullPackage.display,
    oneTimeMinGbp: p.oneTimeItem.minGbp ?? null,
    oneTimeMaxGbp: p.oneTimeItem.maxGbp ?? p.oneTimeItem.singleServiceCapGbp ?? null,
    fullPackageAmountGbp: p.fullPackage.maxAmountGbp ?? p.fullPackage.amountGbp,
    allowsInstalments: p.allowsInstalmentsForFullPackage,
  };
}
