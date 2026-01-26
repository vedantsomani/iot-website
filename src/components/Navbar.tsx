"use client";

import Image from "next/image";
import { Nav } from "@/components/nav";

// Navigation items - DO NOT CHANGE ORDER OR LABELS
const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Members", href: "/members" },
    { name: "Events", href: "/events" },
    { name: "Achievements", href: "/achievements" },
    { name: "Projects", href: "/projects" },
    { name: "Tutorials", href: "/tutorials" },
    { name: "Gallery", href: "/gallery" },
    { name: "Join", href: "/join" },
    { name: "Contact", href: "/contact" },
];

export default function Navbar() {
    return (
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
                    IoT &amp; Robotics <span className="text-neon-blue">Club</span>
                </span>
            </Nav.Brand>

            {/* Desktop Navigation with Active Pill */}
            <Nav.List />

            {/* Mobile Toggle */}
            <Nav.MobileToggle />

            {/* Mobile Menu (Side Panel) */}
            <Nav.MobileMenu />
        </Nav.Root>
    );
}
