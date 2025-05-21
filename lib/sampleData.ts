// ============================================================================
//  Credit‑card sample data — condensed loyalty lists by issuer + direct links
//  (Default point values remain in *cents* per point; 1 ¢ = $0.01.)
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
  image: string;          // /public/... (Next.js will resolve)
  url: string;            // direct link to the issuer’s card page
  annualFee: number;
  defaultPointValue: number; // ¢ / point  | 1 = ¢‑back dollar
  rewardStructure: RewardStructure;
  loyaltyPrograms: string[]; // populated from ISSUER_PROGRAMS below
  signupBonus?: {
    amount: number;          // points / miles / $ (see type)
    spendRequirement: number; // $ required to earn bonus
    months: number;          // time window
  };
  benefits: {
    description: string;
    value: number;           // $ face‑value (estimate)
    recurring: "one-time" | "annual" | "monthly";
  }[];
  creditScore: [number, number]; // recommended range
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
  | "Bank of America";

export const ISSUER_PROGRAMS: Record<Issuer, string[]> = {
  /* American Express Membership Rewards */
  Amex: [
    "Aeroplan",                    // Air Canada
    "KrisFlyer",                   // Singapore Airlines
    "ANA Mileage Club",            // ANA
    "LifeMiles",                   // Avianca
    "Avios",                       // British Airways / Aer Lingus / Iberia bucket
    "Asia Miles",                  // Cathay Pacific
    "Qatar Privilege Club",        // Qatar Airways
    "Qantas Frequent Flyer",       // Qantas
    "Flying Blue",                 // Air France / KLM
    "Virgin Atlantic Flying Club", // Virgin Atlantic
    "Emirates Skywards",           // Emirates
    "Etihad Guest",                // Etihad
    "JetBlue TrueBlue",            // jetBlue
    "HawaiianMiles",               // Hawaiian Airlines
    /* Hotels */
    "Marriott Bonvoy",
    "Hilton Honors",
    "Choice Privileges",
  ],

  /* Chase Ultimate Rewards */
  Chase: [
    "MileagePlus",                 // United
    "Aeroplan",                    // Air Canada
    "KrisFlyer",                   // Singapore Airlines
    "Avios",                       // British Airways / Iberia / Aer Lingus
    "Flying Blue",                 // Air France / KLM
    "Virgin Atlantic Flying Club", // Virgin Atlantic
    "Emirates Skywards",           // Emirates
    "JetBlue TrueBlue",            // jetBlue
    "Southwest Rapid Rewards",     // Southwest
    /* Hotels */
    "Marriott Bonvoy",
    "World of Hyatt",
    "IHG One Rewards",
  ],

  /* Capital One Miles */
  "Capital One": [
    "Aeroplan",
    "LifeMiles",                   // Avianca
    "KrisFlyer",
    "Flying Blue",
    "TAP Miles&Go",                // TAP Air Portugal
    "Turkish Miles&Smiles",        // Turkish Airlines
    "Asia Miles",                  // Cathay Pacific
    "Finnair Plus",
    "Avios",                       // British Airways
    "Qantas Frequent Flyer",
    "Emirates Skywards",
    "Etihad Guest",
    "Virgin Red",                  // Virgin Atlantic group
    "JetBlue TrueBlue",
    /* Hotels */
    "Choice Privileges",
    "Wyndham Rewards",
    "Accor Live Limitless",
  ],

  /* Citi ThankYou® Rewards */
  Citi: [
    "LifeMiles",
    "KrisFlyer",
    "Flying Blue",
    "Miles & Smiles",              // Turkish Airlines
    "Asia Miles",
    "Aeromexico Rewards",
    "EVA Infinity MileageLands",   // EVA Air
    "Thai Royal Orchid Plus",
    "Qatar Privilege Club",
    "Qantas Frequent Flyer",
    "Virgin Atlantic Flying Club",
    "Etihad Guest",
    "JetBlue TrueBlue",
    /* Hotels */
    "Choice Privileges",
    "Wyndham Rewards",
    "Accor Live Limitless",
  ],

  /* Bilt Rewards */
  Bilt: [
    "MileagePlus",
    "Aeroplan",
    "LifeMiles",
    "Avios",                       // BA / Aer Lingus / Iberia
    "Asia Miles",
    "TAP Miles&Go",
    "Turkish Miles&Smiles",
    "Flying Blue",
    "Emirates Skywards",
    "Virgin Atlantic Flying Club",
    /* unique partners */
    "Alaska Mileage Plan",
    "Japan Airlines Mileage Bank",
    "Southwest Rapid Rewards",
    /* Hotels */
    "Marriott Bonvoy",
    "Hilton Honors",
    "World of Hyatt",
    "IHG One Rewards",
    "Accor Live Limitless",
  ],

  /* Issuers with no transfer partners */
  "Wells Fargo": [],
  Discover: [],
  "Bank of America": ["Alaska Mileage Plan"],
};

