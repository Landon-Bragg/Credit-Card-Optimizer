"use client"

import { useState } from "react"
import type { Spending } from "@/lib/rewardCalculator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1"]

export function SpendingDashboard() {
  const [spending, setSpending] = useState<Spending>({
    travel: 300,
    dining: 500,
    drugstores: 50,
    groceries: 400,
    gas: 150,
    online: 200,
    rent: 1500,
    other: 300,
  })

  const handleChange = (category: keyof Spending, value: number) => {
    setSpending((prev) => ({
      ...prev,
      [category]: value,
    }))
  }

  const pieData = Object.entries(spending).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  const barData = Object.entries(spending).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    amount: value,
  }))

  const totalSpending = Object.values(spending).reduce((sum, value) => sum + value, 0)

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Spending Distribution</CardTitle>
            <CardDescription>Your monthly spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Amount"]}
                    contentStyle={{
                      backgroundColor: "rgba(22, 22, 22, 0.9)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="amount" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle>Spending Breakdown</CardTitle>
            <CardDescription>Percentage of total spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Amount"]}
                    contentStyle={{
                      backgroundColor: "rgba(22, 22, 22, 0.9)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">Total Monthly Spending</p>
              <p className="text-2xl font-bold">${totalSpending.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>Adjust Your Spending</CardTitle>
          <CardDescription>Update your monthly spending in each category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(spending).map(([category, value]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={category} className="capitalize">
                    {category}
                  </Label>
                  <span className="text-sm font-medium">${value}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Slider
                    id={category}
                    min={0}
                    max={category === "rent" ? 3000 : 1000}
                    step={10}
                    value={[value]}
                    onValueChange={([newValue]) => handleChange(category as keyof Spending, newValue)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={value}
                    onChange={(e) => handleChange(category as keyof Spending, Number(e.target.value))}
                    className="w-20"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
