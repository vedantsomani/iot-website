"use client";

import { Mail, MapPin, Phone, Send } from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
    return (
        <div className="min-h-screen pb-20">
            <div className="bg-panel-bg py-20 px-4 text-center border-b border-white/5">
                <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-white mb-4 text-glow">
                    CONTACT <span className="text-neon-blue">US</span>
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Get in touch with us for collaborations, membership queries, or just to say hi!
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Contact Info */}
                <div className="space-y-12">
                    {/* How to Join Section */}
                    <div className="glass-panel p-6 rounded-xl border border-neon-blue/30 box-glow">
                        <h2 className="text-2xl font-bold font-orbitron text-white mb-4">How to <span className="text-neon-blue">Join?</span></h2>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-start gap-3">
                                <div className="min-w-6 h-6 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue text-sm font-bold">1</div>
                                <p>Fill out the membership form (available during recruitment drives).</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="min-w-6 h-6 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue text-sm font-bold">2</div>
                                <p>Attend our introductory workshop or general body meeting.</p>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="min-w-6 h-6 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue text-sm font-bold">3</div>
                                <p>Join our Discord/WhatsApp community to stay updated.</p>
                            </li>
                        </ul>
                        <div className="mt-6">
                            <button className="w-full py-2 bg-neon-blue text-black font-bold rounded hover:bg-white transition-colors text-sm">
                                Open Membership Form
                            </button>
                        </div>
                    </div>

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
                                    <p className="text-gray-400">iotclub@bennett.edu.in</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-white/5 p-3 rounded-lg text-neon-purple">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">Call Us</h3>
                                    <p className="text-gray-400">+91 98765 43210 (President)</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="bg-white/5 p-3 rounded-lg text-green-400">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold mb-1">Visit Us</h3>
                                    <p className="text-gray-400">
                                        IoT & Robotics Lab (L-103)<br />
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
                    <h2 className="text-2xl font-bold font-orbitron text-white mb-6">Send a Message</h2>
                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">First Name</label>
                                <input type="text" className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder="John" />
                            </div>
                            <div>
                                <label className="block text-gray-400 text-sm mb-2">Last Name</label>
                                <input type="text" className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder="Doe" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                            <input type="email" className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors" placeholder="john@example.com" />
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Subject</label>
                            <select className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors">
                                <option>Membership Inquiry</option>
                                <option>Collaboration</option>
                                <option>General Question</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-400 text-sm mb-2">Message</label>
                            <textarea className="w-full bg-black/40 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors h-32" placeholder="Your message here..."></textarea>
                        </div>

                        <button className="w-full bg-neon-blue text-black font-bold py-3 rounded hover:bg-white transition-colors flex items-center justify-center gap-2">
                            <Send className="h-4 w-4" /> Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
