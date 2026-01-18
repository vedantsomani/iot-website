"use client";

import { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

interface PageTransitionProps {
    children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                    duration: 0.3,
                    ease: [0.25, 0.1, 0.25, 1],
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

// Overlay transition for more dramatic page changes
export function PageTransitionOverlay({ children }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div key={pathname}>
                {/* Page content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    {children}
                </motion.div>

                {/* Overlay animation */}
                <motion.div
                    className="fixed inset-0 z-[100] bg-neon-blue pointer-events-none"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 0 }}
                    exit={{ scaleY: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ originY: 0 }}
                />
                <motion.div
                    className="fixed inset-0 z-[100] bg-neon-blue pointer-events-none"
                    initial={{ scaleY: 1 }}
                    animate={{ scaleY: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    style={{ originY: 1 }}
                />
            </motion.div>
        </AnimatePresence>
    );
}
