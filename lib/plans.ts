export type LinkCardPlan =
  | "free"
  | "digital"
  | "digital_plus"
  | "nfc";

export type PlanFeatures = {
  publicProfile: boolean;
  qrCode: boolean;
  socialLinks: boolean;
  saveContact: boolean;
  booking: boolean;
  expertise: boolean;
  journey: boolean;
  customAppearance: boolean;
  nfcCard: boolean;
};
export type PlanLimits = {
  socialLinks: number;
};

export const PLAN_FEATURES: Record<LinkCardPlan, PlanFeatures> = {
  free: {
    publicProfile: true,
    qrCode: true,
    socialLinks: true,
    saveContact: true,
    booking: false,
    expertise: false,
    journey: false,
    customAppearance: false,
    nfcCard: false,
  },

  digital: {
  publicProfile: true,
  qrCode: true,
  socialLinks: true,
  saveContact: true,
  booking: false,
  expertise: false,
  journey: false,
  customAppearance: false,
  nfcCard: false,
},

  digital_plus: {
  publicProfile: true,
  qrCode: true,
  socialLinks: true,
  saveContact: true,
  booking: true,
  expertise: true,
  journey: true,
  customAppearance: true,
  nfcCard: false,
},

  nfc: {
  publicProfile: true,
  qrCode: true,
  socialLinks: true,
  saveContact: true,
  booking: true,
  expertise: true,
  journey: true,
  customAppearance: true,
  nfcCard: true,
},
};

export function hasFeature(
  plan: string | null | undefined,
  feature: keyof PlanFeatures
) {
  const safePlan: LinkCardPlan =
    plan === "digital_plus" ||
    plan === "nfc" ||
    plan === "digital"
      ? plan
      : "free";

  return PLAN_FEATURES[safePlan][feature];
}
export const PLAN_LIMITS: Record<LinkCardPlan, PlanLimits> = {
  free: {
    socialLinks: 2,
  },

  digital: {
    socialLinks: 2,
  },

  digital_plus: {
    socialLinks: 10,
  },

  nfc: {
    socialLinks: 10,
  },
};

export function getPlanLimits(
  plan: string | null | undefined
): PlanLimits {
  const safePlan: LinkCardPlan =
    plan === "digital_plus" ||
    plan === "nfc" ||
    plan === "digital"
      ? plan
      : "free";

  return PLAN_LIMITS[safePlan];
}
