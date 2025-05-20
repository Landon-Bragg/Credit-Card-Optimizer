"use client";
import { useState } from "react";
import { CardResult } from "@/lib/rewardCalculator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function ComparisonDrawer({ results }: { results: CardResult[] }) {
  const [open, setOpen] = useState(false);
  const selected = results.slice(0, 4);

  return (
    <>
      {selected.length > 0 && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 rounded-full bg-primary text-primary-foreground px-4 py-2 shadow-lg"
        >
          Compare ({selected.length})
        </button>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Card Comparison</SheetTitle>
          </SheetHeader>

          <table className="min-w-full text-sm mt-4 border">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left"></th>
                {selected.map((c) => (
                  <th key={c.card.id} className="px-2 py-1 text-center">
                    {c.card.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-2 py-1 font-medium text-left">Annual Fee</td>
                {selected.map((c) => (
                  <td key={c.card.id} className="text-center px-2 py-1">
                    ${c.card.annualFee}
                  </td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="px-2 py-1 font-medium text-left">Monthly Rewards</td>
                {selected.map((c) => (
                  <td key={c.card.id} className="text-center px-2 py-1">
                    ${c.monthlyRewards.toFixed(2)}
                  </td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="px-2 py-1 font-medium text-left">1st‑Year Value</td>
                {selected.map((c) => (
                  <td key={c.card.id} className="text-center px-2 py-1">
                    ${c.firstYearTotal.toFixed(0)}
                  </td>
                ))}
              </tr>
              <tr className="border-t">
                <td className="px-2 py-1 font-medium text-left">Net Annual</td>
                {selected.map((c) => (
                  <td key={c.card.id} className="text-center px-2 py-1">
                    ${c.netAnnual.toFixed(0)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </SheetContent>
      </Sheet>
    </>
  );
}
