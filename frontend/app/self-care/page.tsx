'use client';

import Navigation from '../components/Navigation';
import UserHeader from '../components/UserHeader';
import dynamic from 'next/dynamic';
import LoadingSpinner from '../components/LoadingSpinner';
import { Heart, Music, Book, Coffee, Sparkles, BookOpen, Activity, Calendar } from 'lucide-react';
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

                <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter mb-2 text-[var(--text-primary)]">Self-Care Sanctuary</h1>
                            <p className="text-[var(--text-secondary)] font-medium max-w-md">
                                A personal space designed to nurture your emotional resilience through active practice.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 bg-[var(--bg-secondary)]/50 px-4 py-2 rounded-2xl border border-[var(--border-color)]">
                            <Calendar size={18} className="text-[var(--accent-green)]" />
                            <span className="text-sm font-bold uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                        </div>
                    </div>

                    {/* Functional Toolbox (Mood Check-in & Activities) */}
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-1 h-[2px] bg-[var(--accent-green)] rounded-full" />
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-[var(--text-secondary)]">The Toolbox</h2>
                        </div>
                        <SelfCareToolbox />
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Affirmations - More Compact */}
                        <div className="lg:col-span-2 card bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-secondary)]/10 border-white/5 ring-1 ring-black/5 p-6 md:p-8">
                            <h3 className="font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-3 text-[var(--text-secondary)]">
                                <BookOpen size={16} className="text-[var(--accent-green)]" />
                                Affirmations
                            </h3>
                            <div className="space-y-4">
                                {currentAffirmations.map((text, i) => (
                                    <div key={i} className="p-5 bg-[var(--bg-card)] rounded-[1.5rem] border border-white/5 shadow-sm italic text-sm md:text-base font-medium text-[var(--text-primary)] leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                        &quot;{text}&quot;
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={handleGenerate}
                                className="w-full mt-8 py-4 bg-[var(--bg-secondary)] hover:bg-[var(--border-color)] text-[var(--text-primary)] rounded-2xl text-xs font-black tracking-widest uppercase transition-all active:scale-95"
                            >
                                DISCOVER NEW PATHS
                            </button>
                        </div>

                        {/* Active Streak - Dynamic dots */}
                        <div className="lg:col-span-2 card p-6 md:p-8 border-white/5 ring-1 ring-black/5 flex flex-col justify-between">
                            <div>
                                <h3 className="font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-3 text-[var(--text-secondary)]">
                                    <Activity size={16} className="text-[var(--accent-green)]" />
                                    Active Streak
                                </h3>

                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex flex-col">
                                        <span className="text-5xl font-black text-[var(--accent-green)] tracking-tighter">7</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">Day Momentum</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {weeklyActivity.map((day, i) => (
                                            <div key={i} className="flex flex-col items-center gap-2">
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black transition-all ${day.active ? 'bg-[var(--accent-green)] text-white shadow-lg shadow-green-500/20' : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] opacity-40'}`}>
                                                    {day.dayName}
                                                </div>
                                                {day.active && <div className="w-1 h-1 bg-[var(--accent-green)] rounded-full" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="p-4 bg-[var(--bg-secondary)]/50 rounded-2xl border border-white/5 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-[var(--accent-green)]" />
                                        <span className="text-xs font-bold font-black uppercase tracking-tighter">Mindful Breathing</span>
                                    </div>
                                    <div className="p-4 bg-[var(--bg-secondary)]/50 rounded-2xl border border-white/5 flex items-center gap-3 opacity-40">
                                        <div className="w-2 h-2 rounded-full bg-[var(--text-secondary)]" />
                                        <span className="text-xs font-bold font-black uppercase tracking-tighter">Zen Meditation</span>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-8 text-[10px] font-bold text-[var(--text-secondary)] italic">
                                Consistency is the key to emotional clarity. Keep it up!
                            </p>
                        </div>

                        {/* Crisis Resources (Modern, less bulky) */}
                        <div className="lg:col-span-4 card bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-2xl shadow-rose-500/20 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 py-2">
                                <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/10">
                                    <Heart size={42} className="fill-white" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="font-black text-2xl mb-1 text-white tracking-tight">Need Support?</h3>
                                    <p className="mb-6 text-sm text-white/80 font-medium max-w-xl">
                                        You are never alone. Professional support is just a text or call away, 24/7.
                                    </p>
                                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                        <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/20">
                                            <span className="text-[9px] uppercase font-black tracking-widest block opacity-70 mb-0.5">National Support</span>
                                            <span className="font-black text-xl">988</span>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/20">
                                            <span className="text-[9px] uppercase font-black tracking-widest block opacity-70 mb-0.5">Crisis Text</span>
                                            <span className="font-black text-xl text-white">HOME to 741741</span>
                                        </div>
                                        <button className="bg-white text-rose-600 font-black px-6 py-3 rounded-2xl text-xs uppercase tracking-widest shadow-xl hover:scale-[1.05] transition-all">Emergency: 911</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

