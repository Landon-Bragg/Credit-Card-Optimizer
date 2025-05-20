import { cards } from "@/lib/sampleData";
import CardDetail from "@/components/CardDetail";

export default function CardPage({ params }: { params: { id: string } }) {
  const card = cards.find((c) => c.id === params.id);
  if (!card) return <p className="text-center mt-20">Card not found.</p>;
  return <CardDetail card={card} />;
}