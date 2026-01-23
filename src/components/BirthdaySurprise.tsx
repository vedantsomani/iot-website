"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Trophy, Star, Heart, Cpu, CircuitBoard } from 'lucide-react';
import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface BirthdaySurpriseProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BirthdaySurprise({ isOpen, onClose }: BirthdaySurpriseProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isOpen && mounted) {
            const animationEnd = Date.now() + 5000;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

            const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

            const interval = setInterval(() => {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    clearInterval(interval);
                    return;
                }

                const particleCount = 50 * (timeLeft / 5000);

                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                });
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                });
            }, 250);

            return () => clearInterval(interval);
        }
    }, [isOpen, mounted]);

    if (!mounted) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 md:p-8"
                >
                    {/* Background Glows */}
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/20 blur-[120px] rounded-full animate-pulse delay-700" />

                    <motion.div
                        initial={{ scale: 0.8, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: 20 }}
                        className="relative w-full max-w-5xl bg-gradient-to-b from-white/10 to-transparent border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all z-50"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 p-8 md:p-12">
                            {/* Photo Container */}
                            <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="relative group shrink-0"
                            >
                                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-red-500 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-2xl overflow-hidden border-2 border-white/20">
                                    <Image
                                        src="/birthday.jpeg"
                                        alt="President Rudrakshi Rai"
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className="absolute -top-4 -right-4 bg-yellow-400 p-3 rounded-full shadow-lg z-10"
                                >
                                    <Trophy className="w-6 h-6 text-black" />
                                </motion.div>

                                {/* Floating IoT Icons */}
                                <motion.div
                                    animate={{ y: [0, -20, 0], rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                                    className="absolute -bottom-6 -left-6 text-blue-400 opacity-50"
                                >
                                    <Cpu className="w-12 h-12" />
                                </motion.div>
                                <motion.div
                                    animate={{ y: [0, 20, 0], rotate: -360 }}
                                    transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
                                    className="absolute top-1/2 -right-12 text-purple-400 opacity-50"
                                >
                                    <CircuitBoard className="w-10 h-10" />
                                </motion.div>
                            </motion.div>

                            {/* Content */}
                            <div className="flex-1 text-center md:text-left space-y-6">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <h2 className="text-yellow-400 font-bold tracking-widest text-sm md:text-base uppercase mb-2">HAPPY BIRTHDAY</h2>
                                    <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                                        President <br />
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-white to-yellow-200 animate-gradient">
                                            Rudrakshi Rai
                                        </span>
                                    </h1>
                                </motion.div>

                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="text-gray-300 text-lg md:text-xl font-medium"
                                >
                                    The &ldquo;Best&rdquo; Leader &amp; Visionary of Bennett University&apos;s IoT Club.
                                    Thank you for your incredible contribution!
                                </motion.p>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="flex flex-wrap justify-center md:justify-start gap-4"
                                >
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span>Exemplary Leadership</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white text-sm">
                                        <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                                        <span>Club Hero</span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="pt-4"
                                >
                                    <div className="bg-yellow-400/10 border border-yellow-400/20 p-4 rounded-xl">
                                        <p className="text-yellow-400 font-mono text-sm italic">
                                            &ldquo;Leadership is the capacity to translate vision into reality.&rdquo;
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
