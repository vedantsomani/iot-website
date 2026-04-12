"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Filter } from 'lucide-react';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import projectsData from '@/data/projects.json';
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

import FlagshipProjects from '@/components/FlagshipProjects';

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
    flagship?: boolean;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
    return (
        <motion.div
            className="card-outline rounded-xl overflow-hidden group relative h-[380px] flex flex-col"
            transition={{ type: 'spring', stiffness: 300 }}
        >
            <Link href={`/projects/${project.slug}`} className="absolute inset-0 z-10">
                <span className="sr-only">View {project.title}</span>
            </Link>

            <div className="relative h-44 overflow-hidden">
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    priority={index < 6}
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent opacity-60" />

                {project.featured && (
                    <div className="absolute top-3 left-3 z-20">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-primary/15 text-accent-primary font-mono uppercase tracking-wide border border-accent-primary/20">
                            Featured
                        </span>
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold font-display mb-1.5 text-white group-hover:text-accent-primary transition-colors">
                    {project.title}
                </h3>
                <p className="text-text-tertiary text-xs mb-4 line-clamp-2">{project.shortDesc}</p>

                <div className="mt-auto">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {project.techStack.slice(0, 3).map((tech) => (
                            <span
                                key={tech}
                                className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/10 text-white backdrop-blur-md"
                            >
                                {tech}
                            </span>
                        ))}
                        {project.techStack.length > 3 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/5 text-text-tertiary">
                                +{project.techStack.length - 3}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                        <span className="text-text-tertiary text-[10px] font-mono">
                            {project.team.length} member{project.team.length !== 1 ? 's' : ''}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-text-tertiary group-hover:text-accent-primary group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function ProjectsPage() {
    const [activeFilter, setActiveFilter] = useState('All');
    const projects = projectsData as Project[];
    const flagshipProjects = projects.filter((p) => p.flagship);

    // Collect all unique tech categories
    const categories = useMemo(() => {
        const cats = new Set<string>();
        projects.filter(p => !p.flagship).forEach(p => {
            // Use first tech stack item as category
            if (p.techStack.length > 0) cats.add(p.techStack[0]);
        });
        return ['All', ...Array.from(cats).sort()];
    }, [projects]);

    const nonFlagshipProjects = useMemo(() => {
        const list = projects.filter(p => !p.flagship);
        if (activeFilter === 'All') return list;
        return list.filter(p => p.techStack.includes(activeFilter));
    }, [projects, activeFilter]);

    return (
        <div className="min-h-screen bg-dots">
            {/* Header */}
            <Section spacing="small" className="border-b border-border-subtle">
                <Container>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-left"
                    >
                        <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-white mb-4">
                            Projects
                        </h1>
                        <p className="text-text-secondary text-lg max-w-2xl font-display">
                            From autonomous drones to smart IoT systems — explore the innovations built by our team.
                        </p>
                    </motion.div>
                </Container>
            </Section>

            {/* Flagship Projects */}
            <FlagshipProjects projects={flagshipProjects} />

            <Section>
                <Container>
                    {/* Filter */}
                    <ScrollReveal>
                        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-1 scrollbar-hide">
                            <Filter className="w-3.5 h-3.5 text-text-tertiary shrink-0" />
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveFilter(cat)}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                                        activeFilter === cat
                                            ? 'bg-accent-primary text-black'
                                            : 'bg-white/5 text-text-tertiary hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </ScrollReveal>

                    {/* All Projects Grid */}
                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {nonFlagshipProjects.map((project, i) => (
                            <StaggerItem key={project.slug}>
                                <ProjectCard project={project} index={i} />
                            </StaggerItem>
                        ))}
                    </StaggerContainer>

                    {nonFlagshipProjects.length === 0 && (
                        <div className="text-center py-20 text-text-tertiary">
                            No projects found for this category.
                        </div>
                    )}

                    {/* CTA */}
                    <ScrollReveal className="mt-16">
                        <div className="card-solid p-8 md:p-10 rounded-2xl border border-border-default md:flex md:items-center md:justify-between text-left">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold font-display text-white mb-2">
                                    Have a project idea?
                                </h2>
                                <p className="text-text-secondary text-sm md:mb-0 mb-6">
                                    Join the club and turn your ideas into reality.
                                </p>
                            </div>
                            <Button asChild size="lg" className="rounded-full bg-white text-black hover:bg-white/90 font-bold px-8">
                                <Link href="/join">
                                    Start Building <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </ScrollReveal>
                </Container>
            </Section>
        </div>
    );
}
