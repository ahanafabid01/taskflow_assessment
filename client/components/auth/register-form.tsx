'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { registerApi } from '@/lib/api/auth';
import { ApiRequestError } from '@/lib/api/client';

interface FormErrors {
    name?: string;
    email?: string;
    password?: string;
    general?: string;
}

function validate(name: string, email: string, password: string): FormErrors {
    const errors: FormErrors = {};
    if (!name.trim()) errors.name = 'Full name is required';
    if (!email) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address';
    if (!password) errors.password = 'Password is required';
    else if (password.length < 8) errors.password = 'Password must be at least 8 characters';
    return errors;
}

export function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const validation = validate(name, email, password);
        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }
        setErrors({});
        setIsLoading(true);
        try {
            const result = await registerApi({ name, email, password });
            login(result.token, result.user);
            router.push('/projects');
        } catch (err) {
            setErrors({
                general: err instanceof ApiRequestError ? err.message : 'Registration failed. Please try again.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="auth-split-wrapper">
            {/* Left Hero Sidebar — Visible on Desktop/Tablet */}
            <aside className="auth-hero-sidebar">
                <div className="auth-hero-glow" />

                {/* Brand Logo & Suite Tagline */}
                <div className="flex items-center gap-3 z-[2]">
                    <div className="w-[42px] h-[42px] rounded-[10px] bg-white/[0.08] border border-white/[0.18] flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-sm shrink-0">
                        <Image src="/brand/icon.svg" alt="TaskFlow" width={26} height={26} priority />
                    </div>
                    <div>
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-[22px] font-extrabold text-white tracking-[-0.03em] font-brand">
                                Task<span className="text-sky-300">Flow</span>
                            </span>
                        </div>
                        <span className="block text-[10px] font-bold tracking-[0.12em] text-white/65 uppercase">
                            ENTERPRISE SUITE
                        </span>
                    </div>
                </div>

                {/* Hero Headline & Description */}
                <div className="z-[2] my-auto py-10">
                    <h2 className="text-[clamp(26px,3vw,36px)] font-extrabold text-white leading-tight tracking-[-0.025em] mb-4">
                        Collaborative Task &<br />Project Management
                    </h2>
                    <p className="text-[14.5px] leading-relaxed text-white/75 max-w-[380px] m-0">
                        Streamline operations, track tasks in real time, and empower your team with our comprehensive Kanban platform.
                    </p>
                </div>

                {/* Left Footer */}
                <div className="z-[2]">
                    <span className="text-xs text-white/45">© TaskFlow Inc. All rights reserved.</span>
                </div>
            </aside>

            {/* Right Form Container */}
            <main className="auth-form-container">
                <div className="auth-form-card">
                    {/* Mobile Brand Header */}
                    <div className="auth-mobile-logo">
                        <div className="flex items-center justify-center gap-3 mx-auto">
                            <div className="w-[42px] h-[42px] rounded-[10px] bg-navy border border-blue-800/30 flex items-center justify-center shadow-[0_6px_16px_rgba(15,41,74,0.2)] shrink-0">
                                <Image src="/brand/icon.svg" alt="TaskFlow" width={26} height={26} priority />
                            </div>
                            <div className="text-left">
                                <div className="text-[22px] font-extrabold text-navy tracking-[-0.02em] font-brand leading-[1.1]">
                                    Task<span className="text-brand">Flow</span>
                                </div>
                                <span className="block text-[9.5px] font-bold tracking-[0.12em] text-slate-500 uppercase mt-0.5">
                                    TASK SUITE
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="mb-6">
                        <h1 className="text-[26px] font-bold text-slate-900 tracking-[-0.025em] mb-1.5">
                            Create an account
                        </h1>
                        <p className="text-slate-500 text-[13.5px] m-0">
                            Start collaborating with your team on TaskFlow
                        </p>
                    </div>

                    {/* General Error Banner */}
                    {errors.general && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3.5 py-2.5 mb-5 text-red-700 text-[13px]">
                            <AlertCircle size={16} className="shrink-0" />
                            <span>{errors.general}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Name Field */}
                        <div className="mb-4">
                            <label
                                htmlFor="register-name"
                                className="block text-[11px] font-bold tracking-[0.06em] text-slate-600 uppercase mb-1.5"
                            >
                                FULL NAME
                            </label>
                            <div className="relative">
                                <UserIcon
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                />
                                <input
                                    id="register-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Jane Doe"
                                    autoComplete="name"
                                    className={`auth-input ${errors.name ? 'border-red-400' : ''}`}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-500 text-xs mt-1.5 ml-0.5">{errors.name}</p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="mb-4">
                            <label
                                htmlFor="register-email"
                                className="block text-[11px] font-bold tracking-[0.06em] text-slate-600 uppercase mb-1.5"
                            >
                                EMAIL ADDRESS
                            </label>
                            <div className="relative">
                                <Mail
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                />
                                <input
                                    id="register-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    autoComplete="email"
                                    className={`auth-input ${errors.email ? 'border-red-400' : ''}`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1.5 ml-0.5">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="mb-5">
                            <label
                                htmlFor="register-password"
                                className="block text-[11px] font-bold tracking-[0.06em] text-slate-600 uppercase mb-1.5"
                            >
                                PASSWORD
                            </label>
                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                />
                                <input
                                    id="register-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 8 characters"
                                    autoComplete="new-password"
                                    className={`auth-input pr-10 ${errors.password ? 'border-red-400' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none p-1 cursor-pointer text-slate-400 flex items-center justify-center"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1.5 ml-0.5">{errors.password}</p>
                            )}
                        </div>

                        {/* Register Button */}
                        <button
                            id="register-submit"
                            type="submit"
                            disabled={isLoading}
                            className="auth-primary-button"
                        >
                            {isLoading ? 'Creating account…' : 'Create Account'}
                        </button>
                    </form>

                    {/* OR Divider */}
                    <div className="auth-divider">
                        <span className="auth-divider-line" />
                        <span className="auth-divider-text">OR</span>
                        <span className="auth-divider-line" />
                    </div>

                    {/* Login Redirect */}
                    <div className="text-center mb-6">
                        <p className="text-[13px] text-slate-600 m-0">
                            Already have an account?{' '}
                            <Link href="/login" className="text-brand font-bold no-underline">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Footer Legal Terms */}
                    <div className="border-t border-slate-100 pt-[18px] text-center">
                        <p className="text-[11px] text-slate-400 m-0 leading-relaxed">
                            By signing up, you agree to our{' '}
                            <span className="text-slate-600 font-semibold cursor-pointer">Terms</span> and{' '}
                            <span className="text-slate-600 font-semibold cursor-pointer">Privacy Policy</span>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
