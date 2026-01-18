import Link from "next/link";
import Image from "next/image";
import { Github, Instagram, Linkedin, Globe } from "lucide-react";

interface TeamMemberProps {
    name: string;
    role: string;
    image: string;
    linkedin?: string;
    instagram?: string;
    github?: string;
    website?: string;
}

export default function TeamMemberCard({ member }: { member: TeamMemberProps }) {
    return (
        <div className="group relative overflow-hidden rounded-xl glass-panel border border-white/10 hover:border-neon-blue/50 transition-all duration-500">
            <div className="aspect-square relative overflow-hidden">
                <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm">
                    {member.linkedin && (
                        <Link href={member.linkedin} target="_blank" className="text-white hover:text-neon-blue hover:scale-110 transition-all">
                            <Linkedin className="h-6 w-6" />
                        </Link>
                    )}
                    {member.instagram && (
                        <Link href={member.instagram} target="_blank" className="text-white hover:text-neon-purple hover:scale-110 transition-all">
                            <Instagram className="h-6 w-6" />
                        </Link>
                    )}
                    {member.github && (
                        <Link href={member.github} target="_blank" className="text-white hover:text-gray-300 hover:scale-110 transition-all">
                            <Github className="h-6 w-6" />
                        </Link>
                    )}
                    {member.website && (
                        <Link href={member.website} target="_blank" className="text-white hover:text-neon-blue hover:scale-110 transition-all">
                            <Globe className="h-6 w-6" />
                        </Link>
                    )}
                </div>
            </div>

            <div className="p-4 text-center bg-panel-bg relative z-10">
                <h3 className="text-lg font-bold text-white font-orbitron group-hover:text-neon-blue transition-colors">
                    {member.name}
                </h3>
                <p className="text-xs text-neon-purple uppercase tracking-wider mt-1 font-semibold">
                    {member.role}
                </p>
            </div>
        </div>
    );
}
