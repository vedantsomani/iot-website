import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron, Space_Grotesk } from "next/font/google";
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

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IoT & Robotics Club — Bennett University",
  description: "43 members building robots, flying drones, and shipping projects. Bennett University's student-run tech club.",
  metadataBase: new URL("https://iot-robotics-bu.vercel.app"),
  openGraph: {
    title: "IoT & Robotics Club — Bennett University",
    description: "43 members building robots, flying drones, and shipping projects.",
    url: "https://iot-robotics-bu.vercel.app",
    siteName: "IoT & Robotics Club",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo-iot.png",
        width: 192,
        height: 192,
        alt: "IoT & Robotics Club Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "IoT & Robotics Club | Bennett University",
    description: "Where innovation meets passion. Build smart devices, autonomous robots, and shape the future of technology.",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo-iot.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/logo-iot.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#050505" />
      </head>
      <body
        className="antialiased min-h-screen flex flex-col bg-background text-foreground"
        suppressHydrationWarning
      >
        <SecurityProvider>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </SecurityProvider>
      </body>
    </html>
  );
}
