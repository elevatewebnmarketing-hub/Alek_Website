export type PaymentScope =
  | "one_time_item"
  | "full_package_full"
  | "full_package_instalments";

type PricingMap = {
  oneTimeItemGbp: number;
  fullPackageGbp: number;
  allowsInstalments: boolean;
};

const PRICING_BY_PACKAGE: Record<string, PricingMap> = {
  "runway-1to1": { oneTimeItemGbp: 80, fullPackageGbp: 150, allowsInstalments: true },
  "beginner-foundations": { oneTimeItemGbp: 120, fullPackageGbp: 300, allowsInstalments: true },
  "advanced-runway": { oneTimeItemGbp: 150, fullPackageGbp: 350, allowsInstalments: true },
  "walk-analysis": { oneTimeItemGbp: 60, fullPackageGbp: 150, allowsInstalments: true },
  "casting-prep": { oneTimeItemGbp: 60, fullPackageGbp: 120, allowsInstalments: true },
  "confidence-presence": { oneTimeItemGbp: 60, fullPackageGbp: 120, allowsInstalments: true },
  "monthly-mentorship": { oneTimeItemGbp: 250, fullPackageGbp: 700, allowsInstalments: true },
};

export function hasPackagePricing(packageSlug: string): boolean {
  return packageSlug in PRICING_BY_PACKAGE;
}

export function checkoutAmountForScope(
  packageSlug: string,
  paymentScope: PaymentScope,
): {
  amountGbp: number;
  fullPackageGbp: number;
  instalmentDueNowGbp: number;
  instalmentRemainingGbp: number;
} | null {
  const pricing = PRICING_BY_PACKAGE[packageSlug];
  if (!pricing) return null;

  const instalmentDueNowGbp = Math.ceil(pricing.fullPackageGbp / 2);
  const instalmentRemainingGbp = pricing.fullPackageGbp - instalmentDueNowGbp;

  if (paymentScope === "one_time_item") {
    return {
      amountGbp: pricing.oneTimeItemGbp,
      fullPackageGbp: pricing.fullPackageGbp,
      instalmentDueNowGbp,
      instalmentRemainingGbp,
    };
  }

  if (paymentScope === "full_package_full") {
    return {
      amountGbp: pricing.fullPackageGbp,
      fullPackageGbp: pricing.fullPackageGbp,
      instalmentDueNowGbp,
      instalmentRemainingGbp,
    };
  }

  if (!pricing.allowsInstalments) return null;

  return {
    amountGbp: instalmentDueNowGbp,
    fullPackageGbp: pricing.fullPackageGbp,
    instalmentDueNowGbp,
    instalmentRemainingGbp,
  };
}
