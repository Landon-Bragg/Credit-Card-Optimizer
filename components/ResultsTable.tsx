"use client";

import { CardResult } from "@/lib/rewardCalculator";

export default function ResultsTable({ results }: { results: CardResult[] }) {
  if (!results.length) return null;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left px-3 py-2">Card</th>
            <th className="text-right px-3 py-2">Annual&nbsp;Fee</th>
            <th className="text-right px-3 py-2">Monthly</th>
            <th className="text-right px-3 py-2">1st&nbsp;Year</th>
            <th className="text-right px-3 py-2">Net&nbsp;Annual</th>
          </tr>
        </thead>

        <tbody>
          {results.map((r) => (
            <tr key={r.card.id} className="border-b hover:bg-muted/50">
              <td className="px-3 py-2">
                <a
                  href={r.card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  {r.card.image && (
                    <img
                      src={r.card.image}
                      alt={r.card.name}
                      className="h-18 w-20 rounded shadow-sm object-contain"
                    />
                  )}
                  <span className="font-medium">{r.card.name}</span>
                </a>
              </td>
              <td className="px-3 py-2 text-right">
                ${r.card.annualFee}
              </td>
              <td className="px-3 py-2 text-right">
                ${r.monthlyRewards.toFixed(2)}
              </td>
              <td className="px-3 py-2 text-right">
                ${r.firstYearTotal.toFixed(0)}
              </td>
              <td className="px-3 py-2 text-right font-medium">
                ${r.netAnnual.toFixed(0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
