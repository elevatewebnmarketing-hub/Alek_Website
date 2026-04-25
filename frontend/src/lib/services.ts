/**
 * Coaching packages: each has a one-time item amount and a separate full package amount.
 * Walk analysis has special rules (see `walkAnalysisNotes` on that package).
 */

export type PackageSlug =
  | "runway-1to1"
  | "beginner-foundations"
  | "advanced-runway"
  | "walk-analysis"
  | "casting-prep"
  | "confidence-presence"
  | "monthly-mentorship";

export type PaymentScope =
  | "one_time_item"
  | "full_package_full"
  | "full_package_instalments";

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
  slug: PackageSlug;
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
  /** What clients leave with (used in package detail hero section). */
  outcomes: string[];
  /** Short audience-fit copy for package page. */
  whoFor: string;
  /** Optional counter-positioning copy. */
  notFor?: string;
  /** Small metadata chips in package hero blocks. */
  keyStats: { duration: string; format: string; cadence?: string };
  /** If set, show extra walk analysis pricing callouts */
  walkAnalysisNotes?: { singleService: string; bundle: string };
};

const section = (title: string, body: string) => ({ title, body });

export const PACKAGES: Package[] = [
  {
    slug: "runway-1to1",
    name: "1:1 Runway Coaching",
    priceSummary: "Item from £80 · Full package from £150",
    tagline: "Private runway coaching to sharpen your line, pacing, and casting-room presence.",
    description:
      "A focused 1:1 session on posture, gait, and how you read from the first step to the final pose. You leave with a concise drill list you can rehearse before your next casting or show.",
    includes: [
      "45–60 minute live video session",
      "Posture and alignment corrections for runway (not generic “stand tall” cues)",
      "Line, pacing, and turn mechanics tailored to your brief",
      "Actionable notes and a between-session rehearsal focus",
    ],
    oneTimeItem: {
      display: "£80",
      minGbp: 80,
      maxGbp: 80,
      notes: "Single-session runway item when booked on its own.",
    },
    fullPackage: {
      display: "£150",
      amountGbp: 150,
      notes: "Full runway coaching block: pay in full or split the full-package amount into instalments (first instalment is half of this fee at checkout).",
    },
    allowsInstalmentsForFullPackage: true,
    detailSections: [
      section(
        "What we work on",
        "Whether you are show-ready or building a stronger default walk, we work in real time on what reads under lights: clean line, controlled pace, decisive turns, and composure from entrance to exit.",
      ),
      section(
        "How pricing maps to the work",
        "The one-time item is a single, clearly scoped runway session. The full package is the larger programme fee for deeper progression; you may pay it in full or in two parts (instalments) against that full-package total.",
      ),
    ],
    outcomes: [
      "Clearer posture and weight transfer so your walk reads clean on camera and in the room.",
      "A prioritised drill list before your next casting, fitting, or runway booking.",
      "A more intentional runway presence—aligned to your look and the brief, not a generic template.",
    ],
    whoFor:
      "Models who want direct correction and faster progress on runway line, timing, and how they land in front of clients and casting directors.",
    notFor:
      "Not the right fit if you only want unstructured chat without rehearsal homework between sessions.",
    keyStats: { duration: "45 to 60 minutes", format: "Live 1:1 video coaching", cadence: "Single or repeat blocks" },
  },
  {
    slug: "beginner-foundations",
    name: "Beginner Model Foundations (Runway Basics)",
    priceSummary: "Item from £120 · Full package from £300",
    tagline: "Editorial-quality foundations so you walk into your first castings with composure.",
    description:
      "Structured runway basics for newer faces: heel control, posture, simple turns, and how to hold your line when the room goes quiet. Built for models who want industry-standard expectations explained clearly.",
    includes: [
      "60-minute runway fundamentals session",
      "Heel height, balance, and safe, repeatable turn patterns",
      "Head carriage, eyeline, and body awareness on the line",
      "What bookers typically expect from new faces at go-and-sees and castings",
    ],
    oneTimeItem: {
      display: "£120",
      minGbp: 120,
      maxGbp: 120,
      notes: "Single foundations session when booked alone.",
    },
    fullPackage: {
      display: "£300",
      amountGbp: 300,
      notes: "Full foundations programme fee: pay in full or instalments against the full-package total.",
    },
    allowsInstalmentsForFullPackage: true,
    detailSections: [
      section(
        "Foundations that travel",
        "We prioritise repeatable shapes—posture, stride length, and clean corners—so you are not improvising when the casting director asks for a simple walk and back.",
      ),
      section(
        "Pricing",
        "The one-time item covers one foundations session. The full package is the larger programme fee; you can settle it in full or split it into instalments (first instalment is half of the full-package fee at checkout).",
      ),
    ],
    outcomes: [
      "Stronger default posture and heel control under casting pressure.",
      "Cleaner corners and transitions so your walk reads polished, not tentative.",
      "A clearer read on what “good” looks like for entry-level runway in UK and international rooms.",
    ],
    whoFor:
      "Newer models who want runway basics taught to industry standard before bigger castings and test shoots.",
    notFor:
      "Not aimed at experienced models who only need signature or designer-specific refinements.",
    keyStats: { duration: "60 minutes", format: "Live runway basics session", cadence: "Foundation track" },
  },
  {
    slug: "advanced-runway",
    name: "Advanced Runway Training",
    priceSummary: "Item from £150 · Full package from £350",
    tagline: "Elevate a strong walk into a memorable signature that adapts to brief and brand.",
    description:
      "For working models who already move well and now need nuance: pacing shifts, designer energy, and how to adjust your line without losing identity when the brief changes mid-season.",
    includes: [
      "60-minute advanced runway session",
      "Signature development: rhythm, stance, and transition detail",
      "Pacing control for short vs long runways and crowded line-ups",
      "Brief interpretation: commercial vs editorial vs couture pacing cues",
    ],
    oneTimeItem: { display: "£150", minGbp: 150, maxGbp: 150, notes: "Single advanced session when booked alone." },
    fullPackage: {
      display: "£350",
      amountGbp: 350,
      notes: "Full advanced programme fee: pay in full or instalments against the full-package total.",
    },
    allowsInstalmentsForFullPackage: true,
    detailSections: [
      section(
        "Refine, then own it",
        "We work past generic confidence into a walk that is distinctive for the right reasons—clean enough for casting tapes, expressive enough for show—and flexible when creative direction shifts.",
      ),
    ],
    outcomes: [
      "A sharper signature line with controlled variation you can dial up or down.",
      "Better runway rhythm across different show formats and music tempos.",
      "Stronger adaptability to brand handwriting while keeping your look coherent.",
    ],
    whoFor:
      "Experienced or fast-progressing models preparing for higher-tier runway, tests, and designer-led castings.",
    notFor:
      "Not suitable if you still need first-time runway fundamentals.",
    keyStats: { duration: "60 minutes", format: "Advanced 1:1 session", cadence: "Performance-oriented blocks" },
  },
  {
    slug: "walk-analysis",
    name: "Walk Analysis and Feedback",
    priceSummary: "£20 to £60 (item) · £150 all services together",
    tagline: "Footage-led feedback: a clear hierarchy of what to correct before your next take.",
    description:
      "Submit runway or practice footage and receive a structured critique—what reads, what breaks the line, and what to rehearse next so your walk tightens for castings, digitals, or show prep.",
    includes: [
      "10–15 minute focused review window",
      "Timestamped notes on line, pacing, posture, and turns",
      "Written and/or voice feedback (as agreed)",
      "Prioritised drills for your next self-tape or live rehearsal",
    ],
    oneTimeItem: {
      display: "£20 to £60",
      minGbp: 20,
      maxGbp: 60,
      singleServiceCapGbp: 60,
      notes: "Analysis-only item from £20; capped at £60 when walk analysis is your sole booking.",
    },
    fullPackage: {
      display: "£150 (all services together)",
      amountGbp: 150,
      notes: "All-in bundle fee when you combine services in one checkout; payable in full or by instalments against this full-package total.",
    },
    allowsInstalmentsForFullPackage: true,
    walkAnalysisNotes: {
      singleService:
        "£60 applies when walk analysis is booked as your only service. Otherwise the one-time item sits between £20 and £60 according to scope.",
      bundle:
        "When you bundle everything together, the all-in fee is £150. You may pay in full or use instalments against that full-package amount.",
    },
    detailSections: [
      section(
        "What you receive",
        "A prioritised read of your clip: what to fix first, what can wait, and how each correction supports a cleaner runway read on the next pass.",
      ),
      section(
        "The £20–£60 analysis item",
        "Pricing scales with depth of review. The cap is £60 when this is the only service you are purchasing.",
      ),
      section(
        "The £150 bundle",
        "If you are combining all services in one engagement, the bundle is £150—payable in full or split into instalments on the full-package side.",
      ),
    ],
    outcomes: [
      "A ranked correction list grounded in your actual footage, not generic runway tips.",
      "Clarity on what to rehearse first for the biggest visible gain.",
      "Targeted drills for your next self-tape, showroom, or live walk-through.",
    ],
    whoFor:
      "Models who want fast, specific runway feedback from real practice or show clips before the next casting cycle.",
    keyStats: { duration: "10 to 15 minute analysis", format: "Recorded feedback + notes", cadence: "On-demand" },
  },
  {
    slug: "casting-prep",
    name: "Casting Preparation Coaching",
    priceSummary: "Item from £60 · Full package from £120",
    tagline: "Casting-floor polish: enter, present, and exit with professional composure.",
    description:
      "Targeted coaching for go-and-sees, agency meetings, and client castings—how you take space, introduce your book, and leave a controlled impression that matches what bookers scan for in the first thirty seconds.",
    includes: [
      "45-minute casting preparation session",
      "Room entry, positioning, and clean exit etiquette",
      "What agencies and clients typically evaluate in first look and walk",
      "Body language, breath, and composure under observation",
    ],
    oneTimeItem: { display: "£60", minGbp: 60, maxGbp: 60, notes: "Single casting-prep session when booked alone." },
    fullPackage: {
      display: "£120",
      amountGbp: 120,
      notes: "Full casting-prep programme fee: pay in full or instalments on the full-package total.",
    },
    allowsInstalmentsForFullPackage: true,
    detailSections: [
      section(
        "Casting with intention",
        "We rehearse the arc of the room: arrival, introduction, walk or movement if requested, and a calm close—so you read confident without tipping into over-performance.",
      ),
    ],
    outcomes: [
      "Stronger first impression from the moment you step into the casting space.",
      "Clearer body language and eyeline under live observation.",
      "Less guesswork about what bookers are clocking in the opening moments.",
    ],
    whoFor:
      "Models preparing for agency castings, client go-and-sees, and brand-facing meetings where polish matters.",
    keyStats: { duration: "45 minutes", format: "Focused coaching session", cadence: "Before key castings" },
  },
  {
    slug: "confidence-presence",
    name: "Confidence and Presence Training",
    priceSummary: "Item from £60 · Full package from £120",
    tagline: "Presence coaching for when nerves, tension, or overthinking block your runway delivery.",
    description:
      "Mindset and somatic tools for models who book well on digitals but tighten on the line. We work breath, weight, and eyeline so your body stays available under lights and in front of a panel.",
    includes: [
      "45-minute presence and confidence session",
      "Body language and spatial awareness on the line",
      "Techniques to ease stiffness and performance anxiety",
      "Repeatable pre-casting drills you can use independently",
    ],
    oneTimeItem: { display: "£60", minGbp: 60, maxGbp: 60, notes: "Single presence session when booked alone." },
    fullPackage: {
      display: "£120",
      amountGbp: 120,
      notes: "Deeper presence programme fee: pay in full or instalments on the full-package total.",
    },
    allowsInstalmentsForFullPackage: true,
    detailSections: [
      section(
        "Presence, not performance anxiety",
        "Small, repeatable tools—breath, weight placement, and gaze—so you can hold a runway brief without locking up or forcing an artificial persona.",
      ),
    ],
    outcomes: [
      "Calmer, more believable body language when you are watched or filmed.",
      "Stage and runway presence that still feels like you—just more available.",
      "A short set of drills you can run before castings, fittings, or show call.",
    ],
    whoFor:
      "Models who know their craft but feel held back by nerves, stiffness, or overthinking on the day.",
    keyStats: { duration: "45 minutes", format: "Mindset and presence training", cadence: "Weekly or fortnightly" },
  },
  {
    slug: "monthly-mentorship",
    name: "Monthly Mentorship Programme",
    priceSummary: "Item from £250 / month · Full from £700 / month",
    tagline: "Ongoing runway, presence, and career strategy for models building month-on-month momentum.",
    description:
      "A retained coaching rhythm for working or fast-rising models: weekly calls, clear priorities between sessions, and adjustments driven by real castings, bookings, and how you are showing up on set and online.",
    includes: [
      "Weekly 45–60 minute coaching calls",
      "Progress tracking against runway, casting, and confidence goals",
      "Ongoing feedback and strategic direction across bookings",
      "Priority support between sessions for time-sensitive briefs",
    ],
    oneTimeItem: {
      display: "From £250 / month",
      minGbp: 250,
      maxGbp: 250,
      notes: "Entry mentorship tier for a single billing period when taken as the item rate.",
    },
    fullPackage: {
      display: "Up to £700 / month",
      amountGbp: 250,
      maxAmountGbp: 700,
      period: "month",
      notes: "Full mentorship tiers up to £700 / month. Pay the month in full or use instalments against the selected full-package monthly fee.",
    },
    allowsInstalmentsForFullPackage: true,
    detailSections: [
      section(
        "Long-game coaching",
        "We set a monthly runway and career focus, then refine it against what your diary actually throws at you—castings, travel, show season, and confidence under pressure.",
      ),
    ],
    outcomes: [
      "Consistent runway and presence direction that compounds across bookings.",
      "Weekly priorities so training time tracks what your calendar demands.",
      "Strategic support between calls when briefs or castings move quickly.",
    ],
    whoFor:
      "Serious models who want sustained runway, casting, and positioning support—not a one-off pep talk.",
    keyStats: { duration: "45 to 60 minutes per call", format: "Weekly mentorship", cadence: "Monthly programme" },
  },
];

