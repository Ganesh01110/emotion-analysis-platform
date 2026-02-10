'use client';

import { useAuth } from '../hooks/useAuth';
import ThemeToggle from './ThemeToggle';

interface UserHeaderProps {
    displayName?: string;
    subtitle?: string;
}

export default function UserHeader({ displayName, subtitle }: UserHeaderProps) {
    const { getDisplayName, getInitials, getProfilePic, loading } = useAuth();

    // Prioritize hook data over prop data for reactive updates
    const hookName = getDisplayName();
    const finalDisplayName = (hookName !== 'User' ? hookName : (displayName || 'User'));
    const finalSubtitle = subtitle || "Welcome to your emotional sanctuary. How can we support you today?";
    const profilePic = getProfilePic();

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
            <div className="flex-1">
                {(!loading || displayName) && (
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
                            {profilePic ? (
                                <img
                                    src={profilePic}
                                    alt={finalDisplayName}
                                    className="w-8 h-8 rounded-full object-cover shadow-sm ring-2 ring-[var(--accent-green)] ring-offset-2 ring-offset-[var(--bg-primary)]"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent-green)] to-[var(--accent-yellow)] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                    {getInitials()}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
