import Link from "next/link";
import Image from "next/image";
import { Github, ExternalLink, Cpu } from "lucide-react";

interface ProjectProps {
    id: string;
    title: string;
    description: string;
    image: string;
    tags: string[];
    github?: string;
    demo?: string;
    members: string[];
}

export default function ProjectCard({ project }: { project: ProjectProps }) {
    return (
        <div className="group glass-panel rounded-xl overflow-hidden border border-white/10 hover:border-neon-blue/50 transition-all duration-300">
            <div className="relative h-56 overflow-hidden">
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-panel-bg via-transparent to-transparent opacity-80" />

                <div className="absolute bottom-4 left-4 right-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex gap-2 flex-wrap mb-2">
                        {project.tags.map(tag => (
                            <span key={tag} className="text-[10px] uppercase font-bold px-2 py-1 bg-neon-blue/20 text-neon-blue rounded-full backdrop-blur-md">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <h3 className="text-2xl font-bold text-white font-orbitron group-hover:text-neon-blue transition-colors">
                        {project.title}
                    </h3>
                </div>
            </div>

            <div className="p-6">
                <p className="text-gray-400 text-sm mb-6 line-clamp-3">
                    {project.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex -space-x-2">
                        {project.members.map((member, i) => (
                            <div key={i} className="h-8 w-8 rounded-full bg-gray-800 border border-black flex items-center justify-center text-xs text-white" title={member}>
                                {member.charAt(0)}
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3">
                        {project.github && (
                            <Link href={project.github} className="text-gray-400 hover:text-white transition-colors">
                                <Github className="h-5 w-5" />
                            </Link>
                        )}
                        {project.demo && (
                            <Link href={project.demo} className="text-gray-400 hover:text-neon-blue transition-colors">
                                <ExternalLink className="h-5 w-5" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
