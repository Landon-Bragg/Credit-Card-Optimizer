"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", spending: 2800, rewards: 65 },
  { month: "Feb", spending: 3100, rewards: 72 },
  { month: "Mar", spending: 2950, rewards: 68 },
  { month: "Apr", spending: 3200, rewards: 75 },
  { month: "May", spending: 3400, rewards: 82 },
  { month: "Jun", spending: 3300, rewards: 78 },
]

export function SpendingChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(22, 22, 22, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
            formatter={(value, name) => {
              return [`$${value}`, name === "spending" ? "Spending" : "Rewards"]
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="spending"
            name="Monthly Spending"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="rewards"
            name="Rewards Earned"
            stroke="#82ca9d"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
