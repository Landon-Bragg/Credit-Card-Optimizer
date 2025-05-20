"use client";
import { useState } from "react";
import SpendingForm from "@/components/SpendingForm";
import ResultsTable from "@/components/ResultsTable";
import { cards } from "@/lib/sampleData";
import { calculateCardValue, CardResult } from "@/lib/rewardCalculator";

export default function Home() {
  const [results, setResults] = useState<CardResult[]>([]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">CardOptimizer</h1>

      <SpendingForm
        onCalculate={(spend, prefs) => {
          const ranked = cards
            .filter((c) => c.annualFee <= prefs.maxAnnualFee)
            .filter(
              (c) =>
                prefs.preferredPrograms.length === 0 ||
                c.loyaltyPrograms.some((p) =>
                  prefs.preferredPrograms.includes(p)
                )
            )
            .map((card) => calculateCardValue(card, spend, prefs))
            .sort((a, b) => b.netAnnual - a.netAnnual);
          setResults(ranked);
        }}
      />

      {results.length > 0 && <ResultsTable results={results} />}
    </div>
  );
}
