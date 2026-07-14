import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  AnalyticsNoScript,
  AnalyticsProviders,
} from "@/components/analytics/analytics-providers";
import { SITE_ORIGIN } from "@/lib/site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "Buzz Café",
    template: "%s | Buzz Café",
  },
  description:
    "Cafeteria no Brás para pedir café da manhã, cafés, croissants, doces, salgados e combos perto do Pari.",
  applicationName: "Buzz Café",
  openGraph: {
    siteName: "Buzz Café",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AnalyticsNoScript />
        {children}
        <AnalyticsProviders />
      </body>
    </html>
  );
}
