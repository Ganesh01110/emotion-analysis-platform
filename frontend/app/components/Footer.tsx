'use client';

import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="mt-2 mb-2">
            <div className="px-4 md:px-6 max-w-7xl mx-auto">
                <div className="bg-[var(--bg-card)]/30 backdrop-blur-sm border border-[var(--border-color)]/40 rounded-2xl px-6 py-4">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-[var(--text-secondary)]/60">
                        <span>Built with</span>
                        <Heart size={10} className="text-red-500/70 fill-red-500/70" />
                        <span>for mental health awareness  • Your journey is private & secure • © {new Date().getFullYear()}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
