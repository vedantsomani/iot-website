import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SecurityProvider from "@/components/SecurityProvider";

import ClientLayoutWrapper from "@/components/ClientLayoutWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="antialiased min-h-screen flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <SecurityProvider>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </SecurityProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
