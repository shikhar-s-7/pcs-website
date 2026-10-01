import type { Metadata } from "next";
import { Archivo, Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";
import { CornerMarks } from "@/components/CornerMarks";
import { brand } from "@/config/brand";
import "./globals.css";

/* Condensed grotesk for display. Not Inter, not Space Grotesk. */
const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

/* Body is a separate grotesque so paragraphs are not the display face. */
const sans = Archivo({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-archivo",
  display: "swap",
});

/* Figures, labels, and indexes. Tabular figures stay aligned in tables. */
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: brand.name,
    template: `%s / ${brand.shortName}`,
  },
  description: brand.tagline,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <CornerMarks />
        {children}
      </body>
    </html>
  );
}
