'use client';

import Navigation from '../components/Navigation';
import UserHeader from '../components/UserHeader';
import Footer from '../components/Footer';
import { Heart, BookOpen, Activity, Calendar } from 'lucide-react';
import affirmationsData from '../data/affirmations.json';
import { useState, useEffect } from 'react';
import SelfCareToolbox from '../components/SelfCareToolbox';

export default function SelfCarePage() {
    const getRandomAffirmations = () => {
        const shuffled = [...affirmationsData].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    };

    const [currentAffirmations, setCurrentAffirmations] = useState<string[]>([]);
    const [weeklyActivity, setWeeklyActivity] = useState<any[]>([]);

    useEffect(() => {
        setCurrentAffirmations(getRandomAffirmations());

        // Fetch real activity data for the streak
        const fetchActivity = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/history/summary`);
                if (res.ok) {
                    const data = await res.json();
                    // Get last 7 days
                    const last7Days = [];
                    for (let i = 6; i >= 0; i--) {
                        const date = new Date();
                        date.setDate(date.getDate() - i);
                        const dateStr = date.toISOString().split('T')[0];
                        const dayData = data.find((d: any) => d.date === dateStr);
                        last7Days.push({
                            date: dateStr,
                            active: !!dayData,
                            dayName: date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)
                        });
                    }
                    setWeeklyActivity(last7Days);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchActivity();
    }, []);

    const handleGenerate = () => {
        setCurrentAffirmations(getRandomAffirmations());
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Navigation />

            <main className="md:ml-60 min-h-screen">
                <UserHeader
                    subtitle="Connect with your inner peace. Choose a practice to reset your energy."
                />

                <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight mb-2 text-[var(--text-primary)]">Self-Care Sanctuary</h1>
                            <p className="text-sm text-[var(--text-secondary)] font-medium max-w-sm opacity-80">
                                A personal space designed to nurture your emotional resilience through active practice.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 bg-[var(--bg-secondary)]/40 px-3.5 py-1.5 rounded-xl border border-[var(--border-color)]">
                            <Calendar size={16} className="text-[var(--accent-green)]" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>

                    {/* Functional Toolbox */}
                    <section>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-[2px] bg-[var(--accent-green)] rounded-full opacity-50" />
                            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">The Toolbox</h2>
                        </div>
                        <SelfCareToolbox />
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        {/* Affirmations */}
                        <div className="lg:col-span-2 card bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-secondary)]/5 border-white/5 ring-1 ring-black/5 p-6 shadow-sm">
                            <h3 className="font-semibold text-xs uppercase tracking-widest mb-4 flex items-center gap-2.5 text-[var(--text-secondary)]">
                                <BookOpen size={14} className="text-[var(--accent-green)]" />
                                Affirmations
                            </h3>
                            <div className="space-y-3">
                                {currentAffirmations.map((text, i) => (
                                    <div key={i} className="p-4 bg-[var(--bg-card)] rounded-2xl border border-white/5 shadow-sm italic text-sm font-medium text-[var(--text-primary)] leading-relaxed animate-in fade-in slide-in-from-bottom-1 duration-500" style={{ animationDelay: `${i * 80}ms` }}>
                                        &quot;{text}&quot;
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleGenerate}
                                className="w-full mt-6 py-3 bg-[var(--bg-secondary)]/50 hover:bg-[var(--border-color)] text-[var(--text-primary)] rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all active:scale-95"
                            >
                                Discover New Paths
                            </button>
                        </div>

                        {/* Active Streak */}
                        <div className="lg:col-span-2 card p-6 border-white/5 ring-1 ring-black/5 flex flex-col justify-between shadow-sm">
                            <div>
                                <h3 className="font-semibold text-xs uppercase tracking-widest mb-4 flex items-center gap-2.5 text-[var(--text-secondary)]">
                                    <Activity size={14} className="text-[var(--accent-green)]" />
                                    Active Streak
                                </h3>

                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex flex-col">
                                        <span className="text-4xl font-bold text-[var(--accent-green)] tracking-tight">7</span>
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] opacity-60">Day Momentum</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        {weeklyActivity.map((day, i) => (
                                            <div key={i} className="flex flex-col items-center gap-1.5">
                                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold transition-all ${day.active ? 'bg-[var(--accent-green)] text-white shadow-md shadow-green-500/10' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] opacity-30 font-medium'}`}>
                                                    {day.dayName}
                                                </div>
                                                {day.active && <div className="w-1 h-1 bg-[var(--accent-green)] rounded-full opacity-60" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                    <div className="p-3 bg-[var(--bg-secondary)]/40 rounded-xl border border-white/5 flex items-center gap-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] shadow-sm" />
                                        <span className="text-[10px] font-semibold uppercase tracking-tight">Mindful Breathing</span>
                                    </div>
                                    <div className="p-3 bg-[var(--bg-secondary)]/40 rounded-xl border border-white/5 flex items-center gap-2.5 opacity-40">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)]" />
                                        <span className="text-[10px] font-semibold uppercase tracking-tight">Zen Meditation</span>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-6 text-[9px] font-medium text-[var(--text-secondary)] italic opacity-60">
                                Consistency builds emotional clarity.
                            </p>
                        </div>

                        {/* Crisis Resources */}
                        <div className="lg:col-span-4 card bg-gradient-to-br from-rose-500/90 to-red-600/90 text-white shadow-xl shadow-rose-500/10 overflow-hidden relative border-none ring-0">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-2xl" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 py-1">
                                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner">
                                    <Heart size={32} className="fill-white/80" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="font-bold text-xl mb-0.5 text-white tracking-tight">Need Support?</h3>
                                    <p className="mb-4 text-xs text-white/80 font-medium max-w-lg">
                                        Professional support is available 24/7. You are not alone.
                                    </p>
                                    <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
                                        <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/15">
                                            <span className="text-[8px] uppercase font-bold tracking-widest block opacity-60 mb-0.5">National</span>
                                            <span className="font-bold text-lg leading-none">988</span>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-2 border border-white/15">
                                            <span className="text-[8px] uppercase font-bold tracking-widest block opacity-60 mb-0.5">Crisis Text</span>
                                            <span className="font-bold text-sm text-white leading-none">Text HOME to 741741</span>
                                        </div>
                                        <button className="bg-white text-rose-600 font-bold px-5 py-2 rounded-xl text-[10px] uppercase tracking-wider shadow-lg hover:scale-[1.03] active:scale-97 transition-all">Emergency: 911</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />

            </main>

        </div>
    );
}
