'use client';

// components/ui/loading.tsx
// Professional, brand-aligned loading animations and skeleton screens for TaskFlow.

import Image from 'next/image';
import { AppNavbar } from '@/components/layout/app-navbar';

export function BrandSpinner({
    label = 'Loading',
    size = 'md',
}: {
    label?: string;
    size?: 'sm' | 'md' | 'lg';
}) {
    const isSm = size === 'sm';
    const isLg = size === 'lg';

    return (
        <div className="flex flex-col items-center justify-center gap-3.5 py-8" role="status" aria-label={label}>
            <div className="relative flex items-center justify-center">
                {/* Subtle outer pulsing ring */}
                <div
                    className={`absolute rounded-full bg-brand/10 animate-pulse-glow ${
                        isSm ? 'w-10 h-10' : isLg ? 'w-20 h-20' : 'w-14 h-14'
                    }`}
                />

                {/* Spinning conic gradient ring */}
                <div
                    className={`rounded-full border-2 border-slate-200 border-t-brand animate-spin ${
                        isSm ? 'w-8 h-8' : isLg ? 'w-16 h-16 border-[3px]' : 'w-11 h-11 border-[2.5px]'
                    }`}
                />

                {/* Center brand logo icon */}
                <div className="absolute flex items-center justify-center">
                    <Image
                        src="/brand/icon.svg"
                        alt="TaskFlow"
                        width={isSm ? 14 : isLg ? 26 : 18}
                        height={isSm ? 14 : isLg ? 26 : 18}
                        priority
                        className="opacity-90"
                    />
                </div>
            </div>

            {label && (
                <div className="flex items-center gap-1.5">
                    <span className="text-[13.5px] font-medium text-slate-600 tracking-tight">
                        {label}
                    </span>
                    <span className="inline-flex gap-0.5">
                        <span className="w-1 h-1 rounded-full bg-brand animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1 h-1 rounded-full bg-brand animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1 h-1 rounded-full bg-brand animate-bounce" />
                    </span>
                </div>
            )}
        </div>
    );
}

export function FullPageLoader({ label = 'Loading' }: { label?: string }) {
    return (
        <div className="min-h-dvh flex flex-col items-center justify-center bg-slate-50">
            <BrandSpinner label={label} size="lg" />
        </div>
    );
}

export function ProjectCardSkeleton() {
    return (
        <div className="flex flex-col justify-between w-full min-h-[160px] bg-white border border-slate-200 rounded-[14px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
            <div>
                <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-[10px] skeleton-box" />
                    <div className="w-16 h-5 rounded-full skeleton-box" />
                </div>
                <div className="w-3/4 h-5 mb-2 rounded-md skeleton-box" />
                <div className="w-full h-3.5 mb-1.5 rounded skeleton-box" />
                <div className="w-2/3 h-3.5 rounded skeleton-box" />
            </div>
            <div className="flex items-center gap-2 pt-3 mt-4 border-t border-slate-100">
                <div className="w-5 h-5 rounded-full skeleton-box" />
                <div className="w-20 h-3 rounded skeleton-box" />
            </div>
        </div>
    );
}

export function ProjectListSkeleton() {
    return (
        <div className="min-h-dvh bg-slate-50 w-full overflow-x-hidden">
            <AppNavbar />

            <main className="page-container" style={{ padding: 'var(--section-gap) var(--page-padding)' }}>
                {/* Header Skeleton */}
                <div className="page-header">
                    <div>
                        <div className="w-36 h-8 mb-2 rounded-lg skeleton-box" />
                        <div className="w-24 h-4 rounded skeleton-box" />
                    </div>

                    <div className="page-header-actions">
                        <div className="w-36 h-9 rounded-[10px] skeleton-box" />
                        <div className="w-32 h-9 rounded-[10px] skeleton-box ml-auto" />
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="projects-grid">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ProjectCardSkeleton key={i} />
                    ))}
                </div>
            </main>
        </div>
    );
}

export function TaskCardSkeleton() {
    return (
        <div className="bg-white rounded-[10px] p-3.5 border border-slate-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between mb-2">
                <div className="w-14 h-4 rounded-full skeleton-box" />
                <div className="w-4 h-4 rounded skeleton-box" />
            </div>
            <div className="w-4/5 h-4 mb-2 rounded skeleton-box" />
            <div className="w-full h-3 mb-1 rounded skeleton-box" />
            <div className="w-2/3 h-3 mb-3 rounded skeleton-box" />
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full skeleton-box" />
                    <div className="w-14 h-3 rounded skeleton-box" />
                </div>
                <div className="w-16 h-3 rounded skeleton-box" />
            </div>
        </div>
    );
}

export function KanbanBoardSkeleton() {
    return (
        <div className="flex flex-col w-full box-border">
            {/* Project Header Card Skeleton */}
            <div className="mb-5 bg-white border border-slate-200 rounded-[14px] px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] flex flex-col gap-2.5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-[10px] skeleton-box" />
                        <div className="w-48 h-6 rounded-md skeleton-box" />
                    </div>
                    <div className="w-20 h-6 rounded-full skeleton-box" />
                </div>
                <div className="pt-2 border-t border-slate-100">
                    <div className="w-full h-4 mb-1.5 rounded skeleton-box" />
                    <div className="w-3/4 h-4 rounded skeleton-box" />
                </div>
            </div>

            {/* Filter Bar Skeleton */}
            <div className="mb-5 flex flex-wrap gap-3 items-center justify-between">
                <div className="w-72 h-10 rounded-lg skeleton-box" />
                <div className="w-48 h-8 rounded-full skeleton-box" />
            </div>

            {/* Columns Skeleton */}
            <div className="kanban-board-wrapper">
                <div className="kanban-board">
                    {[1, 2, 3].map((col) => (
                        <div
                            key={col}
                            className="kanban-col flex flex-col rounded-[14px] border border-slate-200 bg-slate-100 min-h-[440px] p-3 gap-3"
                        >
                            <div className="flex items-center justify-between px-1 py-1">
                                <div className="w-24 h-5 rounded skeleton-box" />
                                <div className="w-6 h-6 rounded-full skeleton-box" />
                            </div>
                            <TaskCardSkeleton />
                            <TaskCardSkeleton />
                            {col === 1 && <TaskCardSkeleton />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
