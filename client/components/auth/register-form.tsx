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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', zIndex: 2 }}>
                    <div
                        style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '10px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.18)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
                            backdropFilter: 'blur(8px)',
                            flexShrink: 0,
                        }}
                    >
                        <Image src="/brand/icon.svg" alt="TaskFlow" width={26} height={26} priority />
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                            <span style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.03em', fontFamily: 'Outfit, sans-serif' }}>
                                Task<span style={{ color: '#7c6af7' }}>Flow</span>
                            </span>
                        </div>
                        <span style={{ display: 'block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255, 255, 255, 0.65)', textTransform: 'uppercase' }}>
                            TASK SUITE
                        </span>
                    </div>
                </div>

                {/* Hero Headline & Description */}
                <div style={{ zIndex: 2, margin: 'auto 0', padding: '40px 0' }}>
                    <h2
                        style={{
                            fontSize: 'clamp(26px, 3vw, 36px)',
                            fontWeight: 800,
                            color: '#ffffff',
                            lineHeight: 1.25,
                            letterSpacing: '-0.025em',
                            marginBottom: '16px',
                        }}
                    >
                        Collaborative Task &<br />Project Management
                    </h2>
                    <p
                        style={{
                            fontSize: '14.5px',
                            lineHeight: 1.6,
                            color: 'rgba(255, 255, 255, 0.75)',
                            maxWidth: '380px',
                            margin: 0,
                        }}
                    >
                        Streamline operations, track tasks in real time, and empower your team with our comprehensive Kanban platform.
                    </p>
                </div>

                {/* Left Footer subtle copy */}
                <div style={{ zIndex: 2 }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.45)' }}>
                        © TaskFlow Inc. All rights reserved.
                    </span>
                </div>
            </aside>

            {/* Right Form Container */}
            <main className="auth-form-container">
                <div className="auth-form-card">
                    {/* Mobile Brand Header — Only visible on mobile/tablet */}
                    <div className="auth-mobile-logo">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '0 auto' }}>
                            <div
                                style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '10px',
                                    background: '#0f294a',
                                    border: '1px solid rgba(13, 71, 161, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 6px 16px rgba(15, 41, 74, 0.2)',
                                    flexShrink: 0,
                                }}
                            >
                                <Image src="/brand/icon.svg" alt="TaskFlow" width={26} height={26} priority />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '22px', fontWeight: 800, color: '#0f294a', letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif', lineHeight: 1.1 }}>
                                    Task<span style={{ color: '#7c6af7' }}>Flow</span>
                                </div>
                                <span style={{ display: 'block', fontSize: '9.5px', fontWeight: 700, letterSpacing: '0.12em', color: '#64748b', textTransform: 'uppercase', marginTop: '2px' }}>
                                    TASK SUITE
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Title & Subtitle */}
                    <div style={{ marginBottom: '24px' }}>
                        <h1
                            style={{
                                fontSize: '26px',
                                fontWeight: 700,
                                color: '#0f172a',
                                letterSpacing: '-0.025em',
                                marginBottom: '6px',
                            }}
                        >
                            Create an account
                        </h1>
                        <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>
                            Enter your details to get started with your workspace
                        </p>
                    </div>

                    {/* General Error Banner */}
                    {errors.general && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                background: '#fef2f2',
                                border: '1px solid #fecaca',
                                borderRadius: '8px',
                                padding: '10px 14px',
                                marginBottom: '20px',
                                color: '#b91c1c',
                                fontSize: '13px',
                            }}
                        >
                            <AlertCircle size={16} style={{ flexShrink: 0 }} />
                            <span>{errors.general}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        {/* Full Name Field */}
                        <div style={{ marginBottom: '18px' }}>
                            <label
                                htmlFor="register-name"
                                style={{
                                    display: 'block',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    letterSpacing: '0.06em',
                                    color: '#475467',
                                    textTransform: 'uppercase',
                                    marginBottom: '6px',
                                }}
                            >
                                FULL NAME
                            </label>
                            <div style={{ position: 'relative' }}>
                                <UserIcon
                                    size={16}
                                    style={{
                                        position: 'absolute',
                                        left: '14px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#94a3b8',
                                        pointerEvents: 'none',
                                    }}
                                />
                                <input
                                    id="register-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Alice Johnson"
                                    autoComplete="name"
                                    className="auth-input"
                                    style={{
                                        borderColor: errors.name ? '#ef4444' : '#cbd5e1',
                                    }}
                                />
                            </div>
                            {errors.name && (
                                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px', marginInlineStart: '2px' }}>
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div style={{ marginBottom: '18px' }}>
                            <label
                                htmlFor="register-email"
                                style={{
                                    display: 'block',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    letterSpacing: '0.06em',
                                    color: '#475467',
                                    textTransform: 'uppercase',
                                    marginBottom: '6px',
                                }}
                            >
                                EMAIL ADDRESS
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail
                                    size={16}
                                    style={{
                                        position: 'absolute',
                                        left: '14px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#94a3b8',
                                        pointerEvents: 'none',
                                    }}
                                />
                                <input
                                    id="register-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@company.com"
                                    autoComplete="email"
                                    className="auth-input"
                                    style={{
                                        borderColor: errors.email ? '#ef4444' : '#cbd5e1',
                                    }}
                                />
                            </div>
                            {errors.email && (
                                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px', marginInlineStart: '2px' }}>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div style={{ marginBottom: '18px' }}>
                            <label
                                htmlFor="register-password"
                                style={{
                                    display: 'block',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    letterSpacing: '0.06em',
                                    color: '#475467',
                                    textTransform: 'uppercase',
                                    marginBottom: '6px',
                                }}
                            >
                                PASSWORD
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock
                                    size={16}
                                    style={{
                                        position: 'absolute',
                                        left: '14px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#94a3b8',
                                        pointerEvents: 'none',
                                    }}
                                />
                                <input
                                    id="register-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="8+ characters"
                                    autoComplete="new-password"
                                    className="auth-input"
                                    style={{
                                        borderColor: errors.password ? '#ef4444' : '#cbd5e1',
                                        paddingRight: '40px',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        padding: '4px',
                                        cursor: 'pointer',
                                        color: '#94a3b8',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '5px', marginInlineStart: '2px' }}>
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Sign In Primary Button */}
                        <button
                            id="register-submit"
                            type="submit"
                            disabled={isLoading}
                            className="auth-primary-button"
                            style={{ marginTop: '6px' }}
                        >
                            {isLoading ? 'Creating account…' : 'Create account'}
                        </button>
                    </form>

                    {/* OR Divider */}
                    <div className="auth-divider">
                        <span className="auth-divider-line" />
                        <span className="auth-divider-text">OR</span>
                        <span className="auth-divider-line" />
                    </div>

                    {/* Product Walkthrough / Login Switch */}
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <p style={{ fontSize: '13px', color: '#475467', margin: 0 }}>
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                style={{
                                    color: '#0d47a1',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                }}
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Footer Legal Terms */}
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '18px', textAlign: 'center' }}>
                        <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                            By creating an account, you agree to our{' '}
                            <span style={{ color: '#475467', fontWeight: 600, cursor: 'pointer' }}>Terms</span> and{' '}
                            <span style={{ color: '#475467', fontWeight: 600, cursor: 'pointer' }}>Privacy Policy</span>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}


