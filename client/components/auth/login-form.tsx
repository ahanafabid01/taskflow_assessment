'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
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
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email';
    if (!password) errors.password = 'Password is required';
    return errors;
}

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        <div
            style={{
                minHeight: '100dvh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px 16px',
                background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124, 106, 247, 0.15), var(--bg-primary) 100%)',
            }}
        >
            {/* Brand Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
                <div
                    style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(124, 106, 247, 0.2)',
                    }}
                >
                    <Image src="/brand/icon.svg" alt="TaskFlow" width={22} height={22} priority />
                </div>
                <span
                    className="font-logo"
                    style={{
                        fontSize: '20px',
                        color: 'var(--text-primary)',
                    }}
                >
                    TaskFlow
                </span>
            </div>

            {/* Card Container */}
            <div
                className="glass-card"
                style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '32px 28px',
                    boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.06)',
                    borderRadius: '16px',
                }}
            >
                <div style={{ marginBottom: '24px' }}>
                    <h1
                        className="font-brand"
                        style={{
                            fontSize: '20px',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.3px',
                            marginBottom: '4px',
                        }}
                    >
                        Sign in
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                        Enter your email and password to continue
                    </p>
                </div>

                {errors.general && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(240, 80, 96, 0.1)',
                            border: '1px solid rgba(240, 80, 96, 0.25)',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            marginBottom: '18px',
                            color: 'var(--accent-red)',
                            fontSize: '13px',
                        }}
                    >
                        <AlertCircle size={15} style={{ flexShrink: 0 }} />
                        <span>{errors.general}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    {/* Email */}
                    <div style={{ marginBottom: '16px' }}>
                        <label
                            style={{
                                display: 'block',
                                fontSize: '12.5px',
                                fontWeight: 500,
                                color: 'var(--text-secondary)',
                                marginBottom: '6px',
                            }}
                        >
                            Email address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail
                                size={15}
                                style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)',
                                    pointerEvents: 'none',
                                }}
                            />
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                autoComplete="email"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px 10px 36px',
                                    background: 'var(--bg-elevated)',
                                    border: `1px solid ${errors.email ? 'var(--accent-red)' : 'var(--border)'}`,
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-purple)')}
                                onBlur={(e) => (e.target.style.borderColor = errors.email ? 'var(--accent-red)' : 'var(--border)')}
                            />
                        </div>
                        {errors.email && (
                            <p style={{ color: 'var(--accent-red)', fontSize: '11.5px', marginTop: '4px' }}>{errors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '22px' }}>
                        <label
                            style={{
                                display: 'block',
                                fontSize: '12.5px',
                                fontWeight: 500,
                                color: 'var(--text-secondary)',
                                marginBottom: '6px',
                            }}
                        >
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock
                                size={15}
                                style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)',
                                    pointerEvents: 'none',
                                }}
                            />
                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="current-password"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px 10px 36px',
                                    background: 'var(--bg-elevated)',
                                    border: `1px solid ${errors.password ? 'var(--accent-red)' : 'var(--border)'}`,
                                    borderRadius: '8px',
                                    color: 'var(--text-primary)',
                                    fontSize: '14px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-purple)')}
                                onBlur={(e) => (e.target.style.borderColor = errors.password ? 'var(--accent-red)' : 'var(--border)')}
                            />
                        </div>
                        {errors.password && (
                            <p style={{ color: 'var(--accent-red)', fontSize: '11.5px', marginTop: '4px' }}>{errors.password}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        id="login-submit"
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: '100%',
                            padding: '11px 16px',
                            background: isLoading
                                ? 'var(--bg-elevated)'
                                : 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 10px rgba(124, 106, 247, 0.3)',
                        }}
                    >
                        <span>{isLoading ? 'Signing in…' : 'Sign in'}</span>
                        {!isLoading && <ArrowRight size={14} />}
                    </button>
                </form>

                <div
                    style={{
                        marginTop: '20px',
                        paddingTop: '16px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        textAlign: 'center',
                    }}
                >
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Don&apos;t have an account?{' '}
                        <Link
                            href="/register"
                            style={{ color: 'var(--accent-purple)', fontWeight: 600, textDecoration: 'none' }}
                        >
                            Create one
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
