"use client";

import { ReactNode, useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';

interface ScrollRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
    duration?: number;
}

export default function ScrollReveal({
    children,
    className = '',
    delay = 0,
    direction = 'up',
    duration = 0.6,
}: ScrollRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    const getInitialPosition = () => {
        switch (direction) {
            case 'up':
                return { y: 50, x: 0 };
            case 'down':
                return { y: -50, x: 0 };
            case 'left':
                return { x: 50, y: 0 };
            case 'right':
                return { x: -50, y: 0 };
            case 'none':
                return { x: 0, y: 0 };
            default:
                return { y: 50, x: 0 };
        }
    };

    const variants: Variants = {
        hidden: {
            opacity: 0,
            ...getInitialPosition(),
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1],
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={variants}
        >
            {children}
        </motion.div>
    );
}

// Stagger container for multiple children
interface StaggerContainerProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
}

export function StaggerContainer({
    children,
    className = '',
    staggerDelay = 0.1,
}: StaggerContainerProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
                delayChildren: 0.1,
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={containerVariants}
        >
            {children}
        </motion.div>
    );
}

// Stagger item to be used inside StaggerContainer
interface StaggerItemProps {
    children: ReactNode;
    className?: string;
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
            },
        },
    };

    return (
        <motion.div className={className} variants={itemVariants}>
            {children}
        </motion.div>
    );
}
