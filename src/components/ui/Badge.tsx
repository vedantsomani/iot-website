import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
    {
        variants: {
            variant: {
                default: "border-transparent bg-neon-blue/20 text-neon-blue backdrop-blur-md border border-neon-blue/20",
                secondary: "border-transparent bg-neon-purple/20 text-neon-purple backdrop-blur-md border border-neon-purple/20",
                outline: "text-foreground border border-white/20",
                destructive: "border-transparent bg-red-500/20 text-red-500 border border-red-500/20",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
