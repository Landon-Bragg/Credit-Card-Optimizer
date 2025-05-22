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

/* ----- loyalty options ----- */
/* ----- loyalty options (reflects ISSUER_PROGRAMS table) ----- */
export const AIRLINE_OPTIONS = [
  // Star Alliance & friends
  "United",
  "Air Canada",
  "ANA Mileage Club",
  "Avianca",
  "KrisFlyer",
  "EVA Infinity MileageLands",
  "Thai Royal Orchid Plus",
  "TAP Miles&Go",
  "Turkish Miles&Smiles",

  // oneworld & partners
  "AAdvantage",
  "British Airways",                       // British Airways / Iberia / Aer Lingus
  "Iberia Plus",
  "Finnair Plus",
  "Qatar Privilege Club",
  "Qantas Frequent Flyer",
  "Alaska Mileage Plan",
  "Japan Airlines Mileage Bank",
  
  // SkyTeam & independent
  "Flying Blue",                 // Air France / KLM
  "Virgin Atlantic Flying Club",
  "Virgin Red",
  "Emirates Skywards",
  "Etihad Guest",
  "JetBlue TrueBlue",
  "HawaiianMiles",
  "Southwest Rapid Rewards",
] as const;

export const HOTEL_OPTIONS = [
  "Marriott Bonvoy",
  "Hilton Honors",
  "World of Hyatt",
  "IHG One Rewards",
  "Choice Privileges",
  "Wyndham Rewards",
  "Accor Live Limitless",
] as const;


/* ----- data contracts ----- */
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
  preferredAirlines: string[];
  preferredHotels: string[];
  maxAnnualFee: number;
  rewardType: "cash" | "points";
}

export default function SpendingForm({
  onCalculate,
}: {
  onCalculate: (
    spend: Spending,
    prefs: Preferences & { noFeeOnly: boolean }
  ) => void;
}) {
  /* ----- state ----- */
  const [spend, setSpend] = useState<Spending>(() =>
    CATEGORIES.reduce(
      (o, { key }) => ({ ...o, [key]: 0 }),
      {} as Spending
    )
  );

  const [airlines, setAirlines] = useState<string[]>([]);
  const [hotels, setHotels] = useState<string[]>([]);
  const [maxFee, setMaxFee] = useState(999);
  const [noFeeOnly, setNoFeeOnly] = useState(false);

  /* ----- localStorage persistence ----- */
  useEffect(() => {
    localStorage.setItem("pref_airlines", JSON.stringify(airlines));
    localStorage.setItem("pref_hotels", JSON.stringify(hotels));
  }, [airlines, hotels]);

  useEffect(() => {
    localStorage.setItem("no_fee_only", JSON.stringify(noFeeOnly));
  }, [noFeeOnly]);

  useEffect(() => {
    const savedAir = JSON.parse(localStorage.getItem("pref_airlines") || "null");
    const savedHot = JSON.parse(localStorage.getItem("pref_hotels") || "null");
    const savedNoFee = JSON.parse(localStorage.getItem("no_fee_only") || "null");
    if (Array.isArray(savedAir)) setAirlines(savedAir);
    if (Array.isArray(savedHot)) setHotels(savedHot);
    if (typeof savedNoFee === "boolean") setNoFeeOnly(savedNoFee);
  }, []);

  /* ----- helpers ----- */
  const handleSpend = (field: CategoryKey, val: string) =>
    setSpend((s) => ({ ...s, [field]: Number(val) }));

  /* ----- view ----- */
  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onCalculate(spend, {
          preferredAirlines: airlines,
          preferredHotels: hotels,
          maxAnnualFee: noFeeOnly ? 0 : maxFee,
          rewardType: "points",
          noFeeOnly,
        });
      }}
    >
      {/* --- Spending inputs --- */}
      <fieldset className="space-y-2">
        <legend className="font-semibold mb-2 flex items-center gap-1">
          Monthly Spending
          <Tooltip>
            <TooltipTrigger asChild>
              <Info
                size={14}
                className="cursor-pointer text-muted-foreground"
              />
            </TooltipTrigger>
            <TooltipContent side="right">
              Average dollars per month.
            </TooltipContent>
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
                onChange={(e) => handleSpend(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </fieldset>

      {/* --- Filters --- */}
      <fieldset className="space-y-4">
        <legend className="font-semibold mb-2">Filters</legend>

        <label className="flex items-center gap-2">
          <Checkbox
            checked={noFeeOnly}
            onCheckedChange={(v) => setNoFeeOnly(!!v)}
          />
          No-annual-fee cards only
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

        {/* --- Airline multiselect --- */}
        <div className="space-y-2">
          <Label>Preferred airline programs</Label>
          <MultiSelect
            options={AIRLINE_OPTIONS as unknown as string[]}
            selected={airlines}
            onChange={setAirlines}
            placeholder="Choose airlines…"
          />
        </div>

        {/* --- Hotel multiselect --- */}
        <div className="space-y-2">
          <Label>Preferred hotel programs</Label>
          <MultiSelect
            options={HOTEL_OPTIONS as unknown as string[]}
            selected={hotels}
            onChange={setHotels}
            placeholder="Choose hotels…"
          />
        </div>
      </fieldset>

      <Button type="submit" className="px-8">
        Calculate
      </Button>
    </form>
  );
}
