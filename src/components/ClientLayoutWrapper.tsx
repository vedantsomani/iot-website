"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Terminal from "@/components/Terminal";
import SystemCrash from "@/components/SystemCrash";
import { useEffect, useState } from "react";

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isMicrosite = pathname?.startsWith("/events/rewire");
    const [crashed, setCrashed] = useState(false);

    useEffect(() => {
        // Check for persistent crash state
        const isDestroyed = sessionStorage.getItem('system_failure');
        if (isDestroyed === 'true') {
            setCrashed(true);
        }
        // Easter egg for developers
        console.log('%c🔐 SECRET CODE: matrix_master', 'color: lime; font-size: 16px; font-weight: bold;');
    }, []);

    if (crashed) {
        return <SystemCrash />;
    }

    return (
        <>
            <Terminal />
            {!isMicrosite && <Navbar />}
            <main className={`flex-grow ${!isMicrosite ? "pt-16" : ""}`}>{children}</main>
            {!isMicrosite && <Footer />}
        </>
    );
}
