'use client';

import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

export default function UserHeader() {
    const { getDisplayName, getInitials, loading } = useAuth();

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
            <div className="flex-1">
                {/* Search or other info could go here */}
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />

                <div className="flex items-center gap-3 pl-4 border-l border-[var(--border-color)]">
                    {!loading && (
                        <>
                            <span className="text-sm font-medium hidden sm:block">
                                {getDisplayName()}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-green)] to-[var(--accent-yellow)] flex items-center justify-center text-white font-bold text-xs">
                                {getInitials()}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
