import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    size?: "default" | "small" | "large";
}

export function Container({
    children,
    className,
    size = "default",
    ...props
}: ContainerProps) {
    return (
        <div
            className={cn(
                "mx-auto w-full px-4 sm:px-6 lg:px-8",
                {
                    "max-w-[1200px]": size === "default",
                    "max-w-[800px]": size === "small",
                    "max-w-[1400px]": size === "large",
                },
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
