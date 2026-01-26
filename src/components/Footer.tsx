import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { Github, Instagram, Linkedin, Twitter, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-panel-bg border-t border-white/10 pt-10 pb-6 mt-auto">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-bold font-orbitron text-white mb-4">
                            IoT & ROBOTICS CLUB
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Bennett University's hub for innovation, automation, and cutting-edge technology.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="/about" className="hover:text-neon-blue transition-colors">About Us</Link></li>
                            <li><Link href="/events" className="hover:text-neon-blue transition-colors">Events</Link></li>
                            <li><Link href="/projects" className="hover:text-neon-blue transition-colors">Projects</Link></li>
                            <li><Link href="/join" className="hover:text-neon-blue transition-colors">Join Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Connect With Us</h4>
                        <div className="flex space-x-4">
                            <Link href="https://www.instagram.com/iot_and_robotics_bu/" target="_blank" className="text-gray-400 hover:text-neon-purple transition-colors">
                                <Instagram className="h-6 w-6" />
                            </Link>
                            <Link href="https://www.linkedin.com/in/iot-and-robotics-club-bu-8a4858299/" target="_blank" className="text-gray-400 hover:text-neon-blue transition-colors">
                                <Linkedin className="h-6 w-6" />
                            </Link>
                            <Link href="https://github.com" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                                <Github className="h-6 w-6" />
                            </Link>
                            <Link href="mailto:technotix.club@bennett.edu.in" className="text-gray-400 hover:text-neon-blue transition-colors">
                                <Mail className="h-6 w-6" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} IoT & Robotics Club, Bennett University. All rights reserved. <br className="md:hidden" /> <span className="hidden md:inline">|</span> Made by <span className="text-neon-blue">Vedant Somani</span></p>
                </div>
            </Container>
        </footer>
    );
}
