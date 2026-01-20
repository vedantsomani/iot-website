"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Target, Eye, Users, Cpu, Palette, TrendingUp, Megaphone, Camera, ArrowRight } from 'lucide-react';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

const teams = [
    {
        icon: Cpu,
        name: 'Tech Team',
        description: 'The builders and innovators. Responsible for workshops, projects, and R&D.',
        color: 'neon-blue',
    },
    {
        icon: TrendingUp,
        name: 'Management',
        description: 'Orchestrating club operations, finances, and event logistics.',
        color: 'green-400',
    },
    {
        icon: Megaphone,
        name: 'PR & Outreach',
        description: 'Managing sponsorships, collaborations, and campus presence.',
        color: 'yellow-400',
    },
    {
        icon: Users,
        name: 'Social Media',
        description: 'Building our digital community and online engagement.',
        color: 'pink-400',
    },
    {
        icon: Camera,
        name: 'Multimedia',
        description: 'Creating visuals, videos, and defining our brand identity.',
        color: 'orange-400',
    },
];

const milestones = [
    { year: '2020', event: 'Club Founded' },
    { year: '2021', event: 'First National Competition Win' },
    { year: '2022', event: 'Launched Drone Research Program' },
    { year: '2023', event: '100+ Active Members' },
    { year: '2024', event: 'IoT Innovation Lab Partnership' },
    { year: '2025', event: 'International Competition Representation' },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <Section className="bg-gradient-to-b from-black to-panel-bg border-b border-white/5" spacing="small">
                <Container className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold font-orbitron text-white mb-6">
                            ABOUT <span className="text-neon-purple">US</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Learn about who we are, what we do, and why the IoT & Robotics Club is the place to be.
                        </p>
                    </motion.div>
                </Container>
            </Section>

            {/* Mission & Vision */}
            <Section>
                <Container>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <ScrollReveal>
                            <motion.div
                                className="glass-panel p-8 rounded-2xl border border-neon-blue/30 h-full"
                                whileHover={{ borderColor: 'rgba(0, 212, 255, 0.5)' }}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 rounded-xl bg-neon-blue/10">
                                        <Target className="w-8 h-8 text-neon-blue" />
                                    </div>
                                    <h2 className="text-2xl font-bold font-orbitron text-white">Our Mission</h2>
                                </div>
                                <p className="text-gray-300 leading-relaxed">
                                    To foster a community of innovators who learn, build, and share knowledge in IoT and robotics.
                                    We aim to bridge the gap between theoretical education and practical, hands-on experience
                                    by providing students with the resources, mentorship, and platform to create real-world solutions.
                                </p>
                            </motion.div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.1}>
                            <motion.div
                                className="glass-panel p-8 rounded-2xl border border-neon-purple/30 h-full"
                                whileHover={{ borderColor: 'rgba(189, 0, 255, 0.5)' }}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 rounded-xl bg-neon-purple/10">
                                        <Eye className="w-8 h-8 text-neon-purple" />
                                    </div>
                                    <h2 className="text-2xl font-bold font-orbitron text-white">Our Vision</h2>
                                </div>
                                <p className="text-gray-300 leading-relaxed">
                                    To be the leading student-driven technology club in India, recognized for producing innovative
                                    projects, talented engineers, and future tech leaders. We envision a community where every
                                    member has the opportunity to explore, experiment, and excel in the fields of IoT and robotics.
                                </p>
                            </motion.div>
                        </ScrollReveal>
                    </div>
                </Container>
            </Section>

            {/* What We Do */}
            <Section className="bg-panel-bg border-y border-white/5">
                <Container>
                    <ScrollReveal className="text-center mb-16">
                        <h2 className="text-4xl font-bold font-orbitron text-white mb-4">
                            What We <span className="text-neon-blue">Do</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            From workshops to competitions, we offer a variety of activities to help you grow.
                        </p>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Workshops & Training',
                                desc: 'Regular hands-on sessions on Arduino, ESP32, ROS, drones, and more.',
                                icon: '🛠️',
                            },
                            {
                                title: 'Projects & R&D',
                                desc: 'Build real-world projects from concept to completion with your team.',
                                icon: '🤖',
                            },
                            {
                                title: 'Competitions',
                                desc: 'Represent Bennett at national and international robotics events.',
                                icon: '🏆',
                            },
                        ].map((item, i) => (
                            <ScrollReveal key={i} delay={i * 0.1}>
                                <motion.div
                                    className="glass-panel p-6 rounded-xl border border-white/10 text-center"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="text-4xl mb-4">{item.icon}</div>
                                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-400">{item.desc}</p>
                                </motion.div>
                            </ScrollReveal>
                        ))}
                    </div>
                </Container>
            </Section>

            {/* Our Teams */}
            <Section>
                <Container>
                    <ScrollReveal className="text-center mb-16">
                        <h2 className="text-4xl font-bold font-orbitron text-white mb-4">
                            Our <span className="text-neon-purple">Teams</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            The club is organized into specialized teams, each contributing to our success.
                        </p>
                    </ScrollReveal>

                    <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {teams.map((team, i) => (
                            <StaggerItem key={i}>
                                <motion.div
                                    className="glass-panel p-6 rounded-xl border border-white/10 text-center h-full"
                                    whileHover={{ y: -5, borderColor: `rgba(0, 212, 255, 0.3)` }}
                                >
                                    <team.icon className={`w-10 h-10 text-${team.color} mx-auto mb-4`} />
                                    <h3 className="text-lg font-bold text-white mb-2">{team.name}</h3>
                                    <p className="text-gray-400 text-sm">{team.description}</p>
                                </motion.div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>

                    <div className="text-center mt-12">
                        <Button asChild variant="link" className="text-lg">
                            <Link href="/members">
                                Meet Our Team
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                        </Button>
                    </div>
                </Container>
            </Section>

            {/* Timeline */}
            <Section className="bg-black">
                <Container className="max-w-4xl">
                    <ScrollReveal className="text-center mb-16">
                        <h2 className="text-4xl font-bold font-orbitron text-white mb-4">
                            Our <span className="text-neon-blue">Journey</span>
                        </h2>
                        <p className="text-gray-400">A brief history of the club's milestones.</p>
                    </ScrollReveal>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon-blue via-neon-purple to-transparent" />

                        <div className="space-y-8">
                            {milestones.map((milestone, i) => (
                                <ScrollReveal key={i} delay={i * 0.1}>
                                    <motion.div
                                        className={`relative flex items-center gap-6 ${i % 2 === 0 ? 'md:flex-row-reverse md:text-right' : ''
                                            }`}
                                        whileHover={{ x: i % 2 === 0 ? -10 : 10 }}
                                    >
                                        {/* Dot */}
                                        <div className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full bg-neon-blue -translate-x-1/2 z-10" />

                                        {/* Content */}
                                        <div className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                                            <div className="glass-panel p-4 rounded-xl border border-white/10">
                                                <span className="text-neon-blue font-bold">{milestone.year}</span>
                                                <p className="text-white">{milestone.event}</p>
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
            <Section>
                <Container className="max-w-4xl text-center">
                    <div className="glass-panel p-8 md:p-12 rounded-2xl border border-neon-blue/30">
                        <h2 className="text-3xl font-bold font-orbitron text-white mb-4">
                            Want to be part of our story?
                        </h2>
                        <p className="text-gray-400 mb-8">
                            Join us and write the next chapter together.
                        </p>
                        <Button asChild size="lg">
                            <Link href="/join">
                                Join the Club
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                    </div>
                </Container>
            </Section>
        </div>
    );
}
