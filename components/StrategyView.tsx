"use client";
import { CardResult } from "@/lib/rewardCalculator";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

export default function StrategyView({ combo }: { combo: CardResult[] }) {
  const data = combo.map((r) => ({ name: r.card.name.split(" ")[0], value: r.netAnnual }));

  return (
    <div className="bg-card p-4 rounded-2xl shadow-md">
      <h3 className="font-semibold mb-2">Projected Net Value (per year)</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ left: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}