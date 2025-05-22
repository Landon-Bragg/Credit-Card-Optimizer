"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { MultiSelect } from "@/components/ui/multi-select"
import type { Spending, Preferences } from "@/lib/rewardCalculator"
import { CreditScoreInput } from "@/components/optimizer/credit-score-input"

const CATEGORIES = [
  { key: "travel", label: "Travel (Flights / Hotels)" },
  { key: "dining", label: "Dining & Restaurants" },
  { key: "drugstores", label: "Drugstores & Pharmacies" },
  { key: "groceries", label: "Groceries & Supermarkets" },
  { key: "gas", label: "Gas / Fuel" },
  { key: "online", label: "Online Retail" },
  { key: "rent", label: "Rent / Housing" },
  { key: "other", label: "Other / Misc" },
] as const

type CategoryKey = (typeof CATEGORIES)[number]["key"]

/* ----- loyalty options ----- */
export const AIRLINE_OPTIONS = [
  // Star Alliance & friends
  "United", // United
  "Air Canada", // Air Canada
  "ANA Mileage Club",
  "Avianca", // Avianca
  "KrisFlyer", // Singapore Airlines
  "EVA Infinity MileageLands",
  "Thai Royal Orchid Plus",
  "TAP Miles&Go",
  "Turkish Miles&Smiles",

  // oneworld & partners
  "AAdvantage",
  "British Airways", // British Airways / Iberia / Aer Lingus
  "Iberia Plus",
  "Finnair Plus",
  "Qatar Privilege Club",
  "Qantas Frequent Flyer",
  "Alaska Mileage Plan",
  "Japan Airlines Mileage Bank",

  // SkyTeam & independent
  "Flying Blue", // Air France / KLM
  "Virgin Atlantic Flying Club",
  "Virgin Red",
  "Emirates Skywards",
  "Etihad Guest",
  "JetBlue TrueBlue",
  "HawaiianMiles",
  "Southwest Rapid Rewards",
] as const

export const HOTEL_OPTIONS = [
  "Marriott Bonvoy",
  "Hilton Honors",
  "World of Hyatt",
  "IHG One Rewards",
  "Choice Privileges",
  "Wyndham Rewards",
  "Accor Live Limitless",
] as const

interface SpendingFormProps {
  onCalculate: (spending: Spending, preferences: Preferences) => void
}

