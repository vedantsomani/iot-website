"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, ArrowRight, Zap } from 'lucide-react';

export default function RecruitmentBanner() {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="relative w-full z-[100] bg-gradient-to-r from-neon-blue/20 via-neon-purple/20 to-neon-blue/20 backdrop-blur-md border-b border-white/10"
            >
                <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
                    <div className="flex-1 flex items-center justify-center gap-2 text-sm md:text-base text-white">
                        <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
                        <span className="font-orbitron font-bold tracking-wide">RECRUITMENT 2026 IS LIVE!</span>
                        <span className="hidden md:inline text-white/70">- Join the elite tech society of Bennett University.</span>
                        <Link
                            href="/join"
                            className="inline-flex items-center gap-1 ml-2 font-bold text-neon-blue hover:text-white transition-colors border-b border-neon-blue/50 hover:border-white"
                        >
                            APPLY NOW <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Close banner"
                    >
                        <X className="w-4 h-4 text-white/70" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
