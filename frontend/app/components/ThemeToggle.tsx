/* Comment */

'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Check for saved theme preference or default to light
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
        applyTheme(initialTheme);
    }, []);

    const applyTheme = (newTheme: 'light' | 'dark') => {
        if (newTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    };

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

