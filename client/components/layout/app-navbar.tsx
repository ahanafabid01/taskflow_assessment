'use client';

// components/layout/app-navbar.tsx
// Professional, responsive glassmorphic navigation header with full breadcrumb support and avatar-only mobile profile.

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

interface AppNavbarProps {
    breadcrumbs?: {
        label: string;
        href?: string;
    }[];
}

export function AppNavbar({ breadcrumbs }: AppNavbarProps) {
    const { user, logout } = useAuth();

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

    return (
        <header className="app-nav">
            <div className="page-container app-nav-inner">
                {/* Left: Brand & Breadcrumbs */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                    {/* Logo & Brand */}
                    <Link
                        href="/projects"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            textDecoration: 'none',
                            flexShrink: 0,
                        }}
                    >
                        <div
                            style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '7px',
                                background: '#0f294a',
                                border: '1px solid rgba(15, 41, 74, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                boxShadow: '0 2px 6px rgba(15, 41, 74, 0.15)',
                            }}
                        >
                            <Image
                                src="/brand/icon.svg"
                                alt="TaskFlow"
                                width={18}
                                height={18}
                                priority
                            />
                        </div>
                        <span
                            className="font-logo"
                            style={{
                                fontSize: '17px',
                                color: 'var(--text-primary)',
                                fontWeight: 800,
                            }}
                        >
                            Task<span style={{ color: '#0c3e78' }}>Flow</span>
                        </span>
                    </Link>

                    {/* Breadcrumbs */}
                    {breadcrumbs && breadcrumbs.length > 0 && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                minWidth: 0,
                                overflow: 'hidden',
                            }}
                        >
                            <ChevronRight size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />

                            {breadcrumbs.map((crumb, idx) => {
                                const isLast = idx === breadcrumbs.length - 1;

                                return (
                                    <div
                                        key={crumb.label}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            minWidth: 0,
                                        }}
                                    >
                                        {crumb.href ? (
                                            <Link
                                                href={crumb.href}
                                                style={{
                                                    fontSize: '13px',
                                                    fontWeight: 500,
                                                    color: 'var(--text-secondary)',
                                                    textDecoration: 'none',
                                                    padding: '2px 5px',
                                                    borderRadius: '5px',
                                                    transition: 'all 0.15s ease',
                                                    whiteSpace: 'nowrap',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.color = 'var(--text-primary)';
                                                    e.currentTarget.style.background = 'var(--bg-elevated)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                                    e.currentTarget.style.background = 'transparent';
                                                }}
                                            >
                                                {crumb.label}
                                            </Link>
                                        ) : (
                                            <span
                                                style={{
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    color: 'var(--text-primary)',
                                                    whiteSpace: 'nowrap',
                                                    padding: '2px 4px',
                                                }}
                                            >
                                                {crumb.label}
                                            </span>
                                        )}
                                        {!isLast && (
                                            <ChevronRight
                                                size={12}
                                                style={{ color: 'var(--text-muted)', flexShrink: 0 }}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right: User Profile & Actions */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexShrink: 0,
                    }}
                >
                    {/* User Profile (Avatar only on mobile, Avatar + Name on desktop) */}
                    {user && (
                        <div
                            className="nav-user-container"
                            title={user.name + (user.email ? ` (${user.email})` : '')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            {/* Avatar */}
                            <div
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #0c3e78, #1e40af)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: '#ffffff',
                                    boxShadow: '0 2px 6px rgba(12, 62, 120, 0.25)',
                                    flexShrink: 0,
                                }}
                            >
                                {userInitial}
                            </div>

                            {/* Name (hidden on mobile, visible on desktop >= 640px) */}
                            <span
                                className="nav-user-label"
                                style={{
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    maxWidth: '140px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {user.name}
                            </span>
                        </div>
                    )}

                    {/* Sign Out Button */}
                    <button
                        onClick={logout}
                        aria-label="Sign out"
                        title="Sign out of TaskFlow"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '6px 12px',
                            background: '#ffffff',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'var(--text-secondary)',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fef2f2';
                            e.currentTarget.style.borderColor = '#fecaca';
                            e.currentTarget.style.color = 'var(--accent-red)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#ffffff';
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                    >
                        <LogOut size={14} />
                        <span className="nav-signout-text">Sign out</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
