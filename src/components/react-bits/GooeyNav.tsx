"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItem {
    name: string;
    href: string;
}

interface GooeyNavProps {
    navItems: NavItem[];
    className?: string;
}

export default function GooeyNav({ navItems, className }: GooeyNavProps) {
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState<string>("");

    useEffect(() => {
        // Find active tab based on pathname
        const current = navItems.find((item) => item.href === pathname || (pathname?.startsWith(item.href) && item.href !== '/'));
        if (current) {
            setActiveTab(current.name);
        } else if (pathname === '/') {
            setActiveTab("Home");
        }
    }, [pathname, navItems]);

    return (
        <div className={cn("relative", className)}>
            {/* SVG Filter Definition */}
            <svg className="absolute hidden">
                <defs>
                    <filter id="goo">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                        <feColorMatrix
                            in="blur"
                            mode="matrix"
                            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                            result="goo"
                        />
                        <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                    </filter>
                </defs>
            </svg>

            <div className="relative p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                {/* 1. Filtered Morphing Layer (Background Only) */}
                <div
                    className="absolute inset-0 flex items-center gap-1.5 p-2"
                    style={{ filter: "url(#goo)" }}
                >
                    {navItems.map((item) => {
                        const isActive = activeTab === item.name;
                        return (
                            <div
                                key={`bg-${item.name}`}
                                className="relative px-4 py-2"
                            >
                                <span className="opacity-0 text-sm font-medium">{item.name}</span> {/* Spacer */}
                                {isActive && (
                                    <motion.div
                                        layoutId="gooey-pill"
                                        className="absolute inset-0 bg-neon-blue rounded-full"
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 30
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* 2. Text Layer (Interactive, No Filter) */}
                <div className="relative z-10 flex items-center gap-1.5">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.name;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setActiveTab(item.name)}
                                className={cn(
                                    "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                                    isActive ? "text-black font-bold" : "text-gray-300 hover:text-white"
                                )}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