export function getPackageBySlug(slug: string): Package | undefined {
  return PACKAGES.find((p) => p.slug === slug);
}

export function getAllPackageSlugs(): PackageSlug[] {
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

export function formatGbp(amount: number): string {
  return `£${amount.toLocaleString("en-GB")}`;
}

export function getFullPackageAmountGbp(p: Package): number {
  return p.fullPackage.maxAmountGbp ?? p.fullPackage.amountGbp;
}

export function getInstalmentBreakdown(p: Package): {
  totalGbp: number;
  dueNowGbp: number;
  remainingGbp: number;
} {
  const totalGbp = getFullPackageAmountGbp(p);
  const dueNowGbp = Math.ceil(totalGbp / 2);
  const remainingGbp = totalGbp - dueNowGbp;
  return { totalGbp, dueNowGbp, remainingGbp };
}

export function getScopePricing(
  p: Package,
  scope: PaymentScope,
): {
  headline: string;
  dueNowLabel: string;
  dueNowGbp: number;
  note: string;
} {
  if (scope === "one_time_item") {
    const dueNowGbp = p.oneTimeItem.maxGbp ?? p.oneTimeItem.singleServiceCapGbp ?? p.oneTimeItem.minGbp ?? 0;
    return {
      headline: "One-time item",
      dueNowLabel: p.oneTimeItem.display,
      dueNowGbp,
      note: p.oneTimeItem.notes ?? "Single service payment.",
    };
  }

  if (scope === "full_package_full") {
    const dueNowGbp = getFullPackageAmountGbp(p);
    return {
      headline: "Full package (pay in full)",
      dueNowLabel: p.fullPackage.display,
      dueNowGbp,
      note: p.fullPackage.notes ?? "One payment for the full package.",
    };
  }

  const instalment = getInstalmentBreakdown(p);
  return {
    headline: "Full package (instalments)",
    dueNowLabel: `${formatGbp(instalment.dueNowGbp)} due now`,
    dueNowGbp: instalment.dueNowGbp,
    note: `${formatGbp(instalment.remainingGbp)} remaining after checkout.`,
  };
}
