/* Comment */

'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    // Move applyTheme up to be hoisted if needed, or just declare it before use
    const applyTheme = (newTheme: 'light' | 'dark') => {
        if (typeof window === 'undefined') return;
        if (newTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    };

    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Match media and localStorage are client-only, so we update asynchronously 
        // to avoid illegal cascading renders in Next.js 16 / React 19.
        const timer = setTimeout(() => {
            const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

            if (initialTheme !== theme) {
                setTheme(initialTheme);
            }
            applyTheme(initialTheme);
        }, 0);
        return () => clearTimeout(timer);
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
    );
}
