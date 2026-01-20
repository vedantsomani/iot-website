"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function MissionTimer({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(targetDate).getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="flex gap-4 md:gap-8 justify-center py-6">
            <TimeUnit value={timeLeft.days} label="DAYS" color="text-neon-blue" />
            <div className="text-2xl md:text-4xl font-bold text-white/20 self-start mt-2">:</div>
            <TimeUnit value={timeLeft.hours} label="HOURS" color="text-neon-purple" />
            <div className="text-2xl md:text-4xl font-bold text-white/20 self-start mt-2">:</div>
            <TimeUnit value={timeLeft.minutes} label="MINS" color="text-green-400" />
            <div className="text-2xl md:text-4xl font-bold text-white/20 self-start mt-2">:</div>
            <TimeUnit value={timeLeft.seconds} label="SECS" color="text-red-500" />
        </div>
    );
}

function TimeUnit({ value, label, color }: { value: number; label: string; color: string }) {
    return (
        <div className="flex flex-col items-center">
            <motion.div
                key={value}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`text-3xl md:text-5xl font-mono font-bold ${color}`}
            >
                {value.toString().padStart(2, '0')}
            </motion.div>
            <div className="text-[10px] md:text-xs text-gray-500 tracking-widest mt-2">{label}</div>
        </div>
    );
}
