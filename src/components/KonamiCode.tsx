"use client";

import { useEffect, useState } from 'react';

export default function KonamiCode() {
    const [active, setActive] = useState(false);
    const konamiCode = [
        "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
        "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
        "b", "a"
    ];
    const [input, setInput] = useState<string[]>([]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            setInput(prev => {
                const updated = [...prev, e.key];
                if (updated.length > konamiCode.length) {
                    updated.shift();
                }

                if (updated.join('') === konamiCode.join('')) {
                    setActive(prev => !prev);
                    return [];
                }
                return updated;
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!active) return null;

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none mix-blend-difference overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-10 animate-pulse" />
            <style jsx global>{`
                body {
                    filter: invert(1) hue-rotate(180deg);
                    transform: rotate(1deg);
                    transition: all 0.5s ease;
                    overflow-x: hidden;
                }
                * {
                     animation: glitch 0.3s infinite;
                }
                @keyframes glitch {
                    0% { transform: translate(0) }
                    20% { transform: translate(-2px, 2px) }
                    40% { transform: translate(-2px, -2px) }
                    60% { transform: translate(2px, 2px) }
                    80% { transform: translate(2px, -2px) }
                    100% { transform: translate(0) }
                }
            `}</style>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="text-9xl font-black text-red-600 tracking-widest uppercase">HACKED</div>
                <div className="text-2xl font-mono text-green-500 bg-black p-2 mt-4 font-bold border border-green-500 animate-bounce">
                    SECRET CODE: konami_god
                </div>
            </div>
        </div>
    );
}
