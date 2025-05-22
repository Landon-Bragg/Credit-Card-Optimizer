// ============================================================================
//  Credit‑card sample data — condensed loyalty lists by issuer + direct links
//  (Default point values remain in *cents* per point; 1 ¢ = $0.01.)
//  Updated May 2025: includes starter/no‑credit cards, refined point‑values,
//  simplified Bilt calculation (no Rent‑Day boost), and accurate rotating‑cat
//  structures.
// ============================================================================

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
  issuer: Issuer;
  image: string; // /public/... (Next.js will resolve)
  url: string; // direct link to the issuer’s card page
  annualFee: number;
  defaultPointValue: number; // ¢ per point (cash = 1)
  rewardStructure: RewardStructure;
  loyaltyPrograms: string[];
  signupBonus?: {
    amount: number;
    spendRequirement: number;
    months: number;
  };
  benefits: {
    description: string;
    value: number; // $ estimate
    recurring: "one-time" | "annual" | "monthly";
  }[];
  creditScore: [number, number];
  noCreditOK?: boolean; // present if score is optional
  type: "cash" | "points";
  disclaimer?: string;
}

// ---------------------------------------------------------------------------
//  Issuer‑level loyalty partner table (de‑duplicates every card entry)
// ---------------------------------------------------------------------------

type Issuer =
  | "Chase"
  | "Bilt"
  | "Citi"
  | "Amex"
  | "Capital One"
  | "Wells Fargo"
  | "Discover"
  | "Bank of America"
  | "Petal";

export const ISSUER_PROGRAMS: Record<Issuer, string[]> = {
  Amex: [
    "Air Canada",
    "KrisFlyer",
    "ANA Mileage Club",
    "Avianca",
    "British Airways",
    "Asia Miles",
    "Qatar Privilege Club",
    "Qantas Frequent Flyer",
    "Flying Blue",
    "Virgin Atlantic Flying Club",
    "Emirates Skywards",
    "Etihad Guest",
    "JetBlue TrueBlue",
    "HawaiianMiles",
    // Hotels
    "Marriott Bonvoy",
    "Hilton Honors",
    "Choice Privileges",
  ],
  Chase: [
    "United",
    "Air Canada",
    "KrisFlyer",
    "British Airways",
    "Flying Blue",
    "Virgin Atlantic Flying Club",
    "Emirates Skywards",
    "JetBlue TrueBlue",
    "Southwest Rapid Rewards",
    // Hotels
    "Marriott Bonvoy",
    "World of Hyatt",
    "IHG One Rewards",
  ],
  "Capital One": [
    "Air Canada",
    "Avianca",
    "KrisFlyer",
    "Flying Blue",
    "TAP Miles&Go",
    "Turkish Miles&Smiles",
    "Asia Miles",
    "Finnair Plus",
    "British Airways",
    "Qantas Frequent Flyer",
    "Emirates Skywards",
    "Etihad Guest",
    "Virgin Red",
    "JetBlue TrueBlue",
    // Hotels
    "Choice Privileges",
    "Wyndham Rewards",
    "Accor Live Limitless",
  ],
  Citi: [
    "Avianca",
    "KrisFlyer",
    "Flying Blue",
    "Miles & Smiles",
    "Asia Miles",
    "Aeromexico Rewards",
    "EVA Infinity MileageLands",
    "Thai Royal Orchid Plus",
    "Qatar Privilege Club",
    "Qantas Frequent Flyer",
    "Virgin Atlantic Flying Club",
    "Etihad Guest",
    "JetBlue TrueBlue",
    // Hotels
    "Choice Privileges",
    "Wyndham Rewards",
    "Accor Live Limitless",
  ],
  Bilt: [
    "United",
    "Air Canada",
    "Avianca",
    "British Airways",
    "Asia Miles",
    "TAP Miles&Go",
    "Turkish Miles&Smiles",
    "Flying Blue",
    "Emirates Skywards",
    "Virgin Atlantic Flying Club",
    "Alaska Mileage Plan",
    "Japan Airlines Mileage Bank",
    "Southwest Rapid Rewards",
    // Hotels
    "Marriott Bonvoy",
    "Hilton Honors",
    "World of Hyatt",
    "IHG One Rewards",
    "Accor Live Limitless",
  ],
  "Wells Fargo": [],
  Discover: [],
  "Bank of America": ["Alaska Mileage Plan"],
  Petal: [],
};

