import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
    className?: string;
    spacing?: "none" | "small" | "default" | "large";
}

export function Section({
    children,
    className,
    spacing = "default",
    ...props
}: SectionProps) {
    return (
        <section
            className={cn(
                "relative w-full",
                {
                    "py-0": spacing === "none",
                    "py-12 md:py-16": spacing === "small",
                    "py-16 md:py-24": spacing === "default",
                    "py-24 md:py-32": spacing === "large",
                },
                className
            )}
            {...props}
        >
            {children}
        </section>
    );
}
