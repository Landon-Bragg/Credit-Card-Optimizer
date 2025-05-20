import { CreditCard } from "@/lib/sampleData";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BadgeDollarSign, Gift, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function CardDetail({ card }: { card: CreditCard }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl shadow-lg p-6 bg-card"
    >
      <header className="flex items-center gap-4 mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={card.image} alt={card.name} className="h-12 w-12 rounded" />
        <div>
          <h2 className="text-xl font-semibold">{card.name}</h2>
          <p className="text-sm text-muted-foreground">{card.issuer}</p>
        </div>
      </header>

      <Tabs defaultValue="rewards">
        <TabsList className="grid grid-cols-3 w-full mb-4">
          <TabsTrigger value="rewards">
            <BadgeDollarSign size={16} className="mr-1" /> Rewards
          </TabsTrigger>
          <TabsTrigger value="bonus">
            <Gift size={16} className="mr-1" /> Bonus
          </TabsTrigger>
          <TabsTrigger value="info">
            <Info size={16} className="mr-1" /> Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rewards">
          <pre className="bg-muted/40 p-3 rounded text-sm whitespace-pre-wrap">
            {JSON.stringify(card.rewardStructure, null, 2)}
          </pre>
        </TabsContent>
        <TabsContent value="bonus">
          {card.signupBonus ? (
            <p>
              {card.signupBonus.amount.toLocaleString()} points after spending $
              {card.signupBonus.spendRequirement.toLocaleString()} in {card.signupBonus.months} months.
            </p>
          ) : (
            <p>No public signup bonus.</p>
          )}
          <ul className="list-disc list-inside mt-2 text-sm space-y-1">
            {card.benefits.map((b) => (
              <li key={b.description}>{b.description} (≈${b.value}/yr)</li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="info">
          <p className="text-sm whitespace-pre-wrap">{card.disclaimer ?? "No additional notes."}</p>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
