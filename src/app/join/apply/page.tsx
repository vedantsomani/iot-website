"use client";

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Upload, Send, CheckCircle, FileText, X } from 'lucide-react';
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

export default function ApplyPage() {
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("File size must be less than 5MB");
                return;
            }
            // Validate file type
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert("Only PDF, JPEG, PNG, or WebP files are allowed");
                return;
            }
            setUploadedFile(file);
        }
    };

    const removeFile = () => {
        setUploadedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.target as HTMLFormElement);

            // Validate email
            const email = formData.get('email') as string;
            const emailRegex = /^[a-zA-Z0-9._%+-]+@(bennett\.edu\.in|gmail\.com)$/i;

            if (!emailRegex.test(email.trim())) {
                alert("Restricted Access: Only @bennett.edu.in and @gmail.com domains are authorized.");
                setIsSubmitting(false);
                return;
            }

            // Add file if uploaded
            if (uploadedFile) {
                formData.append('resume', uploadedFile);
            }

            // Submit to API
            const response = await fetch('/api/join', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to submit application');
            }

            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('Application failed to send. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Container className="text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-panel p-12 rounded-2xl border border-neon-blue/30 inline-block"
                    >
                        <CheckCircle className="w-20 h-20 text-neon-blue mx-auto mb-6" />
                        <h2 className="text-3xl font-bold font-orbitron text-white mb-4">Application Submitted!</h2>
                        <p className="text-white/70 mb-8 max-w-md">
                            Thanks for applying to the IoT & Robotics Club.
                            Our team will review your application and get back to you shortly.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button asChild variant="outline">
                                <Link href="/join">Back to Join Page</Link>
                            </Button>
                            <Button onClick={() => {
                                setSubmitted(false);
                                setUploadedFile(null);
                            }}>
                                Submit Another
                            </Button>
                        </div>
                    </motion.div>
                </Container>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <Section className="bg-gradient-to-b from-black to-black/90 border-b border-white/5 relative overflow-hidden" spacing="small">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/10 to-neon-blue/10" />

                <Container className="relative z-10">
                    <Link
                        href="/join"
                        className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Join
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-white mb-4">
                            APPLICATION <span className="text-neon-purple">FORM</span>
                        </h1>
                        <p className="text-white/70 max-w-2xl text-lg">
                            Complete all fields below. Upload your resume or portfolio to strengthen your application.
                        </p>
                    </motion.div>
                </Container>
            </Section>

            {/* Application Form */}
            <Section>
                <Container className="max-w-3xl">
                    <motion.form
                        onSubmit={handleSubmit}
                        className="glass-panel p-8 md:p-10 rounded-2xl border border-white/10 space-y-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Personal Details */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold font-orbitron text-white border-b border-white/10 pb-2">
                                01. Personal Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Full Name *</label>
                                    <input
                                        name="name"
                                        required
                                        type="text"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Phone Number *</label>
                                    <input
                                        name="phone"
                                        required
                                        type="tel"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm mb-2">Email Address *</label>
                                <input
                                    name="email"
                                    required
                                    type="email"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all"
                                    placeholder="john.doe@bennett.edu.in"
                                />
                                <p className="text-white/50 text-xs mt-1">Only @bennett.edu.in or @gmail.com accepted</p>
                            </div>
                        </div>

                        {/* Academic Details */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold font-orbitron text-white border-b border-white/10 pb-2">
                                02. Academic Info
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Current Year *</label>
                                    <select
                                        name="year"
                                        required
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-all"
                                    >
                                        <option value="">Select Year</option>
                                        <option value="1">1st Year</option>
                                        <option value="2">2nd Year</option>
                                        <option value="3">3rd Year</option>
                                        <option value="4">4th Year</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-white/70 text-sm mb-2">Branch / Course *</label>
                                    <input
                                        name="branch"
                                        required
                                        type="text"
                                        className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all"
                                        placeholder="e.g. B.Tech CSE"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Club Preferences */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold font-orbitron text-white border-b border-white/10 pb-2">
                                03. Club Preferences
                            </h3>

                            <div>
                                <label className="block text-white/70 text-sm mb-2">Which team are you most interested in? *</label>
                                <select
                                    name="team"
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-all"
                                >
                                    <option value="">Select Team</option>
                                    <option value="tech">Tech Team (IoT, Robotics, Coding)</option>
                                    <option value="design">Design Team (UI/UX, Graphics)</option>
                                    <option value="multimedia">Multimedia Team (Video, Photo)</option>
                                    <option value="social-media">Social Media Team</option>
                                    <option value="management">Management Team</option>
                                    <option value="pr">Public Relations (PR)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm mb-2">Technical Skills / Tools Known</label>
                                <textarea
                                    name="skills"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all h-24 resize-none"
                                    placeholder="e.g. Arduino, Python, Photoshop, Premiere Pro, etc."
                                />
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm mb-2">Why do you want to join the club? *</label>
                                <textarea
                                    name="motivation"
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all h-32 resize-none"
                                    placeholder="Tell us about your interests and what you hope to learn..."
                                />
                            </div>

                            <div>
                                <label className="block text-white/70 text-sm mb-2">Portfolio / GitHub / LinkedIn Link</label>
                                <input
                                    name="portfolio"
                                    type="url"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue/50 transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        {/* File Upload Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold font-orbitron text-white border-b border-white/10 pb-2">
                                04. Upload Documents
                            </h3>

                            <div>
                                <label className="block text-white/70 text-sm mb-2">Resume / Portfolio (Optional)</label>
                                <p className="text-white/50 text-xs mb-3">Upload your resume or portfolio. Max 5MB. PDF, JPEG, PNG, or WebP only.</p>

                                {!uploadedFile ? (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-neon-blue/50 hover:bg-neon-blue/5 transition-all group"
                                    >
                                        <Upload className="w-10 h-10 text-white/40 mx-auto mb-3 group-hover:text-neon-blue transition-colors" />
                                        <p className="text-white/70 group-hover:text-white transition-colors">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-white/40 text-sm mt-1">PDF, JPEG, PNG, WebP (max 5MB)</p>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            className="hidden"
                                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4 bg-neon-blue/10 border border-neon-blue/30 rounded-xl p-4">
                                        <FileText className="w-8 h-8 text-neon-blue flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white font-medium truncate">{uploadedFile.name}</p>
                                            <p className="text-white/50 text-sm">
                                                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeFile}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5 text-white/70 hover:text-white" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full gap-2 text-lg py-6 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>Processing...</>
                            ) : (
                                <>Submit Application <Send className="w-5 h-5" /></>
                            )}
                        </Button>
                    </motion.form>
                </Container>
            </Section>
        </div>
    );
}
