'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { loginApi } from '@/lib/api/auth';
import { ApiRequestError } from '@/lib/api/client';

interface FormErrors {
    email?: string;
    password?: string;
    general?: string;
}

function validate(email: string, password: string): FormErrors {
    const errors: FormErrors = {};
    if (!email) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address';
    if (!password) errors.password = 'Password is required';
    return errors;
}

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const validation = validate(email, password);
        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }
        setErrors({});
        setIsLoading(true);
        try {
            const result = await loginApi({ email, password });
            login(result.token, result.user);
            router.push('/projects');
        } catch (err) {
            setErrors({
                general: err instanceof ApiRequestError ? err.message : 'Invalid email or password',
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
                            Sign in
                        </h1>
                        <p className="text-slate-500 text-[13.5px] m-0">
                            Enter your credentials to access your workspace
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
                        {/* Email Field */}
                        <div className="mb-[18px]">
                            <label
                                htmlFor="login-email"
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
                                    id="login-email"
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
                        <div className="mb-[18px]">
                            <div className="flex items-center justify-between mb-1.5">
                                <label
                                    htmlFor="login-password"
                                    className="text-[11px] font-bold tracking-[0.06em] text-slate-600 uppercase"
                                >
                                    PASSWORD
                                </label>
                                <span
                                    className="text-xs font-medium text-brand cursor-pointer"
                                    onClick={() => alert('Please contact your administrator to reset your password.')}
                                >
                                    Forgot password?
                                </span>
                            </div>
                            <div className="relative">
                                <Lock
                                    size={16}
                                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                />
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
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

                        {/* Sign In Button */}
                        <button
                            id="login-submit"
                            type="submit"
                            disabled={isLoading}
                            className="auth-primary-button mt-1.5"
                        >
                            {isLoading ? 'Signing in…' : 'Sign in'}
                        </button>
                    </form>

                    {/* OR Divider */}
                    <div className="auth-divider">
                        <span className="auth-divider-line" />
                        <span className="auth-divider-text">OR</span>
                        <span className="auth-divider-line" />
                    </div>

                    {/* Register Redirect */}
                    <div className="text-center mb-6">
                        <p className="text-[13px] text-slate-600 m-0">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-brand font-bold no-underline">
                                Create an account
                            </Link>
                        </p>
                    </div>

                    {/* Footer Legal Terms */}
                    <div className="border-t border-slate-100 pt-[18px] text-center">
                        <p className="text-[11px] text-slate-400 m-0 leading-relaxed">
                            By signing in, you agree to our{' '}
                            <span className="text-slate-600 font-semibold cursor-pointer">Terms</span> and{' '}
                            <span className="text-slate-600 font-semibold cursor-pointer">Privacy Policy</span>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
