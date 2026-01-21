"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface NavItem {
    name: string;
    href: string;
}

interface NavContextValue {
    items: NavItem[];
    activeIndex: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    scrolled: boolean;
}

// ============================================================================
// Context
// ============================================================================

const NavContext = createContext<NavContextValue | null>(null);

function useNav() {
    const ctx = useContext(NavContext);
    if (!ctx) throw new Error("Nav components must be used within NavRoot");
    return ctx;
}

// ============================================================================
// Hooks
// ============================================================================

/** Adds shadow class when scrolled past threshold - OPTIMIZED */
function useScrollShadow(threshold = 8): boolean {
    const [scrolled, setScrolled] = useState(false);
    const scrolledRef = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > threshold;
            // Only update state if value actually changed
            if (scrolledRef.current !== isScrolled) {
                scrolledRef.current = isScrolled;
                setScrolled(isScrolled);
            }
        };
        handleScroll(); // Check initial state
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);

    return scrolled;
}

/** Locks body scroll when mobile menu is open */
function useLockBodyScroll(lock: boolean) {
    useEffect(() => {
        if (lock) {
            const scrollY = window.scrollY;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = "100%";
            return () => {
                document.body.style.position = "";
                document.body.style.top = "";
                document.body.style.width = "";
                window.scrollTo(0, scrollY);
            };
        }
    }, [lock]);
}

/** Check if user prefers reduced motion */
function usePrefersReducedMotion(): boolean {
    const [prefersReduced, setPrefersReduced] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        setPrefersReduced(mq.matches);
        const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return prefersReduced;
}

// ============================================================================
// NavRoot - Provider
// ============================================================================

interface NavRootProps {
    items: NavItem[];
    children: React.ReactNode;
    className?: string;
}

export function NavRoot({ items, children, className }: NavRootProps) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const scrolled = useScrollShadow(8);

    // Compute activeIndex with robust matching
    const activeIndex = useMemo(() => {
        if (!pathname) return 0;
        // Exact match for home
        if (pathname === "/") return items.findIndex((i) => i.href === "/");
        // Prefix match for other routes
        const idx = items.findIndex(
            (i) => i.href !== "/" && pathname.startsWith(i.href)
        );
        return idx >= 0 ? idx : 0;
    }, [pathname, items]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Lock body scroll when mobile menu open
    useLockBodyScroll(isOpen);

    const value = useMemo(
        () => ({ items, activeIndex, isOpen, setIsOpen, scrolled }),
        [items, activeIndex, isOpen, scrolled]
    );

    return (
        <NavContext.Provider value={value}>
            <header
                className={cn(
                    "sticky top-0 z-50 w-full transition-shadow duration-200",
                    // Mobile: opaque bg (no blur for perf), Desktop: glass with blur
                    scrolled
                        ? "bg-black/90 md:bg-black/70 md:backdrop-blur-md shadow-lg"
                        : "bg-black/80 md:bg-black/50 md:backdrop-blur-sm",
                    "border-b border-white/10",
                    className
                )}
            >
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {children}
                    </div>
                </div>
            </header>
        </NavContext.Provider>
    );
}

// ============================================================================
// NavBrand
// ============================================================================

interface NavBrandProps {
    children: React.ReactNode;
    href?: string;
    className?: string;
}

export function NavBrand({ children, href = "/", className }: NavBrandProps) {
    return (
        <Link
            href={href}
            className={cn(
                "text-lg md:text-xl font-bold font-orbitron text-white z-50",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 rounded",
                className
            )}
        >
            {children}
        </Link>
    );
}

// ============================================================================
// NavList (Desktop) with Active Pill
// ============================================================================

interface NavListProps {
    className?: string;
}

