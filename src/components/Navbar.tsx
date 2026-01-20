"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import GooeyNav from "@/components/react-bits/GooeyNav";

// Consistent navigation items
const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Members", href: "/members" },
    { name: "Events", href: "/events" },
    { name: "Projects", href: "/projects" },
    { name: "Gallery", href: "/gallery" },
    { name: "Join", href: "/join" },
    { name: "Contact", href: "/contact" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-black/40 backdrop-blur-2xl border-b border-white/10 supports-[backdrop-filter]:bg-black/20 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Brand Logo */}
                    <Link href="/" className="text-lg md:text-2xl font-bold font-orbitron text-white z-50">
                        IoT & Robotics <span className="text-neon-blue">Club</span>
                    </Link>

                    {/* Desktop Navigation (GooeyNav) */}
                    <div className="hidden md:block">
                        <GooeyNav
                            navItems={navItems}
                            className="!bg-transparent !border-none"
                        />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-white p-2 z-50 focus:outline-none"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Dropdown */}
            {/* Uses absolute positioning to overlay content properly */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl py-4 px-4 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-neon-blue/10 hover:border-l-4 hover:border-neon-blue rounded-r-lg transition-all"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}
