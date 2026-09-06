import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  applicationName: "Thottathil Gold Vault",
  title: "Thottathil Gold Vault — Swarna Nidhi 11+1",
  description:
    "Thottathil Fashion Jewellery's Gold Recurring Savings. Save monthly, watch your gold grow gram by gram.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TFJ Vault",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#04070e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