// ---------------------------------------------------------------------------
//  All card objects — reference the issuer table + include a `url` field
// ---------------------------------------------------------------------------

export const cards: CreditCard[] = [
  /* ────────── BILT ────────── */
  {
    id: "bilt",
    name: "Bilt Mastercard®",
    issuer: "Bilt",
    image: "/cards/bilt.png",
    url: "https://www.biltrewards.com/mastercard",
    annualFee: 0,
    defaultPointValue: 1.8,
    type: "points",
    rewardStructure: {
      type: "special",
      description: "1× rent, 3× dining, 2× travel; 6×/4×/2× on Rent Day (1st)",
      calc: (sp) => {
        const rentDay = new Date().getDate() === 1;
        return (
          sp.rent * 1 +
          sp.dining * (rentDay ? 4 : 3) +
          sp.travel * (rentDay ? 6 : 2) +
          sp.drugstores +
          sp.groceries +
          sp.gas +
          sp.online +
          sp.other
        );
      },
    },
    loyaltyPrograms: ISSUER_PROGRAMS["Bilt"],
    benefits: [],
    creditScore: [670, 850],
  },

  /* ────────── CHASE FLEXIBLE ────────── */
  {
    id: "freedom_unlimited",
    name: "Chase Freedom Unlimited®",
    issuer: "Chase",
    image: "/cards/freedom_unlimited.png",
    url: "https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited",
    annualFee: 0,
    defaultPointValue: 1.25,
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
    loyaltyPrograms: ISSUER_PROGRAMS["Chase"],
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
    defaultPointValue: 1.25,
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
      cap: 1500,
    },
    loyaltyPrograms: ISSUER_PROGRAMS["Chase"],
    signupBonus: { amount: 20000, spendRequirement: 500, months: 3 },
    benefits: [],
    creditScore: [670, 850],
    disclaimer: "5% categories rotate quarterly; $1,500 combined cap.",
  },
  {
    id: "csp",
    name: "Chase Sapphire Preferred®",
    issuer: "Chase",
    image: "/cards/csp.png",
    url: "https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred",
    annualFee: 95,
    defaultPointValue: 1.6,
    type: "points",
    rewardStructure: {
      type: "category",
      categories: { travel: 2, dining: 3, other: 1 },
    },
    loyaltyPrograms: ISSUER_PROGRAMS["Chase"],
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
    defaultPointValue: 1.8,
    type: "points",
    rewardStructure: {
      type: "category",
      categories: { travel: 3, dining: 3, other: 1 },
    },
    loyaltyPrograms: ISSUER_PROGRAMS["Chase"],
    signupBonus: { amount: 60000, spendRequirement: 4000, months: 3 },
    benefits: [
      { description: "$300 Annual Travel Credit", value: 300, recurring: "annual" },
      { description: "Priority Pass Select", value: 150, recurring: "annual" },
      { description: "Global Entry / TSA Pre✓® Credit", value: 100, recurring: "one-time" },
    ],
    creditScore: [720, 850],
  },

  /* ────────── CITI FLEXIBLE ────────── */
  {
    id: "citi_custom_cash",
    name: "Citi Custom Cash®",
    issuer: "Citi",
    image: "/cards/citi_custom_cash.png",
    url: "https://www.citi.com/credit-cards/citi-custom-cash-credit-card",
    annualFee: 0,
    defaultPointValue: 1.0,
    type: "points",
    rewardStructure: { type: "dynamic", topCategories: 1 },
    loyaltyPrograms: ISSUER_PROGRAMS["Citi"],
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
    defaultPointValue: 1.3,
    type: "points",
    rewardStructure: {
      type: "category",
      categories: { travel: 3, dining: 3, groceries: 3, gas: 3, other: 1 },
    },
    loyaltyPrograms: ISSUER_PROGRAMS["Citi"],
    signupBonus: { amount: 60000, spendRequirement: 4000, months: 3 },
    benefits: [
      { description: "$100 Hotel Savings Credit", value: 100, recurring: "annual" },
    ],
    creditScore: [700, 850],
  },

  /* ────────── AMERICAN EXPRESS ────────── */
  {
    id: "amex_platinum",
    name: "American Express® Platinum",
    issuer: "Amex",
    image: "/cards/amex_platinum.png",
    url: "https://www.americanexpress.com/us/credit-cards/card/platinum/",
    annualFee: 695,
    defaultPointValue: 1.6,
    type: "points",
    rewardStructure: { type: "category", categories: { travel: 5, dining: 1, other: 1 } },
    loyaltyPrograms: ISSUER_PROGRAMS["Amex"],
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
    defaultPointValue: 1.6,
    type: "points",
    rewardStructure: { type: "category", categories: { dining: 4, groceries: 4, travel: 3, other: 1 } },
    loyaltyPrograms: ISSUER_PROGRAMS["Amex"],
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
    defaultPointValue: 1.6,
    type: "points",
    rewardStructure: { type: "fixed", rate: 2 },
    loyaltyPrograms: ISSUER_PROGRAMS["Amex"],
    benefits: [],
    creditScore: [670, 850],
    disclaimer: "2× on all purchases up to $50k per calendar year.",
  },

  /* ────────── CAPITAL ONE ────────── */
  {
    id: "venture_x",
    name: "Capital One Venture X®",
    issuer: "Capital One",
    image: "/cards/venture_x.png",
    url: "https://www.capitalone.com/credit-cards/venture-x/",
    annualFee: 395,
    defaultPointValue: 1.7,
    type: "points",
    rewardStructure: { type: "category", categories: { travel: 10, dining: 2, other: 2 } },
    loyaltyPrograms: ISSUER_PROGRAMS["Capital One"],
    signupBonus: { amount: 75000, spendRequirement: 4000, months: 3 },
    benefits: [
      { description: "$300 Annual Travel Credit", value: 300, recurring: "annual" },
      { description: "10,000‑mile Anniversary Bonus", value: 170, recurring: "annual" },
      { description: "Priority Pass & Capital One Lounge", value: 150, recurring: "annual" },
    ],
    creditScore: [720, 850],
  },

  /* ────────── SIMPLE CASHBACK (WELLS / DISCOVER / CITI / CAP1) ────────── */
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
    loyaltyPrograms: ISSUER_PROGRAMS["Discover"],
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
    loyaltyPrograms: ISSUER_PROGRAMS["Citi"], // technically pool into TY after conversion
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

  /* ─────────────────────────────────────────  COBRANDED AIRLINE  ───────────────────────────────────────── */
  {
    id: "alaska_visa",
    name: "Alaska Airlines Visa Signature®",
    issuer: "Bank of America",
    image: "/cards/alaska_visa.png",
    url: "https://www.bankofamerica.com/credit-cards/products/alaska-airlines-credit-card/",
    annualFee: 95,
    defaultPointValue: 1.3, // Alaska miles value estimate
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
    annualFee: 0, // $0 intro, then $150 (simplified intro fee omitted)
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
      { description: "Global Entry/TSA Pre✓® Credit", value: 100, recurring: "4‑yr" as any },
    ],
    creditScore: [700, 850],
  },
  {
    id: "united_explorer",
    name: "United Explorer Card",
    issuer: "Chase",
    image: "/cards/united_explorer.png",
    url: "https://www2.theexplorercard.com/rewards-cards/explorer-card?CELL=D4M&jp_cmp=cc/United+Explorer_Brand_Exact_United+Explorer_SEM_US_NA_Standard_NA/sea/25935921866/Explorer+Card&gclid=5d8a9049bfbb18a2c48df864ab77ba09&gclsrc=3p.ds&msclkid=5d8a9049bfbb18a2c48df864ab77ba09",
    annualFee: 0, // $0 intro year then $95 simplified as 95
    defaultPointValue: 1.3,
    type: "points",
    rewardStructure: {
      type: "category",
      categories: { travel: 2, dining: 2, hotels: 2, other: 1 },
    },
    loyaltyPrograms: ["MileagePlus"],
    signupBonus: { amount: 60000, spendRequirement: 3000, months: 3 },
    benefits: [
      { description: "First Checked Bag Free (2 rt)", value: 60, recurring: "annual" },
    ],
    creditScore: [670, 850],
  },
];