// ---------------------------------------------------------------------------
//  Card catalogue (point values reflect May 2025 TPG valuations)
// ---------------------------------------------------------------------------

export const cards: CreditCard[] = [
  /* ──────────────── BILT ──────────────── */
  {
    id: "bilt",
    name: "Bilt Mastercard®",
    issuer: "Bilt",
    image: "/cards/bilt.png",
    url: "https://www.biltrewards.com/mastercard",
    annualFee: 0,
    defaultPointValue: 2.05, // ¢
    type: "points",
    rewardStructure: {
      type: "special",
      description: "1× rent, 3× dining, 2× travel; 6×/4×/2× on Rent Day (1st) — *boost not included in calc*",
      calc: (sp) =>
        sp.rent * 1 +
        sp.dining * 3 +
        sp.travel * 2 +
        (sp.drugstores + sp.groceries + sp.gas + sp.online + sp.other) * 1,
    },
    loyaltyPrograms: ISSUER_PROGRAMS.Bilt,
    benefits: [],
    creditScore: [670, 850],
  },

  /* ──────────────── CHASE FLEXIBLE ──────────────── */
  {
    id: "freedom_unlimited",
    name: "Chase Freedom Unlimited®",
    issuer: "Chase",
    image: "/cards/freedom_unlimited.png",
    url: "https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited",
    annualFee: 0,
    defaultPointValue: 2.05,
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
    loyaltyPrograms: ISSUER_PROGRAMS.Chase,
    signupBonus: { amount: 20000, spendRequirement: 500, months: 3 },
    benefits: [],
    creditScore: [670, 850],
  },
  {
    id: "freedom_flex",
    name: "Chase Freedom Flex®",
    issuer: "Chase",
    image: "/cards/freedom_flex.png",
    url: "https://creditcards.chase.com/cash-back-credit-cards/freedom/flex",
    annualFee: 0,
    defaultPointValue: 2.05,
    type: "points",
    rewardStructure: {
      type: "rotating",
      quarterly: {
        groceries: 5,
        gas: 5,
        online: 5,
        dining: 5,
        travel: 5,
        other: 5,
      },
      cap: 1500, // per calendar quarter
    },
    loyaltyPrograms: ISSUER_PROGRAMS.Chase,
    signupBonus: { amount: 20000, spendRequirement: 500, months: 3 },
    benefits: [],
    creditScore: [670, 850],
    disclaimer: "5% categories rotate quarterly; $1,500 combined quarterly cap.",
  },
  {
    id: "csp",
    name: "Chase Sapphire Preferred®",
    issuer: "Chase",
    image: "/cards/csp.png",
    url: "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred",
    annualFee: 95,
    defaultPointValue: 2.05,
    type: "points",
    rewardStructure: {
      type: "category",
      categories: { travel: 2, dining: 3, other: 1 },
    },
    loyaltyPrograms: ISSUER_PROGRAMS.Chase,
    signupBonus: { amount: 60000, spendRequirement: 4000, months: 3 },
    benefits: [
      { description: "$50 Annual Hotel Credit", value: 50, recurring: "annual" },
    ],
    creditScore: [690, 850],
  },
  {
    id: "csr",
    name: "Chase Sapphire Reserve®",
    issuer: "Chase",
    image: "/cards/csr.png",
    url: "https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve",
    annualFee: 550,
    defaultPointValue: 2.05,
    type: "points",
    rewardStructure: {
      type: "category",
      categories: { travel: 3, dining: 3, other: 1 },
    },
    loyaltyPrograms: ISSUER_PROGRAMS.Chase,
    signupBonus: { amount: 60000, spendRequirement: 4000, months: 3 },
    benefits: [
      { description: "$300 Annual Travel Credit", value: 300, recurring: "annual" },
      { description: "Priority Pass Select", value: 150, recurring: "annual" },
      { description: "Global Entry / TSA Pre✓® Credit", value: 100, recurring: "one-time" },
    ],
    creditScore: [720, 850],
  },

  /* ──────────────── CITI FLEXIBLE ──────────────── */
  {
    id: "citi_custom_cash",
    name: "Citi Custom Cash®",
    issuer: "Citi",
    image: "/cards/citi_custom_cash.png",
    url: "https://www.citi.com/credit-cards/citi-custom-cash-credit-card",
    annualFee: 0,
    defaultPointValue: 1.8,
    type: "points",
    rewardStructure: { type: "dynamic", topCategories: 1 },
    loyaltyPrograms: ISSUER_PROGRAMS.Citi,
    benefits: [],
    creditScore: [670, 850],
    disclaimer: "5% on top eligible category up to $500 spend/mo; 1% thereafter.",
  },
  {
    id: "citi_premier",
    name: "Citi Premier®",
    issuer: "Citi",
    image: "/cards/citi_premier.png",
    url: "https://www.citi.com/credit-cards/citi-premier-credit-card",
    annualFee: 95,
    defaultPointValue: 1.8,
    type: "points",
    rewardStructure: {
      type: "category",
      categories: { travel: 3, dining: 3, groceries: 3, gas: 3, other: 1 },
    },
    loyaltyPrograms: ISSUER_PROGRAMS.Citi,
    signupBonus: { amount: 60000, spendRequirement: 4000, months: 3 },
    benefits: [
      { description: "$100 Hotel Savings Credit", value: 100, recurring: "annual" },
    ],
    creditScore: [700, 850],
  },

  /* ──────────────── AMERICAN EXPRESS ──────────────── */
  {
    id: "amex_platinum",
    name: "American Express® Platinum",
    issuer: "Amex",
    image: "/cards/amex_platinum.png",
    url: "https://www.americanexpress.com/us/credit-cards/card/platinum/",
    annualFee: 695,
    defaultPointValue: 2.0,
    type: "points",
    rewardStructure: {
      type: "category",
      categories: { travel: 5, dining: 1, other: 1 },
    },
    loyaltyPrograms: ISSUER_PROGRAMS.Amex,
    signupBonus: { amount: 80000, spendRequirement: 6000, months: 6 },
    benefits: [
      { description: "$200 Airline Incidentals Credit", value: 200, recurring: "annual" },
      { description: "$200 Uber Cash", value: 200, recurring: "annual" },
      { description: "$240 Digital Entertainment Credit", value: 240, recurring: "annual" },
      { description: "Global Lounge Collection", value: 300, recurring: "annual" },
    ],
    creditScore: [720, 850],
  },
  {
    id: "amex_gold",
    name: "American Express® Gold",
    issuer: "Amex",
    image: "/cards/amex_gold.png",
    url: "https://www.americanexpress.com/us/credit-cards/card/gold/",
    annualFee: 250,
    defaultPointValue: 2.0,
    type: "points",
    rewardStructure: {
      type: "category",
      categories: { dining: 4, groceries: 4, travel: 3, other: 1 },
    },
    loyaltyPrograms: ISSUER_PROGRAMS.Amex,
    signupBonus: { amount: 60000, spendRequirement: 4000, months: 6 },
    benefits: [
      { description: "$120 Dining Credit", value: 120, recurring: "annual" },
      { description: "$120 Uber Cash", value: 120, recurring: "annual" },
    ],
    creditScore: [700, 850],
  },
  {
    id: "blue_business_plus",
    name: "Blue Business® Plus",
    issuer: "Amex",
    image: "/cards/amex_bbplus.png",
    url: "https://www.americanexpress.com/us/credit-cards/card/bluebusinessplus/",
    annualFee: 0,
    defaultPointValue: 2.0,
    type: "points",
    rewardStructure: { type: "fixed", rate: 2 },
    loyaltyPrograms: ISSUER_PROGRAMS.Amex,
    benefits: [],
    creditScore: [670, 850],
    disclaimer: "2× on all purchases up to $50k per calendar year.",
  },

  /* ──────────────── CAPITAL ONE ──────────────── */
  {
    id: "venture_x",
    name: "Capital One Venture X®",
    issuer: "Capital One",
    image: "/cards/venture_x.png",
    url: "https://www.capitalone.com/credit-cards/venture-x/",
    annualFee: 395,
    defaultPointValue: 1.85,
    type: "points",
    rewardStructure: {
      type: "category",
      categories: { travel: 10, dining: 2, other: 2 },
    },
    loyaltyPrograms: ISSUER_PROGRAMS["Capital One"],
    signupBonus: { amount: 75000, spendRequirement: 4000, months: 3 },
    benefits: [
      { description: "$300 Annual Travel Credit", value: 300, recurring: "annual" },
      { description: "10,000‑mile Anniversary Bonus", value: 185, recurring: "annual" },
      { description: "Priority Pass & Capital One Lounge", value: 150, recurring: "annual" },
    ],
    creditScore: [720, 850],
  },

  /* ──────────────── SIMPLE CASHBACK ──────────────── */
  {
    id: "wf_active_cash",
    name: "Wells Fargo Active Cash®",
    issuer: "Wells Fargo",
    image: "/cards/active_cash.png",
    url: "https://www.wellsfargo.com/credit-cards/active-cash/",
    annualFee: 0,
    defaultPointValue: 1,
    type: "cash",
    rewardStructure: { type: "fixed", rate: 2 },
    loyaltyPrograms: ISSUER_PROGRAMS["Wells Fargo"],
    benefits: [],
    creditScore: [660, 850],
  },
  {
    id: "discover_it",
    name: "Discover it® Cashback",
    issuer: "Discover",
    image: "/cards/discover_it.png",
    url: "https://www.discover.com/credit-cards/cash-back/it-card.html",
    annualFee: 0,
    defaultPointValue: 1,
    type: "cash",
    rewardStructure: {
      type: "rotating",
      quarterly: { groceries: 5, gas: 5, online: 5, dining: 5 },
      cap: 1500,
    },
    loyaltyPrograms: ISSUER_PROGRAMS.Discover,
    benefits: [
      { description: "Cashback Match (year 1)", value: 200, recurring: "one-time" },
    ],
    creditScore: [680, 850],
  },
  {
    id: "citi_double_cash",
    name: "Citi® Double Cash",
    issuer: "Citi",
    image: "/cards/citi_double_cash.png",
    url: "https://www.citi.com/credit-cards/citi-double-cash-credit-card",
    annualFee: 0,
    defaultPointValue: 1,
    type: "cash",
    rewardStructure: { type: "fixed", rate: 2 },
    loyaltyPrograms: ISSUER_PROGRAMS.Citi,
    benefits: [],
    creditScore: [670, 850],
  },
  {
    id: "capital_one_savor",
    name: "Capital One Savor®",
    issuer: "Capital One",
    image: "/cards/savor.png",
    url: "https://www.capitalone.com/credit-cards/savor/",
    annualFee: 95,
    defaultPointValue: 1,
    type: "cash",
    rewardStructure: {
      type: "category",
      categories: { dining: 4, entertainment: 4, groceries: 3, other: 1 },
    },
    loyaltyPrograms: [],
    benefits: [],
    creditScore: [700, 850],
  },

  /* ──────────────── COBRANDED AIRLINE ──────────────── */
  {
    id: "alaska_visa",
    name: "Alaska Airlines Visa Signature®",
    issuer: "Bank of America",
    image: "/cards/alaska_visa.png",
    url: "https://www.bankofamerica.com/credit-cards/products/alaska-airlines-credit-card/",
    annualFee: 95,
    defaultPointValue: 1.3,
    type: "points",
    rewardStructure: {
      type: "category",
      categories: { travel: 3, dining: 2, groceries: 2, other: 1 },
    },
    loyaltyPrograms: ["Alaska Mileage Plan"],
    signupBonus: { amount: 70000, spendRequirement: 3000, months: 3 },
    benefits: [
      { description: "Companion Fare ($99 + tax)", value: 200, recurring: "annual" },
      { description: "Free Checked Bag", value: 60, recurring: "annual" },
    ],
    creditScore: [690, 850],
  },
  {
    id: "delta_gold",
    name: "Delta SkyMiles® Gold Amex",
    issuer: "Amex",
    image: "/cards/delta_gold.png",
    url: "https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-gold-american-express-card/",
    annualFee: 0, // intro year; $150 thereafter
    defaultPointValue: 1.3,
    type: "points",
    rewardStructure: {
      type: "category",
      categories: { travel: 2, dining: 2, groceries: 2, other: 1 },
    },
    loyaltyPrograms: ["Delta SkyMiles"],
    signupBonus: { amount: 65000, spendRequirement: 2000, months: 3 },
    benefits: [
      { description: "First Checked Bag Free", value: 60, recurring: "annual" },
      { description: "$100 Delta Flight Credit after $10k spend", value: 100, recurring: "annual" },
    ],
    creditScore: [670, 850],
  },
  {
    id: "delta_platinum",
    name: "Delta SkyMiles® Platinum Amex",
    issuer: "Amex",
    image: "/cards/delta_platinum.png",
    url: "https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-platinum-american-express-card/",
    annualFee: 350,
    defaultPointValue: 1.3,
    type: "points",
    rewardStructure: {
      type: "category",
      categories: { travel: 3, dining: 2, groceries: 2, other: 1 },
    },
    loyaltyPrograms: ["Delta SkyMiles"],
    signupBonus: { amount: 85000, spendRequirement: 4000, months: 3 },
    benefits: [
      { description: "Annual Companion Certificate", value: 250, recurring: "annual" },
      { description: "Global Entry/TSA Pre✓® Credit", value: 100, recurring: "one-time" },
    ],
    creditScore: [700, 850],
  },
  {
    id: "united_explorer",
    name: "United Explorer Card",
    issuer: "Chase",
    image: "/cards/united_explorer.png",
    url: "https://www.chase.com/personal/credit-cards/united/explorer",
    annualFee: 0, // intro year; then $95
    defaultPointValue: 1.3,
    type: "points",
    rewardStructure: {
      type: "category",
      categories: { travel: 2, dining: 2, hotels: 2, other: 1 },
    },
    loyaltyPrograms: ["United"],
    signupBonus: { amount: 60000, spendRequirement: 3000, months: 3 },
    benefits: [
      { description: "First Checked Bag Free (2 rt)", value: 60, recurring: "annual" },
    ],
    creditScore: [670, 850],
  },

  /* ──────────────── STARTER / NO‑CREDIT ──────────────── */
  {
    id: "cap1_platinum_secured",
    name: "Capital One Platinum Secured",
    issuer: "Capital One",
    image: "/cards/cap1_platinum_secured.png",
    url: "https://www.capitalone.com/credit-cards/platinum-secured/",
    annualFee: 0,
    defaultPointValue: 1,
    type: "cash",
    rewardStructure: { type: "fixed", rate: 1 },
    loyaltyPrograms: [],
    benefits: [],
    creditScore: [0, 600],
    noCreditOK: true,
  },
  {
    id: "discover_it_student",
    name: "Discover it® Student CashBack",
    issuer: "Discover",
    image: "/cards/discover_it_student.png",
    url: "https://www.discover.com/student-credit-cards/cashback/",
    annualFee: 0,
    defaultPointValue: 1,
    type: "cash",
    rewardStructure: {
      type: "rotating",
      quarterly: {
        groceries: 5,
        gas: 5,
        online: 5,
        dining: 5,
        travel: 5,
        other: 5,
      },
      cap: 1500,
    },
    loyaltyPrograms: [],
    benefits: [],
    creditScore: [0, 650],
    noCreditOK: true,
  },
  {
    id: "petal2",
    name: "Petal® 2 “Cash Back, No Fees” Visa",
    issuer: "Petal",
    image: "/cards/petal2.png",
    url: "https://www.petalcard.com/card/petal-2",
    annualFee: 0,
    defaultPointValue: 1,
    type: "cash",
    rewardStructure: { type: "fixed", rate: 1.5 },
    loyaltyPrograms: [],
    benefits: [],
    creditScore: [0, 700],
    noCreditOK: true,
  },
];
