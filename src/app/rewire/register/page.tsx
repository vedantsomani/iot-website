'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProgressIndicator from '@/components/rewire/ProgressIndicator';
import SkillsSelect from '@/components/rewire/SkillsSelect';
import { REWIRE_CONFIG } from '@/lib/rewire/config';
import { ProfilePayload, Source } from '@/lib/rewire/types';

type RegistrationStep = 'form' | 'otp' | 'success';

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [step, setStep] = useState<RegistrationStep>('form');
    const [formData, setFormData] = useState<Partial<ProfilePayload>>({
        name: '',
        email: '',
        phone: '',
        college: '',
        year: '',
        skills: [],
        consent: false,
        source: 'ONLINE' as Source
    });

    const [otp, setOtp] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [generalError, setGeneralError] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [participantId, setParticipantId] = useState<string | null>(null);

    // Check if coming from stall
    useEffect(() => {
        const source = searchParams.get('source');
        if (source === 'stall') {
            setFormData(prev => ({ ...prev, source: 'STALL' as Source }));
        }
    }, [searchParams]);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error on change
        if (errors[name]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[name];
                return next;
            });
        }
    };

    const handleSkillsChange = (skills: string[]) => {
        setFormData(prev => ({ ...prev, skills }));
        if (errors.skills) {
            setErrors(prev => {
                const next = { ...prev };
                delete next.skills;
                return next;
            });
        }
    };

    // Step 1: Send OTP
    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setGeneralError('');

        // Basic validation before sending OTP
        const newErrors: Record<string, string> = {};
        if (!formData.name || formData.name.trim().length < 2) {
            newErrors.name = 'Please enter your full name';
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.phone || !/^[6-9]\d{9}$/.test(formData.phone.replace(/[\s-]/g, '').replace(/^\+91/, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }
        if (!formData.college || formData.college.trim().length < 2) {
            newErrors.college = 'Please enter your college name';
        }
        if (!formData.year) {
            newErrors.year = 'Please select your year of study';
        }
        if (!formData.skills || formData.skills.length === 0) {
            newErrors.skills = 'Please select at least one skill';
        }
        if (!formData.consent) {
            newErrors.consent = 'Please accept the terms to continue';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/rewire/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });

            const result = await response.json();

            if (!result.ok) {
                if (response.status === 429) {
                    setGeneralError('Too many requests. Please wait a moment and try again.');
                } else {
                    setGeneralError(result.message || 'Failed to send OTP. Please try again.');
                }
                return;
            }

            // Move to OTP step
            setOtpSent(true);
            setStep('otp');
            setResendTimer(60); // 60 second cooldown for resend

        } catch {
            setGeneralError('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        if (resendTimer > 0) return;

        setIsSubmitting(true);
        setGeneralError('');

        try {
            const response = await fetch('/api/rewire/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });

            const result = await response.json();

            if (result.ok) {
                setResendTimer(60);
                setGeneralError(''); // Clear any previous error
            } else {
                setGeneralError(result.message || 'Failed to resend OTP');
            }
        } catch {
            setGeneralError('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Step 2: Verify OTP and complete registration
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setGeneralError('');

        if (!otp || !/^\d{6}$/.test(otp)) {
            setGeneralError('Please enter a valid 6-digit OTP');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/rewire/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    otp
                })
            });

            const result = await response.json();

            if (!result.ok) {
                setGeneralError(result.message || 'Invalid OTP. Please try again.');
                return;
            }

            // Success! Store participant ID and redirect
            const pid = result.data?.participant_id;
            if (pid) {
                setParticipantId(pid);
                localStorage.setItem('rewire_participant_id', pid);
                setStep('success');

                // Redirect after short delay
                setTimeout(() => {
                    router.push(`/rewire/team?participant_id=${pid}`);
                }, 2000);
            }
        } catch {
            setGeneralError('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Render OTP Input
    const renderOTPStep = () => (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                type="button"
                onClick={() => {
                    setStep('form');
                    setOtp('');
                    setGeneralError('');
                }}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to form
            </button>

            {/* OTP Card */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>

                <h2 className="text-xl font-semibold mb-2">Verify Your Email</h2>
                <p className="text-gray-400 text-sm mb-6">
                    We&apos;ve sent a 6-digit code to<br />
                    <span className="text-cyan-400 font-medium">{formData.email}</span>
                </p>

                {/* Error Banner */}
                {generalError && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                        {generalError}
                    </div>
                )}

                <form onSubmit={handleVerifyOTP} className="space-y-4">
                    {/* OTP Input */}
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        maxLength={6}
                        className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        autoFocus
                    />

                    {/* Verify Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || otp.length !== 6}
                        className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Verifying...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Verify & Continue
                            </>
                        )}
                    </button>

                    {/* Resend OTP */}
                    <div className="text-sm text-gray-400">
                        Didn&apos;t receive the code?{' '}
                        {resendTimer > 0 ? (
                            <span className="text-gray-500">Resend in {resendTimer}s</span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={isSubmitting}
                                className="text-cyan-400 hover:underline"
                            >
                                Resend OTP
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <p className="text-center text-gray-500 text-sm">
                Check your spam folder if you don&apos;t see the email
            </p>
        </div>
    );

    // Render Success Step
    const renderSuccessStep = () => (
        <div className="bg-gray-800/50 border border-green-500/30 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Registration Complete!</h2>
            <p className="text-gray-400 mb-6">
                Your email has been verified. Redirecting to team setup...
            </p>

            <div className="animate-pulse flex justify-center gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animation-delay-200"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animation-delay-400"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Background gradient */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 -z-10" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent -z-10" />

            {/* Header */}
            <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold">
                            IoT
                        </div>
                        <span className="font-semibold hidden sm:block">IoT & Robotics Club</span>
                    </Link>
                    <span className="text-sm text-gray-400">
                        {REWIRE_CONFIG.EVENT_NAME} Registration
                    </span>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-lg">
                {/* Progress */}
                <ProgressIndicator currentStep={1} />

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Register Yourself
                    </h1>
                    <p className="text-gray-400">
                        {step === 'form' && 'Register individually first, then form a team.'}
                        {step === 'otp' && 'Verify your email to continue.'}
                        {step === 'success' && 'Email verified successfully!'}
                    </p>
                </div>

                {/* OTP Step */}
                {step === 'otp' && renderOTPStep()}

                {/* Success Step */}
                {step === 'success' && renderSuccessStep()}

                {/* Form Step */}
                {step === 'form' && (
                    <>
                        {/* Error Banner */}
                        {generalError && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                {generalError}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSendOTP} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Full Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${errors.name ? 'border-red-500' : 'border-gray-700'
                                        }`}
                                />
                                {errors.name && <p className="mt-1 text-red-400 text-sm">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Email Address <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your.email@example.com"
                                    className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${errors.email ? 'border-red-500' : 'border-gray-700'
                                        }`}
                                />
                                {errors.email && <p className="mt-1 text-red-400 text-sm">{errors.email}</p>}
                                <p className="mt-1 text-gray-500 text-xs">We&apos;ll send a verification code to this email</p>
                            </div>

                            {/* Phone */}
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Phone Number <span className="text-red-400">*</span>
                                </label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-4 py-3 bg-gray-700 border border-r-0 border-gray-700 rounded-l-xl text-gray-400 text-sm">
                                        +91
                                    </span>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="9876543210"
                                        maxLength={10}
                                        className={`w-full px-4 py-3 bg-gray-800 border rounded-r-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${errors.phone ? 'border-red-500' : 'border-gray-700'
                                            }`}
                                    />
                                </div>
                                {errors.phone && <p className="mt-1 text-red-400 text-sm">{errors.phone}</p>}
                            </div>

                            {/* College */}
                            <div>
                                <label htmlFor="college" className="block text-sm font-medium text-gray-300 mb-1.5">
                                    College/University <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="college"
                                    name="college"
                                    value={formData.college}
                                    onChange={handleChange}
                                    placeholder="Enter your college name"
                                    className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${errors.college ? 'border-red-500' : 'border-gray-700'
                                        }`}
                                />
                                {errors.college && <p className="mt-1 text-red-400 text-sm">{errors.college}</p>}
                            </div>

                            {/* Year */}
                            <div>
                                <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Year of Study <span className="text-red-400">*</span>
                                </label>
                                <select
                                    id="year"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${errors.year ? 'border-red-500' : 'border-gray-700'
                                        } ${!formData.year ? 'text-gray-500' : ''}`}
                                >
                                    <option value="">Select your year</option>
                                    {REWIRE_CONFIG.YEAR_OPTIONS.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                                {errors.year && <p className="mt-1 text-red-400 text-sm">{errors.year}</p>}
                            </div>

                            {/* Skills */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Your Skills <span className="text-red-400">*</span>
                                </label>
                                <SkillsSelect
                                    value={formData.skills || []}
                                    onChange={handleSkillsChange}
                                    error={errors.skills}
                                />
                            </div>

                            {/* Source */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    How did you hear about us?
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="source"
                                            value="ONLINE"
                                            checked={formData.source === 'ONLINE'}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-600 focus:ring-cyan-500"
                                        />
                                        <span className="text-gray-300">Online</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="source"
                                            value="STALL"
                                            checked={formData.source === 'STALL'}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-cyan-500 bg-gray-800 border-gray-600 focus:ring-cyan-500"
                                        />
                                        <span className="text-gray-300">At Stall</span>
                                    </label>
                                </div>
                            </div>

                            {/* Consent */}
                            <div className="pt-2">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="consent"
                                        checked={formData.consent}
                                        onChange={handleChange}
                                        className="w-5 h-5 mt-0.5 text-cyan-500 bg-gray-800 border-gray-600 rounded focus:ring-cyan-500"
                                    />
                                    <span className="text-sm text-gray-300">
                                        I agree to participate in {REWIRE_CONFIG.EVENT_NAME} and consent to receive event-related communications from {REWIRE_CONFIG.FROM_NAME}. <span className="text-red-400">*</span>
                                    </span>
                                </label>
                                {errors.consent && <p className="mt-1 text-red-400 text-sm">{errors.consent}</p>}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Sending OTP...
                                    </>
                                ) : (
                                    <>
                                        Send Verification Code
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                )}

                {/* Footer Note */}
                <p className="text-center text-gray-500 text-sm mt-8">
                    {REWIRE_CONFIG.CUTOFF_TEXT}
                </p>
                <p className="text-center text-gray-500 text-sm mt-2">
                    Need help? Contact us at {REWIRE_CONFIG.SUPPORT_CONTACT}
                </p>
            </main>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
            </div>
        }>
            <RegisterForm />
        </Suspense>
    );
}
