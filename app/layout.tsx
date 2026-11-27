import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";
import FeedbackGate from "@/components/FeedbackGate";

const inter = Inter_Tight({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Ceramic Coating & Paint Correction in Cheshire | Prestige Cheshire Detailing",
  description:
    "Mobile ceramic coatings, paint correction and detailing for cars, vans and motorbikes across Cheshire, the North West and North Wales. We bring our own water. Appointment only.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  icons: { icon: "/mark.svg" },
};

export const viewport: Viewport = { themeColor: "#0a0a0a", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={inter.variable}>
      <body>
        {children}
        <FeedbackGate />
      </body>
    </html>
  );
}
