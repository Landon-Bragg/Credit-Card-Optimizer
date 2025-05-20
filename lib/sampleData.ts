// NOTE: Default point values are in *cents* per point.
export type RewardStructure =
  | { type: "fixed"; rate: number }
  | { type: "category"; categories: Record<string, number> }
  | { type: "rotating"; quarterly: Record<string, number>; cap: number }
  | { type: "dynamic"; topCategories: number }
  | {
      type: "special";
      description: string;
      calc: (spend: Record<string, number>) => number;
    };

export interface CreditCard {
  id: string;
  name: string;
  issuer: string;
  image: string;
  annualFee: number;
  defaultPointValue: number; // ¢ / point or 1 for cashback
  rewardStructure: RewardStructure;
  loyaltyPrograms: string[];
  signupBonus?: {
    amount: number;
    spendRequirement: number;
    months: number;
  };
  benefits: {
    description: string;
    value: number;
    recurring: "one-time" | "annual" | "monthly";
  }[];
  creditScore: [number, number];
  type: "cash" | "points";
}

export const cards: CreditCard[] = [
  /* ---------- POINTS / TRANSFERABLE ---------- */
  {
    id: "bilt",
    name: "Bilt Mastercard®",
    issuer: "Bilt",
    image: "/cards/bilt.png",
    annualFee: 0,
    defaultPointValue: 1.8,
    type: "points",
    rewardStructure: {
      type: "special",
      description:
        "1× rent, 3× dining, 2× travel; 6×/4×/2× on rent day (1st)",
      calc: (sp) => {
        const rentDay = new Date().getDate() === 1;
        return (
          sp.rent * 1 +
          sp.dining * (rentDay ? 4 : 3) +
          sp.travel * (rentDay ? 6 : 2) +
          sp.drugstores * 1 +
          sp.groceries * 1 +
          sp.gas * 1 +
          sp.online * 1 +
          sp.other * 1
        );
      },
    },
    loyaltyPrograms: [
      "MileagePlus",
      "AAdvantage",
      "World of Hyatt",
      "IHG One Rewards",
      "Flying Blue",
      "Emirates Skywards",
      "Aeroplan",
    ],
    benefits: [],
    creditScore: [670, 850],
  },
  {
    id: "freedom_unlimited",
    name: "Chase Freedom Unlimited®",
    issuer: "Chase",
    image: "/cards/freedom_unlimited.png",
    annualFee: 0,
    defaultPointValue: 1.25, // UR average with CSR/CSP
    type: "points",
    rewardStructure: {
      type: "category",
      categories: {
        travel: 5,
        dining: 3,
        drugstores: 3,
        groceries: 1.5,
        gas: 1.5,
        online: 1.5,
        rent: 1.5,
        other: 1.5,
      },
    },
    loyaltyPrograms: [
      "MileagePlus",
      "Aeroplan",
      "KrisFlyer",
      "LifeMiles",
      "Executive Club",
      "Flying Blue",
      "Emirates Skywards",
      "World of Hyatt",
      "Marriott Bonvoy",
      "IHG One Rewards",
    ],
    signupBonus: { amount: 20000, spendRequirement: 500, months: 3 },
    benefits: [],
    creditScore: [670, 850],
  },
  {
    id: "csp",
    name: "Chase Sapphire Preferred®",
    issuer: "Chase",
    image: "/cards/csp.png",
    annualFee: 95,
    defaultPointValue: 1.6,
    type: "points",
    rewardStructure: {
      type: "category",
      categories: { travel: 2, dining: 3, other: 1 },
    },
    loyaltyPrograms: [
      "MileagePlus",
      "Aeroplan",
      "KrisFlyer",
      "LifeMiles",
      "Executive Club",
      "Flying Blue",
      "Emirates Skywards",
      "World of Hyatt",
      "Marriott Bonvoy",
      "IHG One Rewards",
    ],
    signupBonus: { amount: 60000, spendRequirement: 4000, months: 3 },
    benefits: [
      { description: "Annual $50 Hotel Credit", value: 50, recurring: "annual" },
    ],
    creditScore: [690, 850],
  },
  {
    id: "citi_custom_cash",
    name: "Citi Custom Cash®",
    issuer: "Citi",
    image: "/cards/citi_custom_cash.png",
    annualFee: 0,
    defaultPointValue: 1.0,
    type: "points",
    rewardStructure: { type: "dynamic", topCategories: 1 }, // 5× top $500/mo
    loyaltyPrograms: [
      "Flying Blue",
      "Asia Miles",
      "Qantas Frequent Flyer",
      "Aeromexico Rewards",
      "KrisFlyer",
      "Miles & Smiles",
    ],
    benefits: [],
    creditScore: [670, 850],
  },

  /* ---------- CASHBACK ---------- */
  {
    id: "blue_cash_everyday",
    name: "Amex Blue Cash Everyday®",
    issuer: "Amex",
    image: "/cards/amex_bce.png",
    annualFee: 0,
    defaultPointValue: 1, // 1 point = 1 cent
    type: "cash",
    rewardStructure: {
      type: "category",
      categories: {
        groceries: 3,
        gas: 3,
        online: 3,
        travel: 1,
        dining: 1,
        drugstores: 1,
        rent: 1,
        other: 1,
      },
    },
    loyaltyPrograms: [],
    benefits: [],
    creditScore: [670, 850],
  },
  {
    id: "blue_cash_preferred",
    name: "Amex Blue Cash Preferred®",
    issuer: "Amex",
    image: "/cards/amex_bcp.png",
    annualFee: 95,
    defaultPointValue: 1,
    type: "cash",
    rewardStructure: {
      type: "category",
      categories: {
        groceries: 6,
        gas: 3,
        online: 6, // streaming etc but simplified
        travel: 1,
        dining: 1,
        drugstores: 1,
        rent: 1,
        other: 1,
      },
    },
    loyaltyPrograms: [],
    benefits: [
      { description: "$84 Disney Bundle Credit", value: 84, recurring: "annual" },
    ],
    creditScore: [670, 850],
  },
  {
    id: "wf_active_cash",
    name: "Wells Fargo Active Cash®",
    issuer: "Wells Fargo",
    image: "/cards/active_cash.png",
    annualFee: 0,
    defaultPointValue: 1,
    type: "cash",
    rewardStructure: { type: "fixed", rate: 2 }, // 2% on everything
    loyaltyPrograms: [],
    benefits: [],
    creditScore: [660, 850],
  },
  {
    id: "discover_it",
    name: "Discover it® Cashback",
    issuer: "Discover",
    image: "/cards/discover_it.png",
    annualFee: 0,
    defaultPointValue: 1,
    type: "cash",
    rewardStructure: {
      type: "rotating",
      quarterly: { groceries: 5, gas: 5, online: 5, dining: 5 },
      cap: 1500,
    },
    loyaltyPrograms: [],
    benefits: [
      { description: "Cashback Match (year 1)", value: 200, recurring: "one-time" },
    ],
    disclaimer: "5% categories rotate each quarter and are limited to $1,500 in combined purchases (≈$500/mo). After the intro year, Discover matches year‑one cashback once.",
    creditScore: [680, 850],
  },
  {
    id: "citi_custom_cash",
    // rest unchanged
    disclaimer: "Earn 5% on the top eligible category each billing cycle on up to $500 spend; 1% thereafter.",
  },
];

