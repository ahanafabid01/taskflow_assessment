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
                <div className="flex items-center gap-1.5 min-w-0">
                    {/* Logo & Brand */}
                    <Link
                        href="/projects"
                        className="flex items-center gap-2 no-underline shrink-0"
                    >
                        <div className="w-7 h-7 rounded-[7px] bg-navy border border-navy/20 flex items-center justify-center overflow-hidden shadow-[0_2px_6px_rgba(15,41,74,0.15)]">
                            <Image
                                src="/brand/icon.svg"
                                alt="TaskFlow"
                                width={18}
                                height={18}
                                priority
                            />
                        </div>
                        <span className="font-logo text-[17px] text-slate-900 font-extrabold">
                            Task<span className="text-brand">Flow</span>
                        </span>
                    </Link>

                    {/* Breadcrumbs */}
                    {breadcrumbs && breadcrumbs.length > 0 && (
                        <div className="flex items-center gap-1 min-w-0 overflow-hidden">
                            <ChevronRight size={13} className="text-slate-400 shrink-0" />

                            {breadcrumbs.map((crumb, idx) => {
                                const isLast = idx === breadcrumbs.length - 1;

                                return (
                                    <div
                                        key={crumb.label}
                                        className="flex items-center gap-1 min-w-0"
                                    >
                                        {crumb.href ? (
                                            <Link
                                                href={crumb.href}
                                                className="text-[13px] font-medium text-slate-600 no-underline px-1.5 py-0.5 rounded-[5px] whitespace-nowrap transition-all hover:text-slate-900 hover:bg-slate-100"
                                            >
                                                {crumb.label}
                                            </Link>
                                        ) : (
                                            <span className="text-[13px] font-semibold text-slate-900 whitespace-nowrap px-1 py-0.5">
                                                {crumb.label}
                                            </span>
                                        )}
                                        {!isLast && (
                                            <ChevronRight size={12} className="text-slate-400 shrink-0" />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right: User Profile & Actions */}
                <div className="flex items-center gap-2 shrink-0">
                    {/* User Profile */}
                    {user && (
                        <div
                            className="nav-user-container flex items-center gap-2"
                            title={user.name + (user.email ? ` (${user.email})` : '')}
                        >
                            {/* Avatar */}
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand to-blue-700 flex items-center justify-center text-[11px] font-bold text-white shadow-[0_2px_6px_rgba(12,62,120,0.25)] shrink-0">
                                {userInitial}
                            </div>

                            {/* Name (hidden on mobile) */}
                            <span className="nav-user-label text-[13px] font-semibold text-slate-900 max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap">
                                {user.name}
                            </span>
                        </div>
                    )}

                    {/* Sign Out Button */}
                    <button
                        onClick={logout}
                        aria-label="Sign out"
                        title="Sign out of TaskFlow"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 text-[13px] font-medium cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all"
                    >
                        <LogOut size={14} />
                        <span className="nav-signout-text">Sign out</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