export function SpendingForm({ onCalculate }: SpendingFormProps) {
  const [activeTab, setActiveTab] = useState("spending")

  // Spending state
  const [spending, setSpending] = useState<Spending>(() => {
    const savedSpending = localStorage.getItem("spending")
    return savedSpending
      ? JSON.parse(savedSpending)
      : {
          travel: 300,
          dining: 400,
          drugstores: 50,
          groceries: 400,
          gas: 150,
          online: 200,
          rent: 1500,
          other: 300,
        }
  })

  // Preferences state
  const [airlines, setAirlines] = useState<string[]>(() => {
    const saved = localStorage.getItem("pref_airlines")
    return saved ? JSON.parse(saved) : []
  })

  const [hotels, setHotels] = useState<string[]>(() => {
    const saved = localStorage.getItem("pref_hotels")
    return saved ? JSON.parse(saved) : []
  })

  const [maxFee, setMaxFee] = useState<number>(() => {
    const saved = localStorage.getItem("max_fee")
    return saved ? Number.parseInt(saved) : 550
  })

  const [noFeeOnly, setNoFeeOnly] = useState<boolean>(() => {
    const saved = localStorage.getItem("no_fee_only")
    return saved ? JSON.parse(saved) : false
  })

  const [creditScore, setCreditScore] = useState<number | null>(() => {
    const saved = localStorage.getItem("credit_score")
    return saved ? JSON.parse(saved) : 700
  })

  // Save to localStorage when values change
  useEffect(() => {
    localStorage.setItem("spending", JSON.stringify(spending))
  }, [spending])

  useEffect(() => {
    localStorage.setItem("pref_airlines", JSON.stringify(airlines))
    localStorage.setItem("pref_hotels", JSON.stringify(hotels))
    localStorage.setItem("max_fee", String(maxFee))
    localStorage.setItem("no_fee_only", JSON.stringify(noFeeOnly))
    localStorage.setItem("credit_score", JSON.stringify(creditScore))
  }, [airlines, hotels, maxFee, noFeeOnly, creditScore])

  const handleSpendingChange = (category: CategoryKey, value: number) => {
    setSpending((prev) => ({ ...prev, [category]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Combine airlines and hotels into one array for the filter
    const preferredPrograms = [...airlines, ...hotels]

    onCalculate(spending, {
      preferredPrograms,
      maxAnnualFee: noFeeOnly ? 0 : maxFee,
      rewardType: "points",
      creditScore: creditScore,
    })
  }

  const totalMonthlySpend = Object.values(spending).reduce((sum, value) => sum + value, 0)

  return (
    <form onSubmit={handleSubmit}>
      <TooltipProvider>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="spending">Spending</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="spending" className="space-y-6">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Total Monthly Spending</h3>
                <span className="text-xl font-bold">${totalMonthlySpend.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-6">
              {CATEGORIES.map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={key} className="flex items-center gap-1">
                      {label}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={14} className="cursor-pointer text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent side="right">Average dollars per month</TooltipContent>
                      </Tooltip>
                    </Label>
                    <span className="font-medium text-primary">${spending[key as keyof Spending]}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Slider
                      id={key}
                      min={0}
                      max={key === "rent" ? 3000 : 1000}
                      step={10}
                      value={[spending[key as keyof Spending]]}
                      onValueChange={([newValue]) => handleSpendingChange(key as CategoryKey, newValue)}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      min={0}
                      value={spending[key as keyof Spending]}
                      onChange={(e) => handleSpendingChange(key as CategoryKey, Number(e.target.value))}
                      className="w-20"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={() => setActiveTab("preferences")}>
                Continue to Preferences
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Annual Fee Preferences</h3>
                <div className="flex items-center gap-2">
                  <Checkbox id="noFeeOnly" checked={noFeeOnly} onCheckedChange={(checked) => setNoFeeOnly(!!checked)} />
                  <Label htmlFor="noFeeOnly">No-annual-fee cards only</Label>
                </div>

                {!noFeeOnly && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="maxFee">Maximum annual fee</Label>
                      <span className="font-medium">${maxFee}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Slider
                        id="maxFee"
                        min={0}
                        max={700}
                        step={25}
                        value={[maxFee]}
                        onValueChange={([newValue]) => setMaxFee(newValue)}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min={0}
                        value={maxFee}
                        onChange={(e) => setMaxFee(Number(e.target.value))}
                        className="w-20"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Preferred Airline Programs</h3>
                <p className="text-sm text-muted-foreground">
                  Select programs you're interested in to prioritize cards with these transfer partners
                </p>
                <MultiSelect
                  options={AIRLINE_OPTIONS as unknown as string[]}
                  selected={airlines}
                  onChange={setAirlines}
                  placeholder="Choose airlines..."
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Preferred Hotel Programs</h3>
                <p className="text-sm text-muted-foreground">Select hotel loyalty programs you're interested in</p>
                <MultiSelect
                  options={HOTEL_OPTIONS as unknown as string[]}
                  selected={hotels}
                  onChange={setHotels}
                  placeholder="Choose hotels..."
                />
              </div>

              <div className="mt-6 pt-6 border-t border-border/60">
                <CreditScoreInput value={creditScore} onChange={setCreditScore} />
              </div>
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setActiveTab("spending")}>
                Back to Spending
              </Button>
              <Button type="submit">Find My Best Cards</Button>
            </div>
          </TabsContent>
        </Tabs>
      </TooltipProvider>
    </form>
  )
}
