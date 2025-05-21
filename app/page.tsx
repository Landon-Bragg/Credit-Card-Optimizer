"use client"

import { useState } from "react"
import { CreditCard, BadgeDollarSign, Wallet, ArrowRight } from "lucide-react"
import { cards } from "@/lib/sampleData"
import { calculateCardValue, type CardResult, type Spending, type Preferences } from "@/lib/rewardCalculator"
import { Button } from "@/components/ui/button"
import { SpendingForm } from "@/components/optimizer/spending-form"
import { ResultsSection } from "@/components/optimizer/results-section"
import { CardDetails } from "@/components/optimizer/card-details"

export default function Home() {
  const [results, setResults] = useState<CardResult[]>([])
  const [selectedCard, setSelectedCard] = useState<CardResult | null>(null)
  const [step, setStep] = useState<"form" | "results" | "details">("form")

  const calculateRecommendations = (spending: Spending, preferences: Preferences) => {
    // Filter cards based on preferences
    const filteredCards = cards
      .filter((c) => c.annualFee <= preferences.maxAnnualFee)
      .filter((c) => {
        // If no preferred programs selected, show all cards
        if (preferences.preferredPrograms.length === 0) return true

        // Otherwise, filter by cards that have at least one of the preferred programs
        return c.loyaltyPrograms.some((program) => preferences.preferredPrograms.includes(program))
      })

    // Calculate value for each card
    const ranked = filteredCards
      .map((card) => calculateCardValue(card, spending, preferences))
      .sort((a, b) => b.netAnnual - a.netAnnual)

    setResults(ranked)
    setStep("results")
  }

  const viewCardDetails = (card: CardResult) => {
    setSelectedCard(card)
    setStep("details")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <header className="border-b border-border/40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <CreditCard className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">CardOptimizer</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {step === "form" && (
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold tracking-tight">Find Your Perfect Credit Card</h1>
              <p className="mt-3 text-muted-foreground">
                Enter your monthly spending and preferences to discover the best credit cards for your lifestyle.
              </p>
            </div>

            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col items-center rounded-lg border border-border/60 bg-card/50 p-6 text-center shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-1 font-medium">Enter Spending</h3>
                <p className="text-sm text-muted-foreground">Tell us your monthly spending habits</p>
              </div>
              <div className="flex flex-col items-center rounded-lg border border-border/60 bg-card/50 p-6 text-center shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <BadgeDollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-1 font-medium">Set Preferences</h3>
                <p className="text-sm text-muted-foreground">Choose your preferred loyalty programs</p>
              </div>
              <div className="flex flex-col items-center rounded-lg border border-border/60 bg-card/50 p-6 text-center shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-1 font-medium">Get Recommendations</h3>
                <p className="text-sm text-muted-foreground">Discover your optimal credit cards</p>
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-card shadow-sm">
              <div className="border-b border-border/60 p-6">
                <h2 className="text-2xl font-semibold tracking-tight">Optimize Your Rewards</h2>
                <p className="text-muted-foreground">
                  We'll analyze your spending to find cards that maximize your rewards.
                </p>
              </div>
              <div className="p-6">
                <SpendingForm onCalculate={calculateRecommendations} />
              </div>
            </div>
          </div>
        )}

        {step === "results" && (
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Your Recommended Cards</h1>
                <p className="text-muted-foreground">
                  Based on your spending habits and preferences, these cards will maximize your rewards.
                </p>
              </div>
              <Button variant="outline" onClick={() => setStep("form")}>
                Adjust Preferences
              </Button>
            </div>
            <ResultsSection results={results} onViewDetails={viewCardDetails} />
          </div>
        )}

        {step === "details" && selectedCard && (
          <div className="mx-auto max-w-4xl">
            <Button variant="outline" className="mb-6" onClick={() => setStep("results")}>
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              Back to Results
            </Button>
            <CardDetails result={selectedCard} />
          </div>
        )}
      </div>
    </div>
  )
}
