import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-blue disabled:opacity-50 disabled:pointer-events-none active:scale-95",
    {
        variants: {
            variant: {
                default: "bg-neon-blue text-black hover:bg-white hover:text-black hover:scale-105 shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_25px_rgba(0,243,255,0.5)]",
                outline: "border border-white/20 text-white hover:border-neon-purple hover:text-neon-purple bg-transparent",
                ghost: "text-gray-400 hover:text-white hover:bg-white/5",
                link: "text-neon-blue hover:text-white underline-offset-4 hover:underline p-0 h-auto",
                glow: "bg-neon-purple text-white shadow-[0_0_15px_rgba(188,19,254,0.3)] hover:bg-neon-purple/90 hover:shadow-[0_0_25px_rgba(188,19,254,0.5)]",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 px-4 text-xs",
                lg: "h-14 px-8 text-base",
                icon: "h-10 w-10",
            },
            font: {
                sans: "font-sans",
                orbitron: "font-orbitron tracking-wider",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            font: "sans",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, font, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, font, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
