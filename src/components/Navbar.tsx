"use client";

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
            <Nav.Brand>
                IoT &amp; Robotics <span className="text-neon-blue">Club</span>
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
