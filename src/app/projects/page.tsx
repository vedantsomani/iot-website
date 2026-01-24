"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import projectsData from '@/data/projects.json';
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Badge } from "@/components/ui/Badge";

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

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const isPremium = ['aerial-drone-development', 'humanoid-robot'].includes(project.slug);

    return (
        <motion.div
            className={`glass-panel border rounded-xl overflow-hidden group relative h-[400px] flex flex-col ${isPremium
                    ? 'border-neon-blue/40 shadow-[0_0_15px_rgba(0,243,255,0.1)]'
                    : 'border-white/10'
                }`}
            whileHover={{
                y: -5,
                boxShadow: isPremium ? '0 0 25px rgba(0,243,255,0.2)' : 'none'
            }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            {/* Main Card Link Overlay */}
            <Link href={`/projects/${project.slug}`} className="absolute inset-0 z-10">
                <span className="sr-only">View {project.title}</span>
            </Link>

            {isPremium && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50" />
            )}

            <div className="relative h-48 overflow-hidden">
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    priority={index < 6}
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-panel-bg via-transparent to-transparent opacity-60" />

                {/* Featured badge */}
                {project.featured && (
                    <div className="absolute top-4 left-4 z-20">
                        <Badge variant="secondary" className="bg-neon-blue/20 text-neon-blue border-neon-blue/20 backdrop-blur-md">Featured</Badge>
                    </div>
                )}
            </div>

            <div className="p-6 flex flex-col flex-1 relative z-0 bg-gradient-to-b from-black/50 to-transparent">
                <h3 className={`text-xl font-bold font-orbitron mb-2 transition-colors ${isPremium ? 'text-white group-hover:text-neon-blue drop-shadow-[0_0_5px_rgba(0,243,255,0.3)]' : 'text-white group-hover:text-neon-blue'
                    }`}>
                    {project.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-3 group-hover:text-gray-300 transition-colors">
                    {project.shortDesc}
                </p>

                <div className="mt-auto">
                    {/* Tech stack tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack.slice(0, 3).map((tech) => (
                            <span
                                key={tech}
                                className={`px-2 py-1 rounded text-[10px] uppercase font-mono bg-white/5 border transition-colors ${isPremium
                                        ? 'text-neon-blue border-neon-blue/20 group-hover:bg-neon-blue/10'
                                        : 'text-gray-400 border-white/10 group-hover:border-neon-blue/30 group-hover:text-neon-blue'
                                    }`}
                            >
                                {tech}
                            </span>
                        ))}
                        {project.techStack.length > 3 && (
                            <span className="px-2 py-1 rounded text-[10px] font-mono bg-white/5 text-gray-500">
                                +{project.techStack.length - 3}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5 group-hover:border-neon-blue/20 transition-colors">
                        <span className="text-gray-500 text-xs font-mono">
                            // {project.team.length} MEMBER{project.team.length !== 1 ? 'S' : ''}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-neon-blue group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function ProjectsPage() {
    const projects = projectsData as Project[];
    const featuredProjects = projects.filter((p) => p.featured);
    const otherProjects = projects.filter((p) => !p.featured);

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
                            OUR <span className="text-neon-blue">PROJECTS</span>
                        </h1>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                            From autonomous drones to smart IoT systems — explore the innovations built by our team.
                        </p>
                    </motion.div>
                </Container>
            </Section>

            <Section>
                <Container>
                    {/* All Projects Grid */}
                    <div>
                        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Render all projects together without separation, prioritized by featured if desired, or just mixed */}
                            {/* User asked to "merge it in normal", so we can just render them all. 
                                Typically featured first is good, but let's keep the existing order logic 
                                (Standard then Featured? Or Featured then Standard? Usually Featured First).
                                Let's put Featured First for better UX. 
                            */}
                            {featuredProjects.map((project, i) => (
                                <StaggerItem key={project.slug}>
                                    <ProjectCard project={project} index={i} />
                                </StaggerItem>
                            ))}
                            {otherProjects.map((project, i) => (
                                <StaggerItem key={project.slug}>
                                    <ProjectCard project={project} index={i + featuredProjects.length} />
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    </div>

                    {/* CTA */}
                    <ScrollReveal className="mt-20">
                        <div className="glass-panel p-8 md:p-12 rounded-2xl border border-neon-purple/30 text-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-neon-purple/5 group-hover:bg-neon-purple/10 transition-colors duration-500" />
                            <h2 className="text-2xl md:text-3xl font-bold font-orbitron text-white mb-4 relative z-10">
                                Have a project idea?
                            </h2>
                            <p className="text-gray-400 mb-6 relative z-10">
                                Join the club and turn your ideas into reality with our team and resources.
                            </p>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative z-10">
                                <Link
                                    href="/join"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-neon-purple text-white font-bold rounded-lg hover:bg-white hover:text-black transition-colors"
                                >
                                    Start Building
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </motion.div>
                        </div>
                    </ScrollReveal>
                </Container>
            </Section>
        </div>
    );
}
