"use client";

import { useEffect, useState } from "react";

export default function SystemCrash() {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + "." : ""));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 z-[99999] bg-blue-900 text-white font-mono p-8 flex flex-col items-start justify-center select-none cursor-none">
            <h1 className="text-4xl md:text-6xl mb-8">:(</h1>
            <p className="text-lg md:text-2xl mb-4">
                Your PC ran into a problem and needs to restart. We're just collecting
                some error info, and then you can restart.
            </p>
            <p className="text-lg md:text-2xl mb-8">0% complete{dots}</p>

            <div className="mt-8 text-sm md:text-base opacity-80">
                <p>Stop code: MANUALLY_INITIATED_CRASH</p>
                <p>What failed: IOT_CORE_SYSTEM.SYS</p>
                <p className="mt-4 text-xs select-text cursor-text">Error Trace: 0x0000000_sys_admin_key_found</p>
            </div>

            <style jsx global>{`
        body {
            overflow: hidden !important;
            background-color: #1e3a8a !important; 
        }
      `}</style>
        </div>
    );
}
