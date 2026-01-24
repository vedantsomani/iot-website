"use client";

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Code, Palette, Users, Zap, Terminal, Cpu, Globe, Rocket, Star, ChevronRight, Megaphone, Video, Share2, Briefcase } from 'lucide-react';
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import ParticleBackground from "@/components/ParticleBackground";

const domains = [
    {
        icon: Cpu,
        title: "Tech Team",
        desc: "IoT, Robotics, Software, and AI. The builders of the future.",
        color: "text-neon-blue",
        border: "group-hover:border-neon-blue/50"
    },
    {
        icon: Star,
        title: "Research Team",
        desc: "Deep tech research, paper publication, and innovation.",
        color: "text-red-400",
        border: "group-hover:border-red-400/50"
    },
    {
        icon: Palette,
        title: "Design and Content",
        desc: "Graphic Design, Brand Identity, and Creative Writing.",
        color: "text-pink-400",
        border: "group-hover:border-pink-400/50"
    },
    {
        icon: Video,
        title: "Multimedia",
        desc: "Video editing, photography, and visual storytelling.",
        color: "text-purple-400",
        border: "group-hover:border-purple-400/50"
    },
    {
        icon: Share2,
        title: "Social Media",
        desc: "Content creation, digital marketing, and brand presence.",
        color: "text-orange-400",
        border: "group-hover:border-orange-400/50"
    },
    {
        icon: Briefcase,
        title: "Management",
        desc: "Event planning, logistics, and club operations.",
        color: "text-green-400",
        border: "group-hover:border-green-400/50"
    },
    {
        icon: Megaphone,
        title: "Public Relations",
        desc: "Sponsorships, outreach, and external communications.",
        color: "text-yellow-400",
        border: "group-hover:border-yellow-400/50"
    }
];

const benefits = [
    { title: "Real Projects", desc: "Work on deployed production apps and research papers.", icon: Rocket },
    { title: "Mentorship", desc: "Learn significantly faster from seniors and alumni.", icon: Users },
    { title: "Hackathons", desc: "Exclusive access to internal hackathons and funding.", icon: Terminal },
    { title: "Network", desc: "Connect with the brightest tech minds on campus.", icon: Globe },
];

export default function JoinPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const py = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <div className="min-h-screen bg-black relative" ref={containerRef}>
            <ParticleBackground />

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10" />

                <Container className="relative z-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-mono text-white/70 tracking-widest uppercase">Recruitment Open 2026</span>
                        </div>

                        <h1 className="text-6xl md:text-9xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-8 tracking-tighter">
                            BUILD <br />
                            <span className="text-stroke-white text-transparent">THE FUTURE</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
                            We are looking for the outliers. The builders. The designers.<br />
                            Join Bennett University's elite technical society.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Button asChild size="xl" className="h-14 px-8 text-lg bg-white text-black hover:bg-white/90 rounded-full font-bold tracking-wide shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                                <Link href="/join/apply">
                                    APPLY NOW <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="lg" className="text-white hover:text-white/80">
                                <Link href="#domains">
                                    Explore Roles
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </Container>
            </section>

            {/* Why Join? */}
            <Section className="relative z-20 bg-black/50 backdrop-blur-sm border-t border-white/5">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {benefits.map((b, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
                            >
                                <b.icon className="w-8 h-8 text-neon-blue mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold text-white mb-2">{b.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* Domains */}
            <Section id="domains" spacing="large">
                <Container>
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold font-orbitron text-white mb-6">DOMAINS</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">Find your place in the ecosystem. We recruit across multiple disciplines.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {domains.map((d, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className={`glass-panel p-8 rounded-2xl border border-white/10 hover:border-opacity-50 transition-all duration-300 group ${d.border}`}
                            >
                                <d.icon className={`w-12 h-12 ${d.color} mb-6`} />
                                <h3 className="text-2xl font-bold text-white mb-3">{d.title}</h3>
                                <p className="text-gray-400 mb-6">{d.desc}</p>
                                <div className="h-px w-full bg-white/5 group-hover:bg-white/20 transition-colors mb-6" />
                                <Link href="/join/apply" className="inline-flex items-center text-sm font-mono text-white/50 group-hover:text-white transition-colors">
                                    APPLY FOR THIS ROLE <ChevronRight className="w-4 h-4 ml-1" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* Bottom CTA */}
            <Section className="relative overflow-hidden py-32">
                <div className="absolute inset-0 bg-gradient-to-t from-neon-blue/10 via-transparent to-transparent opacity-50" />
                <Container className="relative z-10 text-center">
                    <h2 className="text-5xl md:text-7xl font-bold font-orbitron text-white mb-8">
                        READY TO <span className="text-neon-blue">SHIP?</span>
                    </h2>
                    <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto">
                        Applications close soon. Don't miss your chance to be part of the legacy.
                    </p>
                    <Button asChild size="xl" className="h-16 px-10 text-xl bg-neon-blue text-black hover:bg-white hover:scale-105 transition-all rounded-full font-bold shadow-[0_0_50px_rgba(0,212,255,0.4)]">
                        <Link href="/join/apply">
                            START APPLICATION
                        </Link>
                    </Button>
                </Container>
            </Section>
        </div>
    );
}
