/* Comment */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, History, BarChart3, Heart, Settings, LogOut } from 'lucide-react';

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'History', href: '/history', icon: History },
        { name: 'Self-Care', href: '/self-care', icon: Heart },
        // { name: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[var(--bg-card)] border-b border-[var(--border-color)] px-4 py-3 flex items-center justify-between">
                <h1 className="text-l font-bold bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-yellow)] bg-clip-text text-transparent">
                    SERENE EQ
                </h1>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar - Desktop */}
            <aside className="hidden md:flex fixed left-0 top-0 h-screen w-60 bg-[var(--bg-card)] border-r border-[var(--border-color)] flex-col">
                <div className="p-6 border-b border-[var(--border-color)]">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-yellow)] bg-clip-text text-transparent">
                        SERENE EQ
                    </h1>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">AI-Powered Insights</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative ${isActive
                                    ? 'bg-[var(--bg-secondary)] text-[var(--accent-green)] border-l-4 border-[var(--accent-green)] pl-3'
                                    : 'hover:bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:text-[var(--accent-green)]'
                                    }`}
                            >
                                <Icon
                                    size={20}
                                    className={`${isActive ? 'text-[var(--accent-green)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--accent-green)]'
                                        } transition-colors`}
                                />
                                <span className="font-medium">{item.name}</span>
                                {isActive && (
                                    <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[var(--border-color)]">
                    <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors w-full text-left">
                        <LogOut size={20} className="text-[var(--text-secondary)]" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <aside
                className={`md:hidden fixed inset-0 z-40 bg-black/50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            >
                <div
                    className={`fixed left-0 top-0 h-screen w-60 bg-[var(--bg-card)] transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 border-b border-[var(--border-color)]">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-yellow)] bg-clip-text text-transparent">
                            Emotion Analysis
                        </h1>
                    </div>

                    <nav className="p-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                                >
                                    <Icon size={20} className="text-[var(--text-secondary)]" />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border-color)]">
                        <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors w-full text-left">
                            <LogOut size={20} className="text-[var(--text-secondary)]" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

