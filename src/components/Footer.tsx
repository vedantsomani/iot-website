import { Container } from "@/components/ui/Container";
import Link from "next/link";
import { Github, Instagram, Linkedin, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-border-subtle bg-surface-0 pt-10 pb-6 mt-auto">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-bold font-orbitron text-white mb-3">
                            IoT & Robotics Club
                        </h3>
                        <p className="text-text-tertiary text-sm leading-relaxed">
                            Bennett University's hub for innovation, automation, and cutting-edge technology.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-white mb-3 font-display">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-text-tertiary">
                            <li><Link href="/about" className="hover:text-accent-primary transition-colors link-underline">About Us</Link></li>
                            <li><Link href="/events" className="hover:text-accent-primary transition-colors link-underline">Events</Link></li>
                            <li><Link href="/projects" className="hover:text-accent-primary transition-colors link-underline">Projects</Link></li>
                            <li><Link href="/join" className="hover:text-accent-primary transition-colors link-underline">Join Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-white mb-3 font-display">Connect</h4>
                        <div className="flex space-x-4 mb-4">
                            <Link href="https://www.instagram.com/iot_and_robotics_bu/" target="_blank" className="text-text-tertiary hover:text-pink-400 transition-colors duration-300">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="https://www.linkedin.com/in/iot-and-robotics-club-bu-8a4858299/" target="_blank" className="text-text-tertiary hover:text-blue-400 transition-colors duration-300">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                            <Link href="https://github.com" target="_blank" className="text-text-tertiary hover:text-white transition-colors duration-300">
                                <Github className="h-5 w-5" />
                            </Link>
                            <Link href="mailto:technotix.club@bennett.edu.in" className="text-text-tertiary hover:text-accent-primary transition-colors duration-300">
                                <Mail className="h-5 w-5" />
                            </Link>
                        </div>
                        <p className="text-text-tertiary text-xs">
                            technotix.club@bennett.edu.in
                        </p>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border-subtle text-center text-xs text-text-tertiary">
                    <p>&copy; {new Date().getFullYear()} IoT & Robotics Club, Bennett University. Made with ❤️ by IoT & Robotics Club · Built by Vedant Somani</p>
                </div>
            </Container>
        </footer>
    );
}
