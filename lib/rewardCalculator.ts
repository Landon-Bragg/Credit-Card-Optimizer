import { CreditCard } from "./sampleData";
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
  noFeeOnly: boolean;
}
export interface CardResult {
  card: CreditCard;
  monthlyRewards: number;
  firstYearTotal: number;
  ongoingAnnual: number;
  netAnnual: number;
}

export function calculateCardValue(
  card: CreditCard,
  spend: Spending,
  prefs: Preferences
): CardResult {
  const catSpend = { ...spend };

  // helper to apply monthly cap
  const applyCap = (amount: number, cap: number, rate: number) => {
    return Math.min(amount, cap) * rate + Math.max(0, amount - cap) * 1;
  };

  const monthlyPts = (() => {
    const rs = card.rewardStructure;

    switch (rs.type) {
      case "fixed": {
        const total = Object.values(catSpend).reduce((a, b) => a + b, 0);
        return total * rs.rate;
      }
      case "category": {
        let total = 0;
        for (const [cat, amt] of Object.entries(catSpend)) {
          const rate = rs.categories[cat] ?? 1;
          if (card.id === "blue_cash_preferred" && cat === "groceries") {
            // 6% groceries on first $500/mo
            total += applyCap(amt, 500, rate);
          } else {
            total += amt * rate;
          }
        }
        return total;
      }
      case "dynamic": {
        // Citi Custom Cash – 5× on top categories up to $500
        const sorted = Object.entries(catSpend).sort((a, b) => b[1] - a[1]);
        let pts = 0;
        let categoriesCounted = 0;
        for (const [cat, amt] of sorted) {
          if (categoriesCounted < rs.topCategories) {
            const bonusSpend = Math.min(amt, 500);
            pts += bonusSpend * 5 + (amt - bonusSpend) * 1;
            categoriesCounted++;
          } else {
            pts += amt * 1;
          }
        }
        return pts;
      }
      case "rotating": {
        // Discover 5% on rotating categories – cap $1 500/quarter → $500/mo
        let bonusSpend = 0;
        let otherSpend = 0;
        for (const [cat, amt] of Object.entries(catSpend)) {
          const rate = rs.quarterly[cat] ?? 1;
          if (rate > 1) {
            bonusSpend += Math.min(amt, rs.cap / 3); // monthly cap
            otherSpend += Math.max(0, amt - rs.cap / 3);
          } else {
            otherSpend += amt;
          }
        }
        return bonusSpend * 5 + otherSpend * 1;
      }
      case "special": {
        return rs.calc(catSpend);
      }
    }
  })();

  const pointValue = card.defaultPointValue / 100; // convert cents → $
  const monthlyVal = monthlyPts * pointValue;

  const recurringBenefits = card.benefits.filter((b) => b.recurring !== "one-time");
  const benefitsVal = recurringBenefits.reduce((s, b) => s + b.value, 0);

  const signupVal = card.signupBonus ? card.signupBonus.amount * pointValue : 0;
  const firstYearTotal = monthlyVal * 12 + benefitsVal + signupVal - card.annualFee;
  const ongoingAnnual = monthlyVal * 12 + benefitsVal - card.annualFee;

  return {
    card,
    monthlyRewards: Number(monthlyVal.toFixed(2)),
    firstYearTotal: Number(firstYearTotal.toFixed(2)),
    ongoingAnnual: Number(ongoingAnnual.toFixed(2)),
    netAnnual: Number(ongoingAnnual.toFixed(2)),
  };
}