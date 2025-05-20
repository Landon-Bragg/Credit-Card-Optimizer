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
  noFeeOnly?: boolean;
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
  
    /* NEW — if the card isn’t Bilt, pretend rent spend is $0 */
    if (card.id !== "bilt") catSpend.rent = 0;
  
    // helper to apply monthly cap
    const applyCap = (amount: number, cap: number, rate: number) =>
      Math.min(amount, cap) * rate + Math.max(0, amount - cap) * 1;
  
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
              total += cat === "groceries" && card.id === "blue_cash_preferred"
                ? applyCap(amt, 500, rate)
                : amt * rate;
            }
            return total;
          }
          case "dynamic": {
            const sorted = Object.entries(catSpend).sort((a, b) => b[1] - a[1]);
            let pts = 0,
              counted = 0,
              remaining = 500;
            for (const [, amt] of sorted) {
              if (counted < rs.topCategories) {
                const bonus = Math.min(amt, remaining);
                pts += bonus * 5 + (amt - bonus) * 1;
                remaining -= bonus;
                counted++;
              } else pts += amt;
            }
            return pts;
          }
          case "rotating": {
            let bonusSpend = 0,
              otherSpend = 0,
              cap = rs.cap / 3;
            for (const [cat, amt] of Object.entries(catSpend)) {
              const rate = rs.quarterly[cat] ?? 1;
              if (rate > 1) {
                const eligible = Math.min(amt, cap);
                bonusSpend += eligible;
                otherSpend += amt - eligible;
              } else otherSpend += amt;
            }
            return bonusSpend * 5 + otherSpend;
          }
          case "special": {
            return rs.calc(catSpend);
          }
          default:
            return 0;
        }
      })();
      
  
  

  const pointValue = card.defaultPointValue / 100; // convert cents → $
  const monthlyVal = monthlyPts * pointValue;

  const recurringBenefits = card.benefits.filter((b) => b.recurring !== "one-time");
  const ongoingBenefitsVal = recurringBenefits.reduce((s, b) => s + b.value, 0);

  const allBenefitsVal = card.benefits.reduce((s, b) => s + b.value, 0);
  const signupVal = card.signupBonus ? card.signupBonus.amount * pointValue : 0;

  const firstYearTotal = monthlyVal * 12 + allBenefitsVal + signupVal - card.annualFee;
  const ongoingAnnual = monthlyVal * 12 + ongoingBenefitsVal - card.annualFee;

  return {
    card,
    monthlyRewards: Number(monthlyVal.toFixed(2)),
    firstYearTotal: Number(firstYearTotal.toFixed(2)),
    ongoingAnnual: Number(ongoingAnnual.toFixed(2)),
    netAnnual: Number(ongoingAnnual.toFixed(2)),
  };
}
