"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface ProjectBlueprintProps {
    title: string;
    description: string;
    image: string; // URL
    tech: string[];
}

export default function ProjectBlueprint({ title, description, image, tech }: ProjectBlueprintProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative w-full aspect-video border-2 border-blue-500/50 bg-blue-900/10 overflow-hidden group cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Grid Background */}
            <div className="absolute inset-0 z-0 opacity-20"
                style={{ backgroundImage: 'linear-gradient(#4299e1 1px, transparent 1px), linear-gradient(90deg, #4299e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />

            {/* Content Container */}
            <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end transition-all duration-500">

                {/* Tech Specs (Top Right) */}
                <div className="absolute top-4 right-4 text-right font-mono text-xs text-blue-300">
                    {tech.map((t, i) => (
                        <div key={i}>[{t.toUpperCase()}]</div>
                    ))}
                    <div className="mt-2 text-blue-400">STATUS: PROTOTYPE</div>
                </div>

                {/* Title & Desc */}
                <motion.div
                    initial={{ y: 20, opacity: 0.8 }}
                    animate={{ y: isHovered ? 0 : 20, opacity: 1 }}
                    className="bg-black/60 p-4 border-l-4 border-blue-500 backdrop-blur-sm"
                >
                    <h3 className="text-xl font-bold text-blue-100 font-mono tracking-wider">{title}</h3>
                    <p className={`text-sm text-blue-200 mt-2 transition-all duration-300 ${isHovered ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                        {description}
                    </p>
                </motion.div>
            </div>

            {/* Image Layer - Blueprint Mode (Default) */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover grayscale contrast-150 brightness-50 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-blue-900/60 mix-blend-overlay" />
            </div>

            {/* Image Layer - Real Mode (Hover) */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Decorative Corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-400" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-400" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-400" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-400" />
        </div>
    );
}
