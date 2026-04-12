"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Star, Palette, Video, Share2, Briefcase, Megaphone, Rocket, Users, Terminal, Globe, ChevronRight } from 'lucide-react';
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

const domains = [
    { icon: Cpu, title: "Tech Team", desc: "IoT, Robotics, Software, and AI. The builders.", color: "text-accent-primary", border: "hover:border-accent-primary/40" },
    { icon: Star, title: "Research", desc: "Deep tech research, paper publication, and innovation.", color: "text-red-400", border: "hover:border-red-400/40" },
    { icon: Palette, title: "Design & Content", desc: "Graphic design, brand identity, and creative writing.", color: "text-pink-400", border: "hover:border-pink-400/40" },
    { icon: Video, title: "Multimedia", desc: "Video editing, photography, and visual storytelling.", color: "text-accent-secondary", border: "hover:border-accent-secondary/40" },
    { icon: Share2, title: "Social Media", desc: "Content creation, digital marketing, and brand presence.", color: "text-accent-warm", border: "hover:border-accent-warm/40" },
    { icon: Briefcase, title: "Management", desc: "Event planning, logistics, and club operations.", color: "text-accent-success", border: "hover:border-accent-success/40" },
    { icon: Megaphone, title: "Public Relations", desc: "Sponsorships, outreach, and external communications.", color: "text-yellow-400", border: "hover:border-yellow-400/40" },
];

const benefits = [
    { title: "Real Projects", desc: "Work on deployed production apps and research papers.", icon: Rocket },
    { title: "Mentorship", desc: "Learn significantly faster from seniors and alumni.", icon: Users },
    { title: "Hackathons", desc: "Exclusive access to internal hackathons and funding.", icon: Terminal },
    { title: "Network", desc: "Connect with the brightest tech minds on campus.", icon: Globe },
];

export default function JoinPage() {
    return (
        <div className="min-h-screen bg-grid-lines">
            {/* Hero */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10" />

                <Container className="relative z-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-border-default mb-6">
                            <span className="w-2 h-2 rounded-full bg-accent-success animate-pulse" />
                            <span className="text-xs font-mono text-text-tertiary tracking-widest uppercase">Recruitment Open 2026</span>
                        </div>

                        <h1 className="text-5xl md:text-8xl font-bold font-orbitron text-white mb-6 tracking-tighter">
                            Join the club
                        </h1>

                        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
                            We're looking for the outliers. The builders. The designers.
                            <br className="hidden sm:block" />
                            Join a crew of 43 builders, designers, and researchers.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button asChild size="lg" className="rounded-full px-8 bg-white text-black hover:bg-white/90 font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                <Link href="/join/apply">
                                    APPLY NOW <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="lg" className="text-text-secondary hover:text-white">
                                <Link href="#domains">Explore Roles</Link>
                            </Button>
                        </div>
                    </motion.div>
                </Container>
            </section>

            {/* Why Join */}
            <Section className="border-t border-border-subtle">
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {benefits.map((b, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="card-outline p-5 rounded-xl group"
                            >
                                <b.icon className="w-7 h-7 text-accent-primary mb-3 group-hover:scale-110 transition-transform" />
                                <h3 className="text-base font-bold text-white mb-1 font-display">{b.title}</h3>
                                <p className="text-text-tertiary text-xs leading-relaxed">{b.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* Domains */}
            <Section id="domains">
                <Container>
                    <div className="text-center mb-12">
                        <span className="text-xs font-mono uppercase tracking-widest text-accent-secondary mb-2 block">Open roles</span>
                        <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">Domains</h2>
                        <p className="text-text-tertiary max-w-xl mx-auto text-sm">Find your place. We recruit across multiple disciplines.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {domains.map((d, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                viewport={{ once: true }}
                                className={`card-solid p-6 rounded-xl transition-all duration-300 group ${d.border}`}
                            >
                                <d.icon className={`w-8 h-8 ${d.color} mb-4`} />
                                <h3 className="text-lg font-bold text-white mb-2 font-display">{d.title}</h3>
                                <p className="text-text-tertiary text-sm mb-4">{d.desc}</p>
                                <div className="h-px w-full bg-border-subtle group-hover:bg-border-default transition-colors mb-4" />
                                <Link href="/join/apply" className="inline-flex items-center text-xs font-mono text-text-tertiary group-hover:text-white transition-colors">
                                    APPLY FOR THIS ROLE <ChevronRight className="w-3 h-3 ml-1" />
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* Bottom CTA */}
            <Section spacing="small" className="border-t border-border-subtle">
                <Container className="text-center max-w-2xl">
                    <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
                        Ready?
                    </h2>
                    <p className="text-text-secondary mb-8">
                        Applications close soon. Don't miss your chance.
                    </p>
                    <Button asChild size="lg" className="rounded-full px-8">
                        <Link href="/join/apply">
                            START APPLICATION
                        </Link>
                    </Button>
                </Container>
            </Section>
        </div>
    );
}
