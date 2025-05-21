"use client"

import type { CardResult } from "@/lib/rewardCalculator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function RewardsSummary({ results }: { results: CardResult[] }) {
  const chartData = results.map((result) => ({
    name: result.card.name.split(" ")[0],
    monthly: result.monthlyRewards,
    firstYear: result.firstYearTotal,
    annual: result.netAnnual,
  }))

  return (
    <Card className="bg-card/50 backdrop-blur">
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
                  backgroundColor: "rgba(22, 22, 22, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
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
  )
}
