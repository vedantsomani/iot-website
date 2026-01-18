"use client";

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [isRobotEye, setIsRobotEye] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Only show custom cursor on non-touch devices
        const isTouchDevice = 'ontouchstart' in window;
        if (isTouchDevice) return;

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            setIsVisible(true);
        };

        const handleMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check for interactive elements
            if (target.closest('a, button, [data-cursor-hover]')) {
                setIsHovering(true);
            }

            // Check for member cards (robot eye effect)
            if (target.closest('[data-cursor-robot]')) {
                setIsRobotEye(true);
                setIsHovering(true);
            }
        };

        const handleMouseLeave = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            if (target.closest('a, button, [data-cursor-hover]')) {
                setIsHovering(false);
            }

            if (target.closest('[data-cursor-robot]')) {
                setIsRobotEye(false);
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        document.addEventListener('mouseover', handleMouseEnter);
        document.addEventListener('mouseout', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseover', handleMouseEnter);
            document.removeEventListener('mouseout', handleMouseLeave);
        };
    }, [cursorX, cursorY]);

    if (!isVisible) return null;

    return (
        <>
            {/* Main cursor dot */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            >
                <motion.div
                    className="relative flex items-center justify-center"
                    animate={{
                        scale: isHovering ? 2.5 : 1,
                        opacity: isRobotEye ? 0 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                >
                    <div className="w-3 h-3 bg-white rounded-full" />
                </motion.div>
            </motion.div>

            {/* Robot eye cursor (for member cards) */}
            {isRobotEye && (
                <motion.div
                    className="fixed top-0 left-0 pointer-events-none z-[9999]"
                    style={{
                        x: cursorXSpring,
                        y: cursorYSpring,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                >
                    <div className="relative -translate-x-1/2 -translate-y-1/2">
                        {/* Robot eye design */}
                        <div className="w-10 h-10 rounded-full bg-black border-2 border-neon-blue flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.5)]">
                            <motion.div
                                className="w-4 h-4 rounded-full bg-neon-blue"
                                animate={{
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </div>
                        {/* Scan line effect */}
                        <motion.div
                            className="absolute inset-0 rounded-full border border-neon-blue/50"
                            animate={{
                                scale: [1, 1.5],
                                opacity: [0.5, 0],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeOut"
                            }}
                        />
                    </div>
                </motion.div>
            )}

            {/* Hide default cursor */}
            <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
        </>
    );
}
