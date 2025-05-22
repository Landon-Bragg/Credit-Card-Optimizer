import { CreditCard } from "./sampleData";

/* ------------------------------------------------------------------ */
/*  Data contracts                                                     */
/* ------------------------------------------------------------------ */
export interface Spending {
  travel: number;
  dining: number;
  drugstores: number;
  groceries: number;
  gas: number;
  online: number;
  rent: number;
  other: number;
}

export interface Preferences {
  preferredPrograms: string[];
  maxAnnualFee: number;
  rewardType: "cash" | "points";
  noFeeOnly?: boolean;
  creditScore: number | null;
}

export interface CardResult {
  card: CreditCard;
  monthlyRewards: number;
  firstYearTotal: number;
  ongoingAnnual: number;
  netAnnual: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const round = (n: number) => Number(n.toFixed(2));
const toMonthlyCap = (cap: number, periods: number) => cap / periods;

/* ------------------------------------------------------------------ */
/*  Core value engine                                                  */
/* ------------------------------------------------------------------ */
export function calculateCardValue(
  card: CreditCard,
  spend: Spending,
  prefs: Preferences
): CardResult {
  const catSpend = { ...spend };

  /* Bilt-only rent points */
  if (card.id !== "bilt") catSpend.rent = 0;

  const applyCap = (amt: number, cap: number, rate: number) =>
    Math.min(amt, cap) * rate + Math.max(0, amt - cap) * 1;

  /* -------------------------------------------------------------- */
  /*  STEP 1 :  convert spend → points                               */
  /* -------------------------------------------------------------- */
  const monthlyPts = (() => {
    const rs = card.rewardStructure;

    switch (rs.type) {
      case "fixed": {
        const total = Object.values(catSpend).reduce((a, b) => a + b, 0);
        return total * rs.rate;
      }

      case "category": {
        let pts = 0;
        for (const [cat, amt] of Object.entries(catSpend)) {
          const rate = rs.categories[cat] ?? 1;
          pts +=
            card.id === "blue_cash_preferred" && cat === "groceries"
              ? applyCap(amt, 500, rate)
              : amt * rate;
        }
        return pts;
      }

      case "dynamic": {
        const sorted = Object.entries(catSpend).sort((a, b) => b[1] - a[1]);
        let pts = 0,
          used = 0,
          cap = 500;
        for (const [, amt] of sorted) {
          if (used < rs.topCategories) {
            const bonus = Math.min(amt, cap);
            pts += bonus * 5 + (amt - bonus) * 1;
            used++;
          } else pts += amt;
        }
        return pts;
      }

      /* ---------- FIXED: rotating category logic ------------------ */
      case "rotating": {
        const monthlyCap = toMonthlyCap(rs.cap, 3); // e.g. $1 500/q → $500/mo
        let remainingCap = monthlyCap;
        let pts = 0;

        for (const [cat, amt] of Object.entries(catSpend)) {
          const catRate = rs.quarterly[cat]; // undefined if not a rotating cat
          if (catRate && catRate > 1 && remainingCap > 0) {
            const proratedSpend = amt * 0.25; // active 3 mo / 12 mo ≈ 25 %
            const bonusPart = Math.min(proratedSpend, remainingCap);
            pts += bonusPart * catRate + (amt - bonusPart) * 1;
            remainingCap -= bonusPart;
          } else {
            pts += amt; // 1 x
          }
        }
        return pts;
      }

      case "special": {
        if (card.id === "bilt") {
          return (
            catSpend.dining * 3 +
            catSpend.travel * 2 +
            (catSpend.drugstores +
              catSpend.groceries +
              catSpend.gas +
              catSpend.online +
              catSpend.other) *
              1 +
            catSpend.rent * 1
          );
        }
        if (typeof rs.calc === "function") return rs.calc(catSpend);
        return 0;
      }

      default:
        return 0;
    }
  })();

  /* -------------------------------------------------------------- */
  /*  STEP 2 :  points → $ & add benefits                            */
  /* -------------------------------------------------------------- */
  const pointValue = card.defaultPointValue / 100;
  const monthlyVal = monthlyPts * pointValue;

  const recurring = card.benefits.filter((b) => b.recurring !== "one-time");
  const ongoingVal = recurring.reduce((s, b) => s + b.value, 0);
  const allVal = card.benefits.reduce((s, b) => s + b.value, 0);

  const signupVal = card.signupBonus
    ? card.signupBonus.amount * pointValue
    : 0;

  /* -------------------------------------------------------------- */
  /*  STEP 3 :  build result                                         */
  /* -------------------------------------------------------------- */
  const firstYear =
    monthlyVal * 12 + allVal + signupVal - card.annualFee;
  const ongoing = monthlyVal * 12 + ongoingVal - card.annualFee;

  return {
    card,
    monthlyRewards: round(monthlyVal),
    firstYearTotal: round(firstYear),
    ongoingAnnual: round(ongoing),
    netAnnual: round(ongoing),
  };
}
