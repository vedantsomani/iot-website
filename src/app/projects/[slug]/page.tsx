"use client";

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Github, ExternalLink, Users, Cpu } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';
import projectsData from '@/data/projects.json';

interface Project {
    slug: string;
    title: string;
    shortDesc: string;
    description: string;
    image: string;
    gallery: string[];
    techStack: string[];
    team: string[];
    demoLink?: string;
    githubLink?: string;
    featured: boolean;
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default function ProjectDetailPage({ params }: PageProps) {
    const { slug } = use(params);
    const projects = projectsData as Project[];
    const project = projects.find((p) => p.slug === slug);

    if (!project) {
        notFound();
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Back button */}
            <div className="max-w-7xl mx-auto px-4 pt-8">
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-blue transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Projects
                </Link>
            </div>

            {/* Hero */}
            <section className="relative py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            {project.featured && (
                                <span className="inline-block px-3 py-1 mb-4 rounded-full text-xs font-bold bg-neon-purple text-white">
                                    Featured Project
                                </span>
                            )}

                            <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-white mb-6">
                                {project.title}
                            </h1>

                            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-4 mb-8">
                                {project.githubLink && (
                                    <a
                                        href={project.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white hover:text-black transition-colors"
                                    >
                                        <Github className="w-5 h-5" />
                                        View Source
                                    </a>
                                )}
                                {project.demoLink && (
                                    <a
                                        href={project.demoLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-neon-blue text-black font-bold rounded-lg hover:bg-white transition-colors"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        Live Demo
                                    </a>
                                )}
                            </div>
                        </motion.div>

                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden glass-panel border border-white/10">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {/* Decorative glow */}
                            <div className="absolute -inset-4 bg-neon-blue/20 blur-3xl -z-10 rounded-full" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Details */}
            <section className="py-16 bg-panel-bg border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Tech Stack */}
                        <ScrollReveal>
                            <div className="glass-panel p-6 rounded-xl border border-white/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Cpu className="w-6 h-6 text-neon-blue" />
                                    <h3 className="text-xl font-bold font-orbitron text-white">Tech Stack</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-4 py-2 rounded-lg text-sm bg-neon-blue/10 text-neon-blue border border-neon-blue/20"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>

                        {/* Team */}
                        <ScrollReveal delay={0.1}>
                            <div className="glass-panel p-6 rounded-xl border border-white/10">
                                <div className="flex items-center gap-3 mb-4">
                                    <Users className="w-6 h-6 text-neon-purple" />
                                    <h3 className="text-xl font-bold font-orbitron text-white">Team</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {project.team.map((member) => (
                                        <span
                                            key={member}
                                            className="px-4 py-2 rounded-lg text-sm bg-neon-purple/10 text-neon-purple border border-neon-purple/20"
                                        >
                                            {member}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Gallery */}
            {project.gallery && project.gallery.length > 0 && (
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4">
                        <ScrollReveal>
                            <h2 className="text-3xl font-bold font-orbitron text-white mb-8">Gallery</h2>
                        </ScrollReveal>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {project.gallery.map((img, i) => (
                                <motion.div
                                    key={i}
                                    className="relative aspect-video rounded-xl overflow-hidden glass-panel border border-white/10"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <Image src={img} alt={`${project.title} gallery ${i + 1}`} fill className="object-cover" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Other Projects */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <ScrollReveal>
                        <h2 className="text-3xl font-bold font-orbitron text-white mb-8">More Projects</h2>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {projects
                            .filter((p) => p.slug !== project.slug)
                            .slice(0, 3)
                            .map((p) => (
                                <motion.div
                                    key={p.slug}
                                    whileHover={{ y: -5 }}
                                    transition={{ type: 'spring', stiffness: 300 }}
                                >
                                    <Link
                                        href={`/projects/${p.slug}`}
                                        className="block glass-panel border border-white/10 rounded-xl overflow-hidden group"
                                    >
                                        <div className="relative h-40">
                                            <Image src={p.image} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-white group-hover:text-neon-blue transition-colors">
                                                {p.title}
                                            </h3>
                                            <p className="text-sm text-gray-400 line-clamp-1">{p.shortDesc}</p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
