"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isMicrosite = pathname?.startsWith("/events/ideathon-2026");

    return (
        <>
            {!isMicrosite && <Navbar />}
            <main className={`flex-grow ${!isMicrosite ? "pt-16" : ""}`}>{children}</main>
            {!isMicrosite && <Footer />}
        </>
    );
}
