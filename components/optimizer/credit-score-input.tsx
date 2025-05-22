"use client"

import { useState, useEffect } from "react"
import { Info } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface CreditScoreInputProps {
  value: number | null
  onChange: (value: number | null) => void
}

export function CreditScoreInput({ value, onChange }: CreditScoreInputProps) {
  const [hasScore, setHasScore] = useState(value !== null)
  const [score, setScore] = useState(value ?? 700)

  useEffect(() => {
    onChange(hasScore ? score : null)
  }, [hasScore, score, onChange])

  // Credit score ranges
  const ranges = [
    { min: 300, max: 579, label: "Poor", color: "bg-red-500" },
    { min: 580, max: 669, label: "Fair", color: "bg-amber-500" },
    { min: 670, max: 739, label: "Good", color: "bg-green-500" },
    { min: 740, max: 850, label: "Excellent", color: "bg-emerald-500" },
  ]

  // Get current range
  const getCurrentRange = () => {
    return ranges.find((range) => score >= range.min && score <= range.max)
  }

  const currentRange = getCurrentRange()

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Credit Score</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info size={14} className="cursor-pointer text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-xs">
                Your credit score helps us recommend cards you're likely to qualify for. If you don't know your score,
                you can check it for free at sites like Credit Karma or Annual Credit Report.
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="has-credit-score" className="text-sm text-muted-foreground">
              I don't have a credit score yet
            </Label>
            <Switch id="has-credit-score" checked={!hasScore} onCheckedChange={(checked) => setHasScore(!checked)} />
          </div>
        </div>

        {hasScore ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Current Score:</span>
                <span className="font-medium">{score}</span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium",
                    currentRange?.color ? `${currentRange.color} text-white` : "bg-muted text-muted-foreground",
                  )}
                >
                  {currentRange?.label || "Unknown"}
                </span>
              </div>
            </div>

            <div className="relative pt-1">
              <div className="flex h-2 overflow-hidden rounded-full">
                {ranges.map((range) => (
                  <div
                    key={range.label}
                    className={cn("flex-1", range.color)}
                    style={{
                      width: `${((range.max - range.min + 1) / 551) * 100}%`,
                    }}
                  />
                ))}
              </div>
              <Slider
                min={300}
                max={850}
                step={1}
                value={[score]}
                onValueChange={([newValue]) => setScore(newValue)}
                className="mt-6"
              />
              <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                <span>300</span>
                <span>850</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-border/60 bg-muted/30 p-3 text-sm">
            <p>
              We'll show you cards that are suitable for people with no credit history. These cards can help you build
              credit.
            </p>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
