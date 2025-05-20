"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import MultiSelect from "@/components/MultiSelect";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CATEGORIES = [
  { key: "travel", label: "Travel (Flights / Hotels)" },
  { key: "dining", label: "Dining & Restaurants" },
  { key: "drugstores", label: "Drugstores & Pharmacies" },
  { key: "groceries", label: "Groceries & Supermarkets" },
  { key: "gas", label: "Gas / Fuel" },
  { key: "online", label: "Online Retail" },
  { key: "rent", label: "Rent / Housing" },
  { key: "other", label: "Other / Misc" },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

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
}

// condensed list (trimmed for brevity – use the big list if needed)
export const LOYALTY_OPTIONS = [
  "MileagePlus",
  "Aeroplan",
  "KrisFlyer",
  "AAdvantage",
  "Executive Club",
  "SkyMiles",
  "Flying Blue",
  "World of Hyatt",
  "Marriott Bonvoy",
  "Hilton Honors",
  "IHG One Rewards",
  "Rapid Rewards",
] as const;

export default function SpendingForm({
  onCalculate,
}: {
  onCalculate: (spend: Spending, prefs: Preferences & { noFeeOnly: boolean }) => void;
}) {
  const [spend, setSpend] = useState<Spending>(() =>
    CATEGORIES.reduce((o, { key }) => ({ ...o, [key]: 0 }), {} as Spending)
  );
  const [preferred, setPreferred] = useState<string[]>([]);
  const [maxFee, setMaxFee] = useState(999);
  const [noFeeOnly, setNoFeeOnly] = useState(false);

  // ------ persist filters ------
  useEffect(() => {
    localStorage.setItem("preferred_programs", JSON.stringify(preferred));
  }, [preferred]);
  useEffect(() => {
    localStorage.setItem("no_fee_only", JSON.stringify(noFeeOnly));
  }, [noFeeOnly]);
  useEffect(() => {
    const savedPref = JSON.parse(localStorage.getItem("preferred_programs") || "null");
    if (Array.isArray(savedPref)) setPreferred(savedPref);
    const savedFee = JSON.parse(localStorage.getItem("no_fee_only") || "null");
    if (typeof savedFee === "boolean") setNoFeeOnly(savedFee);
  }, []);

  const handleSpend = (field: CategoryKey, val: string) =>
    setSpend((s) => ({ ...s, [field]: Number(val) }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate(spend, {
          preferredPrograms: preferred,
          maxAnnualFee: noFeeOnly ? 0 : maxFee,
          rewardType: "points",
          noFeeOnly,
        });
      }}
      className="space-y-6"
    >
      {/* Spending */}
      <fieldset className="space-y-2">
        <legend className="font-semibold mb-2 flex items-center gap-1">
          Monthly Spending
          <Tooltip>
            <TooltipTrigger asChild>
              <Info size={14} className="cursor-pointer text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent side="right">Average dollars per month.</TooltipContent>
          </Tooltip>
        </legend>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                type="number"
                min={0}
                step={1}
                value={spend[key]}
                onChange={(e) => handleSpend(key as CategoryKey, e.target.value)}
              />
            </div>
          ))}
        </div>
      </fieldset>

      {/* Filters */}
      <fieldset className="space-y-4">
        <legend className="font-semibold mb-2">Filters</legend>
        <label className="flex items-center gap-2">
          <Checkbox checked={noFeeOnly} onCheckedChange={(v) => setNoFeeOnly(!!v)} />
          No‑annual‑fee cards only
        </label>
        {!noFeeOnly && (
          <div className="flex flex-col max-w-xs">
            <Label htmlFor="maxFee">Max annual fee ($)</Label>
            <Input
              id="maxFee"
              type="number"
              min={0}
              step={1}
              value={maxFee}
              onChange={(e) => setMaxFee(Number(e.target.value))}
            />
          </div>
        )}

        <div className="space-y-2">
          <Label>Preferred airline / hotel programs</Label>
          <MultiSelect
            options={LOYALTY_OPTIONS as unknown as string[]}
            selected={preferred}
            onChange={setPreferred}
            placeholder="Choose programs…"
          />
        </div>
      </fieldset>

      <Button type="submit" className="px-8">
        Calculate
      </Button>
    </form>
  );
}
