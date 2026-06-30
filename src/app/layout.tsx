import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  metadataBase: new URL("https://buzzcafe.com.br"),
  title: {
    default: "Buzz Café",
    template: "%s | Buzz Café",
  },
  description:
    "Peça Buzz Café no delivery pelo iFood, Keeta ou 99 Food. Cafés, croissants, doces e combos para café da manhã, brunch ou pausa da tarde.",
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
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
