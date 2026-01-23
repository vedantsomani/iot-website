"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Linkedin, Github, Globe, ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import ChromaGrid from '@/components/react-bits/ChromaGrid';
import membersData from '@/data/members.json';
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Member {
    id: string;
    name: string;
    role: string;
    team: string;
    image: string;
    bio: string;
    linkedin?: string;
    instagram?: string;
    github?: string;
    website?: string;
}

const teamOrder = ['Executive', 'Tech', 'Management', 'PR', 'Social Media', 'Design', 'Multimedia'];

const teamColors: Record<string, string> = {
    Executive: 'neon-purple',
    Tech: 'neon-blue',
    Management: 'green-400',
    PR: 'yellow-400',
    'Social Media': 'pink-400',
    Design: 'indigo-400',
    Multimedia: 'orange-400',
};

function MemberCard({ member }: { member: Member }) {
    const [isHovered, setIsHovered] = useState(false);
    const [isTapped, setIsTapped] = useState(false);

    const showOverlay = isHovered || isTapped;

    return (
        <motion.div
            className="relative aspect-[3/4] rounded-xl overflow-hidden glass-panel border border-white/10 group"
            data-cursor-robot
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsTapped(!isTapped)}
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            {/* Member Image */}
            <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70" />

            {/* Always visible info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                <h3 className="text-lg font-bold text-white font-orbitron">{member.name}</h3>
                <p className="text-sm text-neon-blue">{member.role}</p>
            </div>

            {/* Hover overlay with socials */}
            <AnimatePresence>
                {showOverlay && (
                    <motion.div
                        className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 z-20"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <motion.div
                            className="relative w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-neon-blue"
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                        >
                            <Image src={member.image} alt={member.name} fill className="object-cover object-top" />
                        </motion.div>

                        <motion.h3
                            className="text-xl font-bold text-white font-orbitron text-center"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.05 }}
                        >
                            {member.name}
                        </motion.h3>

                        <motion.p
                            className="text-neon-blue text-sm mb-2"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            {member.role}
                        </motion.p>

                        <motion.p
                            className="text-gray-400 text-xs text-center mb-4 line-clamp-2"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.15 }}
                        >
                            {member.bio}
                        </motion.p>

                        {/* Social Links */}
                        <motion.div
                            className="flex gap-3"
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {member.linkedin && (
                                <a
                                    href={member.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-white/10 hover:bg-neon-blue/20 hover:text-neon-blue text-white transition-colors"
                                >
                                    <Linkedin className="w-4 h-4" />
                                </a>
                            )}
                            {member.instagram && (
                                <a
                                    href={member.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-white/10 hover:bg-pink-500/20 hover:text-pink-500 text-white transition-colors"
                                >
                                    <Instagram className="w-4 h-4" />
                                </a>
                            )}
                            {member.github && (
                                <a
                                    href={member.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                                >
                                    <Github className="w-4 h-4" />
                                </a>
                            )}
                            {member.website && (
                                <a
                                    href={member.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 rounded-full bg-white/10 hover:bg-neon-purple/20 hover:text-neon-purple text-white transition-colors"
                                >
                                    <Globe className="w-4 h-4" />
                                </a>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Glowing border on hover */}
            <motion.div
                className="absolute inset-0 rounded-xl border-2 border-neon-blue/0 pointer-events-none"
                animate={{ borderColor: isHovered ? 'rgba(0, 212, 255, 0.5)' : 'rgba(0, 212, 255, 0)' }}
                transition={{ duration: 0.3 }}
            />
        </motion.div>
    );
}

export default function MembersPage() {
    const members = membersData as Member[];

    // Group members by team
    const groupedMembers = teamOrder.reduce((acc, team) => {
        acc[team] = members.filter((m) => m.team === team);
        return acc;
    }, {} as Record<string, Member[]>);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <Section className="bg-gradient-to-b from-black to-panel-bg border-b border-white/5" spacing="small">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold font-orbitron text-white mb-6">
                            OUR <span className="text-neon-blue">TEAM</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            Meet the innovators, creators, and leaders driving the IoT & Robotics Club forward.
                            Hover over a member to learn more.
                        </p>
                    </motion.div>
                </Container>
            </Section>

            {/* Members by Team */}
            <Section>
                <Container>
                    {teamOrder.map((team, teamIndex) => {
                        const teamMembers = groupedMembers[team];
                        if (!teamMembers || teamMembers.length === 0) return null;

                        return (
                            <section key={team} className="mb-20 last:mb-0">
                                <ScrollReveal delay={teamIndex * 0.1}>
                                    <div className="flex items-center gap-4 mb-8">
                                        <Badge variant="default" className={`bg-${teamColors[team] || 'neon-blue'}/20 text-${teamColors[team] || 'neon-blue'} border-${teamColors[team] || 'neon-blue'}/20`}>
                                            {team}
                                        </Badge>
                                        <div>
                                            {team === 'Executive' && <span className="text-gray-400 text-sm hidden sm:inline-block">Club leadership and management</span>}
                                            {team === 'Tech' && <span className="text-gray-400 text-sm hidden sm:inline-block">Workshops, projects, and R&D</span>}
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-bold font-orbitron text-white mb-8 hidden">
                                        {team}
                                        {/* Hidden h2 for SEO but visible Badge above for UI */}
                                    </h2>
                                </ScrollReveal>

                                <ChromaGrid columns={4}>
                                    {teamMembers.map((member) => (
                                        <MemberCard key={member.id} member={member} />
                                    ))}
                                </ChromaGrid>
                            </section>
                        );
                    })}
                </Container>
            </Section>

            {/* Join CTA */}
            <Section className="pt-0">
                <Container className="max-w-4xl">
                    <ScrollReveal>
                        <div className="glass-panel p-8 md:p-12 rounded-2xl border border-neon-blue/30 text-center">
                            <h2 className="text-2xl md:text-3xl font-bold font-orbitron text-white mb-4">
                                Want to be part of the team?
                            </h2>
                            <p className="text-gray-400 mb-6">
                                We're always looking for passionate students to join our community.
                            </p>
                            <Button asChild size="lg">
                                <Link href="/join">
                                    Apply Now
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                        </div>
                    </ScrollReveal>
                </Container>
            </Section>
        </div>
    );
}
