"use client";

import Image from "next/image";
import { Nav } from "@/components/nav";
import { useState } from "react";
import { X, ExternalLink } from "lucide-react";

// Navigation items - DO NOT CHANGE ORDER OR LABELS
const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Members", href: "/members" },
    { name: "Events", href: "/events" },
    { name: "Achievements", href: "/achievements" },
    { name: "Projects", href: "/projects" },
    { name: "Gallery", href: "/gallery" },
    { name: "Join", href: "/join" },
    { name: "Contact", href: "/contact" },
];

export default function Navbar() {
    const [showBanner, setShowBanner] = useState(true);

    return (
        <>
            {/* Announcement Banner */}
            {showBanner && (
                <div className="bg-accent-warm/10 border-b border-accent-warm/20 px-4 py-2 text-center text-sm relative z-[60]">
                    <a
                        href="https://gtr-2026.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/90 hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                        🏁 <span className="font-semibold">Grand Theft Racing 2026</span> — Registrations Open
                        <span className="ml-2 underline hidden sm:inline">Register Now →</span>
                    </a>
                    <button
                        onClick={() => setShowBanner(false)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                        aria-label="Dismiss announcement"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <Nav.Root items={navItems}>
                {/* Brand */}
                <Nav.Brand className="flex items-center shrink-0">
                    <Image
                        src="/logo-iot.png"
                        alt="IoT & Robotics Club Logo"
                        width={110}
                        height={110}
                        className="relative"
                    />
                    <span className="text-lg md:text-xl font-bold whitespace-nowrap -ml-3">
                        IoT &amp; Robotics <span className="text-accent-primary">Club</span>
                    </span>
                </Nav.Brand>

                {/* Desktop Navigation with Active Pill */}
                <Nav.List />

                {/* Mobile Toggle */}
                <Nav.MobileToggle />

                {/* Mobile Menu (Side Panel) */}
                <Nav.MobileMenu />
            </Nav.Root>
        </>
    );
}
