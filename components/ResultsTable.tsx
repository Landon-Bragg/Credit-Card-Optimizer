import Link from "next/link";
import { CardResult } from "@/lib/rewardCalculator";

export default function ResultsTable({ results }: { results: CardResult[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
    <thead>
        <tr className="border-b">
            <th className="text-left px-3 py-2">Card</th>
            <th className="text-right px-3 py-2">Annual Fee</th>   {/* NEW */}
            <th className="text-right px-3 py-2">Monthly</th>
            <th className="text-right px-3 py-2">1st Year</th>
            <th className="text-right px-3 py-2">Net Annual</th>
        </tr>
    </thead>

    <tbody>
        {results.map(r => (
            <tr key={r.card.id} className="border-b hover:bg-muted/50">
                <td className="px-3 py-2">
                    <Link href={`/card/${r.card.id}`} className="flex items-center gap-2">
                    {r.card.image && <img src={r.card.image} alt={r.card.name} className="h-6 w-6 rounded" />}
                    {r.card.name}
                </Link>
            </td>
            <td className="px-3 py-2 text-right">${r.card.annualFee}</td>  {/* NEW */}
            <td className="px-3 py-2 text-right">${r.monthlyRewards.toFixed(2)}</td>
            <td className="px-3 py-2 text-right">${r.firstYearTotal.toFixed(0)}</td>
            <td className="px-3 py-2 text-right font-medium">${r.netAnnual.toFixed(0)}</td>
        </tr>
        ))}
        </tbody>

      </table>
    </div>
  );
}