"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Target, Eye, Users, Cpu, TrendingUp, Megaphone, Camera, ArrowRight, FlaskConical } from 'lucide-react';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

const teams = [
    {
        icon: FlaskConical,
        name: 'Research',
        description: 'Deep-tech research, paper publication, and academic innovation.',
        borderColor: 'hover:border-red-400',
        iconColor: 'text-red-400',
        bgColor: 'bg-red-400/10',
    },
    {
        icon: Cpu,
        name: 'Tech Team',
        description: 'The builders and innovators. Responsible for workshops, projects, and R&D.',
        borderColor: 'hover:border-[#00d4ff]',
        iconColor: 'text-[#00d4ff]',
        bgColor: 'bg-[#00d4ff]/10',
    },
    {
        icon: TrendingUp,
        name: 'Management',
        description: 'Orchestrating club operations, finances, and event logistics.',
        borderColor: 'hover:border-green-400',
        iconColor: 'text-green-400',
        bgColor: 'bg-green-400/10',
    },
    {
        icon: Megaphone,
        name: 'PR & Outreach',
        description: 'Managing sponsorships, collaborations, and campus presence.',
        borderColor: 'hover:border-yellow-400',
        iconColor: 'text-yellow-400',
        bgColor: 'bg-yellow-400/10',
    },
    {
        icon: Users,
        name: 'Social Media',
        description: 'Building our digital community and online engagement.',
        borderColor: 'hover:border-pink-400',
        iconColor: 'text-pink-400',
        bgColor: 'bg-pink-400/10',
    },
    {
        icon: Camera,
        name: 'Multimedia',
        description: 'Creating visuals, videos, and defining our brand identity.',
        borderColor: 'hover:border-orange-400',
        iconColor: 'text-orange-400',
        bgColor: 'bg-orange-400/10',
    },
];

