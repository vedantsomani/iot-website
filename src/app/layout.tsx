import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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

export const metadata: Metadata = {
  title: "IoT & Robotics Club | Bennett University",
  description:
    "The official website of the IoT & Robotics Club at Bennett University. Innovation, Automation, and Technology.",
  keywords: ["IoT", "Robotics", "Bennett University", "Club", "Engineering", "Technology"],
  openGraph: {
    title: "IoT & Robotics Club | Bennett University",
    description: "Innovation, Automation, and Technology.",
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
      lang="en"
      className={`${orbitron.variable} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-grow pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
