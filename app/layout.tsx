import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CardOptimizer",
  description: "Find the best credit‑card rewards for your spending pattern",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "bg-background text-foreground min-h-screen")}>        
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">{children}</main>
      </body>
    </html>
  );
}