const milestones = [
    { year: '2019', event: 'Founded as "Robotics Club" under Student Council' },
    { year: '2021', event: 'Rebranded to "Technotix BU"' },
    { year: '2022', event: 'Launched First Flagship Drone Project' },
    { year: '2023', event: 'Expanded to 50+ Active Members' },
    { year: '2024', event: 'Renamed "IoT & Robotics BU" under Student Cabinet' },
    { year: '2025', event: 'Hosted Rewire Ideathon & Escape Room' },
    { year: '2026', event: 'Launched Grand Theft Racing & Research Division' },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-dots">
            {/* Header */}
            <Section spacing="small" className="border-b border-border-subtle">
                <Container className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-white mb-4">
                            About Us
                        </h1>
                        <p className="text-text-secondary max-w-2xl mx-auto">
                            Learn about who we are, what we do, and why we're the place to be.
                        </p>
                    </motion.div>
                </Container>
            </Section>

            {/* Mission & Vision */}
            <Section>
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ScrollReveal>
                            <motion.div
                                className="card-accent-left p-8 h-full"
                                style={{ borderLeftColor: 'var(--accent-primary)' }}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 rounded-xl bg-accent-primary/10">
                                        <Target className="w-7 h-7 text-accent-primary" />
                                    </div>
                                    <h2 className="text-xl font-bold font-display text-white">Our Mission</h2>
                                </div>
                                <p className="text-text-secondary leading-relaxed">
                                    To foster a community of innovators who learn, build, and share knowledge in IoT and robotics.
                                    We aim to bridge the gap between theoretical education and practical, hands-on experience
                                    by providing students with the resources, mentorship, and platform to create real-world solutions.
                                </p>
                            </motion.div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.1}>
                            <motion.div
                                className="card-accent-left p-8 h-full"
                                style={{ borderLeftColor: 'var(--accent-secondary)' }}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 rounded-xl bg-accent-secondary/10">
                                        <Eye className="w-7 h-7 text-accent-secondary" />
                                    </div>
                                    <h2 className="text-xl font-bold font-display text-white">Our Vision</h2>
                                </div>
                                <p className="text-text-secondary leading-relaxed">
                                    To be the leading student-driven technology club in India, recognized for producing innovative
                                    projects, talented engineers, and future tech leaders. We envision a community where every
                                    member has the opportunity to explore, experiment, and excel.
                                </p>
                            </motion.div>
                        </ScrollReveal>
                    </div>
                </Container>
            </Section>

            {/* What We Do */}
            <Section className="border-y border-border-subtle">
                <Container>
                    <ScrollReveal className="text-center mb-12">
                        <span className="text-xs font-mono uppercase tracking-widest text-accent-primary mb-2 block">What we do</span>
                        <h2 className="text-3xl font-bold font-display text-white mb-3">
                            Three pillars of what makes us, us.
                        </h2>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Workshops & Training',
                                desc: 'Regular hands-on sessions on Arduino, ESP32, ROS, drones, 3D printing, and more.',
                                icon: '🛠️',
                                style: { borderLeftColor: 'var(--accent-primary)' },
                            },
                            {
                                title: 'Projects & R&D',
                                desc: 'Build real-world projects from concept to completion — drones, humanoids, AI assistants.',
                                icon: '🤖',
                                style: { borderLeftColor: 'var(--accent-secondary)' },
                            },
                            {
                                title: 'Competitions',
                                desc: 'Represent Bennett at national and international robotics events and hackathons.',
                                icon: '🏆',
                                style: { borderLeftColor: 'var(--accent-warm)' },
                            },
                        ].map((item, i) => (
                            <ScrollReveal key={i} delay={i * 0.1}>
                                <motion.div
                                    className="card-accent-left p-6 text-center h-full"
                                    style={item.style}
                                    whileHover={{ y: -4 }}
                                >
                                    <div className="text-4xl mb-4">{item.icon}</div>
                                    <h3 className="text-lg font-bold text-white mb-2 font-display">{item.title}</h3>
                                    <p className="text-text-tertiary text-sm">{item.desc}</p>
                                </motion.div>
                            </ScrollReveal>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* Our Teams — color-coded */}
            <Section>
                <Container>
                    <ScrollReveal className="text-center mb-12">
                        <span className="text-xs font-mono uppercase tracking-widest text-accent-secondary mb-2 block">The team</span>
                        <h2 className="text-3xl font-bold font-display text-white mb-3">
                            Five teams, one mission.
                        </h2>
                    </ScrollReveal>

                    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                        {teams.map((team, i) => (
                            <StaggerItem key={i}>
                                <motion.div
                                    className={`card-solid p-5 rounded-xl text-center h-full ${team.borderColor} transition-colors duration-300`}
                                    whileHover={{ y: -4 }}
                                >
                                    <div className={`w-10 h-10 rounded-lg ${team.bgColor} flex items-center justify-center mx-auto mb-3`}>
                                        <team.icon className={`w-5 h-5 ${team.iconColor}`} />
                                    </div>
                                    <h3 className="text-sm font-bold text-white mb-1.5 font-display">{team.name}</h3>
                                    <p className="text-text-tertiary text-xs">{team.description}</p>
                                </motion.div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>

                    <div className="text-center mt-10">
                        <Button asChild variant="link" className="text-sm">
                            <Link href="/members">
                                Meet Our Team <ArrowRight className="ml-1 w-3 h-3" />
                            </Link>
                        </Button>
                    </div>
                </Container>
            </Section>

            {/* Timeline */}
            <Section className="border-t border-border-subtle">
                <Container className="max-w-4xl">
                    <ScrollReveal className="text-center mb-12">
                        <span className="text-xs font-mono uppercase tracking-widest text-accent-warm mb-2 block">Our journey</span>
                        <h2 className="text-3xl font-bold font-display text-white">
                            From a small club to a movement.
                        </h2>
                    </ScrollReveal>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent-primary via-accent-secondary to-transparent" />

                        <div className="space-y-10">
                            {milestones.map((milestone, i) => (
                                <ScrollReveal key={i} delay={i * 0.08}>
                                    <motion.div
                                        className={`relative flex items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse md:text-right' : ''
                                            }`}
                                        whileHover={{ x: i % 2 === 0 ? -4 : 4 }}
                                    >
                                        {/* Dot */}
                                        <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-accent-primary -translate-x-1/2 z-10 shadow-[0_0_8px_rgba(0,212,255,0.5)]" />

                                        {/* Content */}
                                        <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                                            <div className="card-solid p-5 rounded-xl hover:border-accent-primary/30 transition-colors">
                                                <span className="text-accent-primary font-bold text-base font-mono">{milestone.year}</span>
                                                <p className="text-text-secondary text-sm mt-1">{milestone.event}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </Container>
            </Section>

            {/* CTA */}
            <Section spacing="small">
                <Container className="max-w-3xl text-center">
                    <ScrollReveal>
                        <h2 className="text-2xl font-bold font-display text-white mb-4">
                            Want to be part of our story?
                        </h2>
                        <p className="text-text-secondary mb-6 text-sm">
                            Join us and write the next chapter together.
                        </p>
                        <Button asChild size="lg">
                            <Link href="/join">
                                Join the Club <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                    </ScrollReveal>
                </Container>
            </Section>
        </div>
    );
}
