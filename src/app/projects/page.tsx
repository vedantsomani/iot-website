"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ScrollReveal';
import projectsData from '@/data/projects.json';
import ProjectBlueprint from '@/components/ProjectBlueprint';
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

function ProjectCard({ project }: { project: Project }) {
    return (
        <motion.div
            className="glass-panel border border-white/10 rounded-xl overflow-hidden group relative"
            whileHover={{ y: -10 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            {/* Main Card Link Overlay */}
            <Link href={`/projects/${project.slug}`} className="absolute inset-0 z-10">
                <span className="sr-only">View {project.title}</span>
            </Link>

            <div className="relative h-56">
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-panel-bg via-transparent to-transparent" />

                {/* Featured badge */}
                {project.featured && (
                    <div className="absolute top-4 left-4 z-20">
                        <Badge variant="secondary">Featured</Badge>
                    </div>
                )}

                {/* Quick links */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    {project.githubLink && (
                        <a
                            href={project.githubLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Github className="w-4 h-4" />
                        </a>
                    )}
                    {project.demoLink && (
                        <a
                            href={project.demoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-black/50 text-white hover:bg-neon-blue hover:text-black transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>
            </div>

            <div className="p-5 relative z-0">
                <h3 className="text-xl font-bold font-orbitron text-white mb-2 group-hover:text-neon-blue transition-colors">
                    {project.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.shortDesc}</p>

                {/* Tech stack tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 3).map((tech) => (
                        <span
                            key={tech}
                            className="px-2 py-1 rounded text-xs bg-neon-blue/10 text-neon-blue border border-neon-blue/20"
                        >
                            {tech}
                        </span>
                    ))}
                    {project.techStack.length > 3 && (
                        <span className="px-2 py-1 rounded text-xs bg-white/5 text-gray-500">
                            +{project.techStack.length - 3}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">
                        {project.team.length} contributor{project.team.length > 1 ? 's' : ''}
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-neon-blue group-hover:translate-x-1 transition-all" />
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
                    {/* Featured Projects - Digital Twin Gallery */}
                    {featuredProjects.length > 0 && (
                        <div className="mb-20">
                            <ScrollReveal>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-12 w-2 bg-neon-purple rounded-full" />
                                    <div>
                                        <h2 className="text-3xl font-bold font-orbitron text-white">Digital Twin Gallery</h2>
                                        <p className="text-blue-400 font-mono text-sm mt-1">
                                            // SYSTEM.ACCESS_LEVEL: TOP_SECRET //
                                        </p>
                                    </div>
                                </div>
                            </ScrollReveal>

                            <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {featuredProjects.map((project) => (
                                    <StaggerItem key={project.slug}>
                                        <Link href={`/projects/${project.slug}`}>
                                            <ProjectBlueprint
                                                title={project.title}
                                                description={project.shortDesc}
                                                image={project.image}
                                                tech={project.techStack}
                                            />
                                        </Link>
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>
                        </div>
                    )}

                    {/* All Projects */}
                    <div>
                        <ScrollReveal>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-12 w-2 bg-neon-blue rounded-full" />
                                <h2 className="text-3xl font-bold font-orbitron text-white">All Projects</h2>
                            </div>
                        </ScrollReveal>

                        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {otherProjects.map((project) => (
                                <StaggerItem key={project.slug}>
                                    <ProjectCard project={project} />
                                </StaggerItem>
                            ))}
                            {featuredProjects.map((project) => (
                                <StaggerItem key={project.slug}>
                                    <ProjectCard project={project} />
                                </StaggerItem>
                            ))}
                        </StaggerContainer>
                    </div>

                    {/* CTA */}
                    <ScrollReveal className="mt-20">
                        <div className="glass-panel p-8 md:p-12 rounded-2xl border border-neon-purple/30 text-center">
                            <h2 className="text-2xl md:text-3xl font-bold font-orbitron text-white mb-4">
                                Have a project idea?
                            </h2>
                            <p className="text-gray-400 mb-6">
                                Join the club and turn your ideas into reality with our team and resources.
                            </p>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
