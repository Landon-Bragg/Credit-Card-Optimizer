"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Info, Check } from "lucide-react"
import type { CardResult } from "@/lib/rewardCalculator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

interface ResultsSectionProps {
  results: CardResult[]
  onViewDetails: (card: CardResult) => void
}

export function ResultsSection({ results, onViewDetails }: ResultsSectionProps) {
  const [activeTab, setActiveTab] = useState("cards")

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 rounded-full bg-muted p-3">
            <Info className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-xl font-medium">No matching cards found</h3>
          <p className="mb-6 text-center text-muted-foreground">
            Try adjusting your preferences or spending patterns to find more card options.
          </p>
          <Button>Adjust Preferences</Button>
        </CardContent>
      </Card>
    )
  }

  const chartData = results.slice(0, 5).map((result) => ({
    name: result.card.name.split(" ")[0],
    monthly: result.monthlyRewards,
    annual: result.netAnnual,
    firstYear: result.firstYearTotal,
  }))

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="cards">Card Recommendations</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.slice(0, 6).map((result, index) => (
              <motion.div
                key={result.card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={cn(
                    "h-full overflow-hidden transition-all hover:shadow-md hover:shadow-primary/10 group cursor-pointer",
                    index === 0 && "card-highlight",
                  )}
                  onClick={() => onViewDetails(result)}
                >
                  {index === 0 && (
                    <div className="bg-primary px-4 py-1 text-center text-xs font-medium text-primary-foreground">
                      Best Match
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-16 w-16 items-center justify-center rounded-md bg-muted p-1 transition-transform group-hover:scale-105">
                          <img
                            src={result.card.image || "/placeholder.svg?height=60&width=60"}
                            alt={result.card.name}
                            className="h-14 w-14 object-contain"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-base">{result.card.name}</CardTitle>
                          <CardDescription>{result.card.issuer}</CardDescription>
                        </div>
                      </div>
                      {index < 3 && <Badge variant={index === 0 ? "default" : "outline"}>#{index + 1}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Annual Fee</span>
                        <span className="font-medium">${result.card.annualFee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monthly Rewards</span>
                        <span className="font-medium">${result.monthlyRewards}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">First Year Value</span>
                        <span className="font-medium">${result.firstYearTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Net Annual Value</span>
                        <span className="font-medium">${result.netAnnual}</span>
                      </div>
                      {/* Add credit score requirement */}
                      <div className="flex justify-between mt-2">
                        <span className="text-muted-foreground">Credit Score</span>
                        <span className="font-medium flex items-center gap-1">
                          {result.card.noCreditOK ? (
                            <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                              No Credit OK
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs",
                                result.card.creditScore[0] >= 740
                                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                  : result.card.creditScore[0] >= 670
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : result.card.creditScore[0] >= 580
                                      ? "bg-amber-100 text-amber-800 border-amber-200"
                                      : "bg-red-100 text-red-800 border-red-200",
                              )}
                            >
                              {result.card.creditScore[0]}+
                            </Badge>
                          )}
                        </span>
                      </div>
                    </div>

                    {result.card.loyaltyPrograms.length > 0 && (
                      <div className="mt-4">
                        <h4 className="mb-2 text-xs font-medium text-muted-foreground">Transfer Partners</h4>
                        <div className="flex flex-wrap gap-1">
                          {result.card.loyaltyPrograms.slice(0, 3).map((program) => (
                            <Badge key={program} variant="outline" className="text-xs">
                              {program}
                            </Badge>
                          ))}
                          {result.card.loyaltyPrograms.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{result.card.loyaltyPrograms.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        onViewDetails(result)
                      }}
                      className="w-full transition-all hover:shadow-md hover:translate-y-[-2px]"
                      variant={index === 0 ? "default" : "outline"}
                    >
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Rewards Comparison</CardTitle>
              <CardDescription>Compare the value of different cards based on your spending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`$${value}`, ""]}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="monthly" name="Monthly Rewards" fill="#8884d8" />
                    <Bar dataKey="annual" name="Annual Value" fill="#82ca9d" />
                    <Bar dataKey="firstYear" name="First Year" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Comparison</CardTitle>
                <CardDescription>Side-by-side comparison of top recommended cards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="whitespace-nowrap px-4 py-2 text-left font-medium">Card</th>
                        <th className="whitespace-nowrap px-4 py-2 text-right font-medium">Annual Fee</th>
                        <th className="whitespace-nowrap px-4 py-2 text-right font-medium">Monthly Rewards</th>
                        <th className="whitespace-nowrap px-4 py-2 text-right font-medium">First Year</th>
                        <th className="whitespace-nowrap px-4 py-2 text-right font-medium">Net Annual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.slice(0, 5).map((result, index) => (
                        <tr key={result.card.id} className="border-b">
                          <td className="whitespace-nowrap px-4 py-2">
                            <div className="flex items-center gap-2">
                              {index === 0 && <Check className="h-4 w-4 text-primary" />}
                              <span className="font-medium">{result.card.name}</span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-2 text-right">${result.card.annualFee}</td>
                          <td className="whitespace-nowrap px-4 py-2 text-right">${result.monthlyRewards}</td>
                          <td className="whitespace-nowrap px-4 py-2 text-right">${result.firstYearTotal}</td>
                          <td className="whitespace-nowrap px-4 py-2 text-right font-medium">${result.netAnnual}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