export function NavList({ className }: NavListProps) {
    const { items, activeIndex } = useNav();
    const prefersReduced = usePrefersReducedMotion();

    return (
        <nav
            className={cn("hidden md:block", className)}
            aria-label="Main navigation"
        >
            <ul className="relative flex items-center gap-1 p-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-sm">
                {items.map((item, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <li key={item.href} className="relative">
                            {/* Active Pill (behind link) */}
                            {isActive && (
                                <motion.div
                                    layoutId={prefersReduced ? undefined : "nav-active-pill"}
                                    className={cn(
                                        "absolute inset-0 rounded-full bg-neon-blue",
                                        !prefersReduced && "shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                                    )}
                                    transition={
                                        prefersReduced
                                            ? { duration: 0 }
                                            : { type: "spring", stiffness: 400, damping: 30 }
                                    }
                                />
                            )}
                            {/* Link */}
                            <Link
                                href={item.href}
                                className={cn(
                                    "relative z-10 block px-4 py-2 text-sm font-medium rounded-full transition-colors duration-150",
                                    isActive
                                        ? "text-black font-semibold"
                                        : "text-white/70 hover:text-white hover:bg-white/5",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                                )}
                            >
                                {item.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}

// ============================================================================
// NavMobileToggle
// ============================================================================

interface NavMobileToggleProps {
    className?: string;
}

export function NavMobileToggle({ className }: NavMobileToggleProps) {
    const { isOpen, setIsOpen } = useNav();

    return (
        <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="nav-mobile-menu"
            className={cn(
                "md:hidden p-2 text-white rounded-lg",
                "hover:bg-white/10 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60",
                className
            )}
        >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
    );
}

// ============================================================================
// NavMobileMenu (Accessible Side Panel)
// ============================================================================

interface NavMobileMenuProps {
    className?: string;
}

export function NavMobileMenu({ className }: NavMobileMenuProps) {
    const { items, activeIndex, isOpen, setIsOpen } = useNav();
    const prefersReduced = usePrefersReducedMotion();
    const menuRef = useRef<HTMLDivElement>(null);
    const firstLinkRef = useRef<HTMLAnchorElement>(null);

    // Handle Escape key
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [isOpen, setIsOpen]);

    // Focus first link when opened
    useEffect(() => {
        if (isOpen && firstLinkRef.current) {
            firstLinkRef.current.focus();
        }
    }, [isOpen]);

    // Click outside to close
    const handleOverlayClick = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    return (
        <AnimatePresence initial={false}>
            {isOpen && (
                <>
                    {/* Overlay - no blur for mobile perf */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={prefersReduced ? { duration: 0 } : { duration: 0.15 }}
                        className="md:hidden fixed inset-0 z-40 bg-black/80"
                        onClick={handleOverlayClick}
                        aria-hidden="true"
                    />

                    {/* Panel */}
                    <motion.nav
                        ref={menuRef}
                        id="nav-mobile-menu"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Mobile navigation"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={
                            prefersReduced
                                ? { duration: 0 }
                                : { type: "spring", stiffness: 400, damping: 40 }
                        }
                        className={cn(
                            "md:hidden fixed right-0 top-0 bottom-0 z-50 w-72",
                            "bg-black border-l border-white/10",
                            "flex flex-col",
                            className
                        )}
                    >
                        {/* Close Button */}
                        <div className="flex justify-end p-4">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                aria-label="Close menu"
                                className="p-2 text-white rounded-lg hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Links */}
                        <ul className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                            {items.map((item, index) => {
                                const isActive = index === activeIndex;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            ref={index === 0 ? firstLinkRef : undefined}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={cn(
                                                "block px-4 py-3 rounded-lg text-base font-medium transition-all",
                                                isActive
                                                    ? "bg-neon-blue/20 text-neon-blue border-l-4 border-neon-blue"
                                                    : "text-white/70 hover:text-white hover:bg-white/5",
                                                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60"
                                            )}
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </motion.nav>
                </>
            )}
        </AnimatePresence>
    );
}

// ============================================================================
// Default Export for convenience
// ============================================================================

export const Nav = {
    Root: NavRoot,
    Brand: NavBrand,
    List: NavList,
    MobileToggle: NavMobileToggle,
    MobileMenu: NavMobileMenu,
};

export default Nav;
