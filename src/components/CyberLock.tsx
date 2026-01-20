"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export function CyberLock() {
    return (
        <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center">
            {/* Outer Ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-neon-blue/30 rounded-full border-t-neon-blue border-r-transparent"
            />

            {/* Middle Ring (Counter-rotating) */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 border-2 border-neon-purple/30 rounded-full border-b-neon-purple border-l-transparent"
            />

            {/* Inner Ring */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-16 border border-white/20 rounded-full border-dashed"
            />

            {/* Core Lock Icon */}
            <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative z-10 p-6 bg-black/50 backdrop-blur-sm rounded-2xl border border-neon-blue/50 shadow-[0_0_30px_rgba(0,212,255,0.3)]"
            >
                <Lock className="w-16 h-16 text-neon-blue" />
            </motion.div>

            {/* Glitch Overlay effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-neon-blue/20" />
                <div className="absolute left-1/2 top-0 h-full w-[1px] bg-neon-purple/20" />
            </div>

            {/* Decorative Numbers */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-neon-blue animate-pulse">
                ACCESS_LOCKED
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-neon-purple animate-pulse">
                ENCRYPTION_LVL_4
            </div>
        </div>
    );
}
