"use client"

import { motion } from "framer-motion"
import { ExternalLink } from "lucide-react"
import type { CardResult } from "@/lib/rewardCalculator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CardDetailsProps {
  result: CardResult
}

export function CardDetails({ result }: CardDetailsProps) {
  const { card } = result

  // Format reward structure for display
  const formatRewardStructure = () => {
    const rs = card.rewardStructure

    switch (rs.type) {
      case "fixed":
        return `${rs.rate}× points on all purchases`
      case "category":
        return Object.entries(rs.categories)
          .map(([category, rate]) => `${rate}× on ${category}`)
          .join(", ")
      case "rotating":
        return `5× on quarterly rotating categories (up to $${rs.cap} per quarter)`
      case "dynamic":
        return `5× on your top ${rs.topCategories} spending categories each month`
      case "special":
        return rs.description
      default:
        return "Custom reward structure"
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-muted p-1 shadow-sm transition-all hover:shadow-md">
                <img
                  src={card.image || "/placeholder.svg?height=80&width=80"}
                  alt={card.name}
                  className="h-16 w-16 object-contain"
                />
              </div>
              <div>
                <CardTitle className="text-2xl">{card.name}</CardTitle>
                <CardDescription className="text-base">{card.issuer}</CardDescription>
              </div>
            </div>
            <Button asChild className="transition-all hover:shadow-md hover:translate-y-[-2px]">
              <a href={card.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                Apply Now
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
                <h3 className="mb-3 font-medium">Value Based on Your Spending</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Rewards</span>
                    <span className="text-xl font-bold">${result.monthlyRewards}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">First Year Total</span>
                    <span className="text-xl font-bold">${result.firstYearTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ongoing Annual Value</span>
                    <span className="text-xl font-bold">${result.netAnnual}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Card Overview</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual Fee</span>
                    <span className="font-medium">${card.annualFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reward Type</span>
                    <span className="font-medium capitalize">{card.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Point Value</span>
                    <span className="font-medium">{(card.defaultPointValue / 100).toFixed(2)}¢ per point</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recommended Credit Score</span>
                    <span className="font-medium flex items-center gap-1">
                      {card.noCreditOK ? (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                          No Credit History OK
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className={cn(
                            card.creditScore[0] >= 740
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : card.creditScore[0] >= 670
                                ? "bg-green-100 text-green-800 border-green-200"
                                : card.creditScore[0] >= 580
                                  ? "bg-amber-100 text-amber-800 border-amber-200"
                                  : "bg-red-100 text-red-800 border-red-200",
                          )}
                        >
                          {card.creditScore[0]}+ (out of 850)
                        </Badge>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-medium">Reward Structure</h3>
                <p className="rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">{formatRewardStructure()}</p>
                {card.disclaimer && <p className="mt-2 text-xs text-muted-foreground">{card.disclaimer}</p>}
              </div>

              {card.signupBonus && (
                <div>
                  <h3 className="mb-2 font-medium">Sign-up Bonus</h3>
                  <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">
                    <p>
                      <span className="font-medium">{card.signupBonus.amount.toLocaleString()} points</span> after
                      spending ${card.signupBonus.spendRequirement.toLocaleString()} in the first{" "}
                      {card.signupBonus.months} months
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      Value: ${((card.signupBonus.amount * card.defaultPointValue) / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}

              {card.benefits.length > 0 && (
                <div>
                  <h3 className="mb-2 font-medium">Card Benefits</h3>
                  <ul className="space-y-2 text-sm">
                    {card.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Badge className="mt-0.5 shrink-0" variant="outline">
                          ${benefit.value}
                        </Badge>
                        <span>
                          {benefit.description}
                          {benefit.recurring !== "one-time" && (
                            <span className="text-xs text-muted-foreground"> ({benefit.recurring})</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transfer Partners</CardTitle>
          <CardDescription>Loyalty programs where you can transfer your points</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Partners</TabsTrigger>
              <TabsTrigger value="airlines">Airlines</TabsTrigger>
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="flex flex-wrap gap-2">
                {card.loyaltyPrograms.length > 0 ? (
                  card.loyaltyPrograms.map((program) => (
                    <Badge key={program} variant="outline">
                      {program}
                    </Badge>
                  ))
                ) : (
                  <p className="text-muted-foreground">No transfer partners available for this card.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="airlines">
              <div className="flex flex-wrap gap-2">
                {card.loyaltyPrograms.filter(
                  (p) =>
                    ![
                      "Marriott Bonvoy",
                      "Hilton Honors",
                      "World of Hyatt",
                      "IHG One Rewards",
                      "Choice Privileges",
                      "Wyndham Rewards",
                      "Accor Live Limitless",
                    ].includes(p),
                ).length > 0 ? (
                  card.loyaltyPrograms
                    .filter(
                      (p) =>
                        ![
                          "Marriott Bonvoy",
                          "Hilton Honors",
                          "World of Hyatt",
                          "IHG One Rewards",
                          "Choice Privileges",
                          "Wyndham Rewards",
                          "Accor Live Limitless",
                        ].includes(p),
                    )
                    .map((program) => (
                      <Badge key={program} variant="outline">
                        {program}
                      </Badge>
                    ))
                ) : (
                  <p className="text-muted-foreground">No airline partners available for this card.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="hotels">
              <div className="flex flex-wrap gap-2">
                {card.loyaltyPrograms.filter((p) =>
                  [
                    "Marriott Bonvoy",
                    "Hilton Honors",
                    "World of Hyatt",
                    "IHG One Rewards",
                    "Choice Privileges",
                    "Wyndham Rewards",
                    "Accor Live Limitless",
                  ].includes(p),
                ).length > 0 ? (
                  card.loyaltyPrograms
                    .filter((p) =>
                      [
                        "Marriott Bonvoy",
                        "Hilton Honors",
                        "World of Hyatt",
                        "IHG One Rewards",
                        "Choice Privileges",
                        "Wyndham Rewards",
                        "Accor Live Limitless",
                      ].includes(p),
                    )
                    .map((program) => (
                      <Badge key={program} variant="outline">
                        {program}
                      </Badge>
                    ))
                ) : (
                  <p className="text-muted-foreground">No hotel partners available for this card.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
