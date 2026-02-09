'use client';

import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

interface UserHeaderProps {
    displayName?: string;
    subtitle?: string;
}

export default function UserHeader({ displayName, subtitle }: UserHeaderProps) {
    const { getDisplayName, getInitials, loading } = useAuth();

    // Use provided props or fall back to auth-derived values
    const finalDisplayName = displayName || getDisplayName();
    const finalSubtitle = subtitle || "The tide is calm, and your mind is at peace.";

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
            <div className="flex-1">
                {!loading && (
                    <div className="animate-in fade-in slide-in-from-left-2 duration-700">
                        <h2 className="text-xl font-bold">
                            Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {finalDisplayName}.
                        </h2>
                        <p className="text-xs text-[var(--text-secondary)]">{finalSubtitle}</p>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />

                <div className="flex items-center gap-3 pl-4 border-l border-[var(--border-color)]">
                    {!loading && (
                        <>
                            <span className="text-sm font-medium hidden sm:block">
                                {finalDisplayName}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-green)] to-[var(--accent-yellow)] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                {getInitials()}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
