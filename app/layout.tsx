import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono, Tinos } from "next/font/google";
import "./globals.css";
import FeedbackGate from "@/components/FeedbackGate";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const logoSerif = Tinos({ subsets: ["latin"], weight: ["700"], variable: "--font-logo", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Prestige Cheshire Detailing | Machine polishing & Gyeon ceramic coatings",
  description:
    "Mobile detailing across Cheshire, the North West and North Wales: machine polishing to remove fine scratches and Gyeon ceramic coatings for cars, vans and motorbikes. We bring our own water. Appointment only.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  icons: { icon: "/mark.svg" },
};

export const viewport: Viewport = { themeColor: "#08080a", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${archivo.variable} ${mono.variable} ${logoSerif.variable}`}>
      <body>
        {children}
        <FeedbackGate />
      </body>
    </html>
  );
}
