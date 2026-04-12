"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle } from "lucide-react";
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
        <div className="min-h-screen bg-dots">
            <Section spacing="small" className="border-b border-border-subtle">
                <Container className="text-left">
                    <h1 className="text-4xl md:text-6xl font-bold font-orbitron text-white mb-4">
                        Contact
                    </h1>
                    <p className="text-text-secondary max-w-2xl font-display">
                        Get in touch for collaborations, membership queries, or just to say hi!
                    </p>
                </Container>
            </Section>

            <Section>
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <span className="text-xs font-mono uppercase tracking-widest text-accent-primary mb-4 block">Get in touch</span>
                                <h2 className="text-2xl font-bold font-display text-white mb-4">We'd love to hear from you</h2>
                                <p className="text-text-secondary text-sm leading-relaxed">
                                    Have a question about our workshops? Want to sponsor an event? Or are you looking to join? Drop us a message!
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4 card-outline rounded-xl p-4">
                                    <div className="p-2.5 rounded-lg bg-accent-primary/10 text-accent-primary shrink-0">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm mb-0.5">Email</h3>
                                        <p className="text-text-tertiary text-sm">technotix.club@bennett.edu.in</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 card-outline rounded-xl p-4">
                                    <div className="p-2.5 rounded-lg bg-accent-secondary/10 text-accent-secondary shrink-0">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm mb-0.5">Phone</h3>
                                        <p className="text-text-tertiary text-sm">+91 9219145820 (President)</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 card-outline rounded-xl p-4">
                                    <div className="p-2.5 rounded-lg bg-accent-success/10 text-accent-success shrink-0">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm mb-0.5">Visit Us</h3>
                                        <p className="text-text-tertiary text-sm">
                                            IoT & Robotics Lab (B La 105)<br />
                                            Bennett University, Greater Noida<br />
                                            Uttar Pradesh, India
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Google Maps Embed */}
                            <div className="h-56 rounded-xl overflow-hidden border border-border-subtle">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.3850119853965!2d77.58223617549704!3d28.457850875760594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cbf94deb6bc39%3A0x7ba6bedc9a2b537f!2sBennett%20University%20(Times%20of%20India%20Group)!5e0!3m2!1sen!2sin!4v1713500854341!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Bennett University Location"
                                />
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="card-solid p-6 md:p-8 rounded-2xl">
                            {submitted ? (
                                <div className="text-center py-12">
                                    <CheckCircle className="w-14 h-14 text-accent-success mx-auto mb-4" />
                                    <h2 className="text-xl font-bold text-white mb-2 font-display">Message Sent!</h2>
                                    <p className="text-text-tertiary text-sm">We'll get back to you shortly.</p>
                                    <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-6">Send Another</Button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-xl font-bold font-display text-white mb-6">Send a Message</h2>
                                    <form className="space-y-5" onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-text-tertiary text-xs mb-1.5 font-mono uppercase tracking-wide">First Name</label>
                                                <input name="firstName" required type="text" className="w-full bg-surface-0 border border-border-default rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent-primary transition-colors" placeholder="John" />
                                            </div>
                                            <div>
                                                <label className="block text-text-tertiary text-xs mb-1.5 font-mono uppercase tracking-wide">Last Name</label>
                                                <input name="lastName" required type="text" className="w-full bg-surface-0 border border-border-default rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent-primary transition-colors" placeholder="Doe" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-text-tertiary text-xs mb-1.5 font-mono uppercase tracking-wide">Email</label>
                                            <input name="email" required type="email" className="w-full bg-surface-0 border border-border-default rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent-primary transition-colors" placeholder="you@bennett.edu.in" />
                                        </div>

                                        <div>
                                            <label className="block text-text-tertiary text-xs mb-1.5 font-mono uppercase tracking-wide">Subject</label>
                                            <select name="subject" className="w-full bg-surface-0 border border-border-default rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent-primary transition-colors">
                                                <option>Membership Inquiry</option>
                                                <option>Collaboration</option>
                                                <option>General Question</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-text-tertiary text-xs mb-1.5 font-mono uppercase tracking-wide">Message</label>
                                            <textarea name="message" required className="w-full bg-surface-0 border border-border-default rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-accent-primary transition-colors h-28 resize-none" placeholder="Your message here..." />
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
