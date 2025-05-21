"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import type { CardResult } from "@/lib/rewardCalculator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function CardGrid({ results }: { results: CardResult[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {results.map((result, index) => (
        <motion.div
          key={result.card.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/50 p-6 backdrop-blur transition-all hover:border-primary/50 hover:shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <img
                  src={result.card.image || "/placeholder.svg?height=40&width=40"}
                  alt={result.card.name}
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <h3 className="font-medium">{result.card.name}</h3>
                <p className="text-xs text-muted-foreground">{result.card.issuer}</p>
              </div>
            </div>
            <Badge variant={index === 0 ? "default" : "outline"}>{index === 0 ? "Best" : `#${index + 1}`}</Badge>
          </div>

          <div className="space-y-2 text-sm">
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
              <span className="text-muted-foreground">Net Annual</span>
              <span className="font-medium">${result.netAnnual}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="ghost" size="sm" className="gap-1">
              Details <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
