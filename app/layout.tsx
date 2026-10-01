import type { Metadata, Viewport } from "next";
import { Archivo, Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";
import { CornerMarks } from "@/components/CornerMarks";
import { GridDebug } from "@/components/GridDebug";
import { RevealRoot } from "@/components/RevealRoot";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SkipLink } from "@/components/SkipLink";
import { brand } from "@/config/brand";
import { allowIndexing, siteUrl } from "@/lib/site";
import "./globals.css";

/* Condensed grotesk for display. Not Inter, not Space Grotesk. */
const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

/* Body is a separate grotesque so paragraphs are not the display face. */
const sans = Archivo({
  subsets: ["latin"],
  weight: ["400"],
  preload: false,
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

/* cover: content may draw under the notch; env(safe-area-inset-*) keeps controls clear of it. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#100f0c",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: brand.name,
    template: `%s / ${brand.shortName}`,
  },
  description: brand.tagline,
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: brand.name,
    description: brand.tagline,
    url: "/",
  },
  twitter: {
    card: "summary",
    title: brand.name,
    description: brand.tagline,
  },
  robots: allowIndexing
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} ${mono.variable} ground-ink h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <SkipLink />
        <SiteHeader />
        <CornerMarks />
        {process.env.NODE_ENV === "development" ? <GridDebug /> : null}
        <noscript>
          <style>{"[data-reveal]{visibility:visible!important}"}</style>
        </noscript>
        {children}
        <ScrollToTop />
        <RevealRoot />
        <SiteFooter />
      </body>
    </html>
  );
}
