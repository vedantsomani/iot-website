"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChromaGridProps {
    children: React.ReactNode;
    columns?: number;
    className?: string;
}

export default function ChromaGrid({ children, columns = 3, className }: ChromaGridProps) {
    return (
        <div
            className={cn(
                "grid gap-4",
                "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", // Default responsive grid
                className
            )}
            style={{
                "--columns": columns
            } as React.CSSProperties}
        >
            {React.Children.map(children, (child, i) => (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className="relative group"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl blur opacity-20 group-hover:opacity-75 transition duration-500 group-hover:duration-200" />
                    <div className="relative h-full">
                        {child}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
