"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Cpu, Layers } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface Project {
    slug: string;
    title: string;
    shortDesc: string;
    description: string;
    image: string;
    techStack: string[];
    flagship?: boolean;
}

interface FlagshipProjectsProps {
    projects: Project[];
}

export default function FlagshipProjects({ projects }: FlagshipProjectsProps) {
    if (!projects || projects.length === 0) return null;

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[120px] -z-10 animate-pulse delay-1000" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="container mx-auto px-6 mb-16 text-center"
            >
                <Badge variant="outline" className="mb-4 border-neon-blue text-neon-blue drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]">
                    <Sparkles className="w-3 h-3 mr-2" />
                    Flagship Projects
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold font-orbitron text-white mb-4">
                    INNOVATION <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">UNLEASHED</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Our most advanced engineering feats, pushing the boundaries of AI and Robotics.
                </p>
            </motion.div>

            <div className="container mx-auto px-6 flex flex-col gap-24">
                {projects.map((project, index) => (
                    <motion.div
                        key={project.slug}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12 group`}
                    >
                        {/* Project Image Panel */}
                        <div className="w-full lg:w-3/5 relative perspective-1000">
                            <motion.div
                                whileHover={{ rotateY: index % 2 === 0 ? 5 : -5, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 100 }}
                                className="relative rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/10 group-hover:border-neon-blue/30 transition-all duration-500"
                            >
                                <div className="aspect-video relative bg-black/50">
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                                    {/* Animated Border Glow */}
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-neon-blue/20 rounded-2xl transition-all duration-500" />
                                </div>
                            </motion.div>

                            {/* Decorators */}
                            <div className={`absolute -bottom-10 ${index % 2 === 0 ? "-left-10" : "-right-10"} -z-10`}>
                                <div className="grid grid-cols-6 gap-2 opacity-20">
                                    {[...Array(24)].map((_, i) => (
                                        <div key={i} className="w-2 h-2 bg-neon-blue rounded-full" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Content Panel */}
                        <div className="w-full lg:w-2/5 space-y-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-neon-blue/80 font-mono text-sm tracking-wider">
                                    <Cpu className="w-4 h-4" />
                                    <span>PROJECT 0{index + 1}</span>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-bold font-orbitron text-white group-hover:text-neon-blue transition-colors duration-300">
                                    {project.title}
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-lg">
                                    {project.description}
                                </p>
                            </div>

                            {/* Specs / Tech Stack */}
                            <div className="grid grid-cols-2 gap-4">
                                {project.techStack.slice(0, 4).map((tech, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-400 border border-white/5 p-3 rounded-lg bg-white/5 backdrop-blur-sm">
                                        <Layers className="w-4 h-4 text-neon-purple" />
                                        {tech}
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4">
                                <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-neon-blue/50 text-white rounded-lg hover:bg-neon-blue hover:text-black transition-all duration-300 font-bold group/btn">
                                    Explore Project
                                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
