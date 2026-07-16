import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CVBoost AI — Optimisez votre CV avec l'intelligence artificielle",
  description:
    "Analysez, corrigez et adaptez votre CV a chaque offre d'emploi grace a l'IA. Score ATS, reecriture professionnelle, lettres de motivation generees automatiquement.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body bg-bg text-[#E7E9EE] antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
