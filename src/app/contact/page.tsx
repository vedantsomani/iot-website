"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target as HTMLFormElement);
            const data = Object.fromEntries(formData.entries());

            const emailRegex = /^[a-zA-Z0-9._%+-]+@(bennett\.edu\.in|gmail\.com)$/i;
            const email = (data.email as string).trim();

            if (!emailRegex.test(email)) {
                alert("Restricted Access: Only @bennett.edu.in and @gmail.com domains are authorized.");
                return;
            }

            await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            setSubmitted(true);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
        }
    };

    return (
        <div className="min-h-screen">
            <Section className="bg-panel-bg border-b border-white/5" spacing="small">
                <Container className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-white mb-4">
                        CONTACT <span className="text-neon-blue">US</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Get in touch with us for collaborations, membership queries, or just to say hi!
                    </p>
                </Container>
            </Section>

            <Section>
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Info */}
                        <div className="space-y-12">


                            <div>
                                <h2 className="text-3xl font-bold font-orbitron text-white mb-6">Get In Touch</h2>
                                <p className="text-gray-300 mb-8">
                                    Have a question about our workshops? Want to sponsor an event? Or are you a student looking to join? Drop us a message!
                                </p>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/5 p-3 rounded-lg text-neon-blue">
                                            <Mail className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold mb-1">Email Us</h3>
                                            <p className="text-gray-400">technotix.club@bennett.edu.in</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/5 p-3 rounded-lg text-neon-purple">
                                            <Phone className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold mb-1">Call Us</h3>
                                            <p className="text-gray-400">+91 9219145820 (President)</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-white/5 p-3 rounded-lg text-green-400">
                                            <MapPin className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold mb-1">Visit Us</h3>
                                            <p className="text-gray-400">
                                                IoT & Robotics Lab (B La 105)<br />
                                                Bennett University, Greater Noida<br />
                                                Uttar Pradesh, India
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="h-64 rounded-xl overflow-hidden glass-panel border border-white/10 relative">
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <MapPin className="h-5 w-5" /> Google Map Embed Placeholder
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="glass-panel p-8 rounded-2xl border border-white/10">
                            {submitted ? (
                                <div className="text-center py-12">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
                                    <p className="text-gray-400">We'll get back to you shortly.</p>
                                    <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-6">Send Another</Button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold font-orbitron text-white mb-6">Send a Message</h2>
                                    <form className="space-y-6" onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-gray-400 text-sm mb-2">First Name</label>
                                                <input name="firstName" required type="text" className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder="John" />
                                            </div>
                                            <div>
                                                <label className="block text-gray-400 text-sm mb-2">Last Name</label>
                                                <input name="lastName" required type="text" className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder="Doe" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                                            <input name="email" required type="email" className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder="john@example.com" />
                                        </div>

                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">Subject</label>
                                            <select name="subject" className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors">
                                                <option>Membership Inquiry</option>
                                                <option>Collaboration</option>
                                                <option>General Question</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-gray-400 text-sm mb-2">Message</label>
                                            <textarea name="message" required className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors h-32" placeholder="Your message here..."></textarea>
                                        </div>

                                        <Button className="w-full gap-2">
                                            <Send className="h-4 w-4" /> Send Message
                                        </Button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </Container>
            </Section>
        </div>
    );
}
