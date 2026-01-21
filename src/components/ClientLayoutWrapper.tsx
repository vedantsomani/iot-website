"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Terminal from "@/components/Terminal";

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isMicrosite = pathname?.startsWith("/events/rewire");

    return (
        <>
            <Terminal />
            {!isMicrosite && <Navbar />}
            <main className={`flex-grow ${!isMicrosite ? "pt-16" : ""}`}>{children}</main>
            {!isMicrosite && <Footer />}
        </>
    );
}
