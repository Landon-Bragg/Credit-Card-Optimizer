import { useEffect, useState } from "react";
import {
  calculateCardValue,
  CardResult,
  Preferences,
  Spending,
} from "@/lib/rewardCalculator";
import { cards } from "@/lib/sampleData";

export function useOptimizer() {
  const [spend, setSpend] = useState<Spending>(() =>
    JSON.parse(localStorage.getItem("spend") ?? "null") ?? {
      travel: 0,
      dining: 0,
      drugstores: 0,
      groceries: 0,
      gas: 0,
      online: 0,
      rent: 0,
      other: 0,
    }
  );

  const [prefs, setPrefs] = useState<Preferences>(() =>
    JSON.parse(localStorage.getItem("prefs") ?? "null") ?? {
      preferredPrograms: [],
      maxAnnualFee: 550,
      signupInterested: true,
      rewardType: "points",
    }
  );

  const [results, setResults] = useState<CardResult[]>([]);

  useEffect(() => {
    localStorage.setItem("spend", JSON.stringify(spend));
  }, [spend]);

  useEffect(() => {
    localStorage.setItem("prefs", JSON.stringify(prefs));
  }, [prefs]);

  const calculate = () => {
    const ranked = cards
      .filter((c) => c.annualFee <= prefs.maxAnnualFee)
      .map((card) => calculateCardValue(card, spend, prefs))
      .sort((a, b) => b.netAnnual - a.netAnnual);
    setResults(ranked);
  };

  return { spend, setSpend, prefs, setPrefs, results, calculate };
}
