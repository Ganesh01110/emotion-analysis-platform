'use client';

import Navigation from '../components/Navigation';
import UserHeader from '../components/UserHeader';
import dynamic from 'next/dynamic';
import LoadingSpinner from '../components/LoadingSpinner';
import { Heart, Music, Book, Coffee, Sparkles, BookOpen, Activity } from 'lucide-react';
import affirmationsData from '../data/affirmations.json';
import { useState, useEffect } from 'react';
import SelfCareToolbox from '../components/SelfCareToolbox';

export default function SelfCarePage() {
    const getRandomAffirmations = () => {
        const shuffled = [...affirmationsData].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 3);
    };

    const [currentAffirmations, setCurrentAffirmations] = useState<string[]>([]);

    useEffect(() => {
        setCurrentAffirmations(getRandomAffirmations());
    }, []);

    const handleGenerate = () => {
        setCurrentAffirmations(getRandomAffirmations());
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Navigation />

            <main className="md:ml-60 min-h-screen">
                <UserHeader
                    subtitle="Take a moment for yourself. Choose a tool from your sanctuary toolbox to begin."
                />

                <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2">Self-Care Sanctuary</h1>
                        <p className="text-[var(--text-secondary)]">
                            An active companion for your emotional resilience.
                        </p>
                    </div>

                    {/* Functional Toolbox (Mood Check-in & Activities) */}
                    <section>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Sparkles className="text-[var(--accent-green)]" size={20} />
                            Your Self-Care Toolbox
                        </h2>
                        <SelfCareToolbox />
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Affirmations */}
                        <div className="lg:col-span-2 card bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-secondary)]/30 border-2 border-dashed border-[var(--border-color)]">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <BookOpen size={18} className="text-[var(--accent-green)]" />
                                Daily Affirmations
                            </h3>
                            <div className="space-y-4 min-h-[220px]">
                                {currentAffirmations.length > 0 ? (
                                    currentAffirmations.map((text, i) => (
                                        <div key={i} className="p-5 bg-[var(--bg-card)] rounded-2xl italic shadow-sm hover:shadow-md transition-shadow animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                                            &quot;{text}&quot;
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">
                                        <LoadingSpinner />
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleGenerate}
                                className="w-full mt-6 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-2xl font-bold hover:bg-[var(--border-color)] transition-all"
                            >
                                GENERATE NEW AFFIRMATIONS
                            </button>
                        </div>

                        {/* Progress Tracker / Activity Summary */}
                        <div className="lg:col-span-1 card border-2 border-[var(--accent-green)]/20">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                <Activity size={18} className="text-[var(--accent-green)]" />
                                Active Streak
                            </h3>
                            <div className="text-center mb-6 p-6 bg-[var(--accent-green)]/5 rounded-3xl">
                                <div className="text-6xl font-black text-[var(--accent-green)]">7</div>
                                <div className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest mt-2">days in a row</div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm p-3 bg-[var(--bg-secondary)]/50 rounded-xl">
                                    <span className="font-medium">Breathing Sessions</span>
                                    <span className="bg-[var(--accent-green)] text-white text-[10px] px-2 py-1 rounded-full font-bold">DONE</span>
                                </div>
                                <div className="flex items-center justify-between text-sm p-3 bg-[var(--bg-secondary)]/50 rounded-xl opacity-60">
                                    <span className="font-medium">Meditation</span>
                                    <span className="text-[var(--text-secondary)] text-[10px] px-2 py-1 rounded-full font-bold">PENDING</span>
                                </div>
                                <div className="flex items-center justify-between text-sm p-3 bg-[var(--bg-secondary)]/50 rounded-xl opacity-60">
                                    <span className="font-medium">Creative Doodle</span>
                                    <span className="text-[var(--text-secondary)] text-[10px] px-2 py-1 rounded-full font-bold">OPTIONAL</span>
                                </div>
                            </div>
                        </div>

                        {/* Crisis Resources (High Visibility) */}
                        <div className="lg:col-span-3 card bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-xl shadow-red-200">
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                <div className="bg-white/20 p-4 rounded-3xl">
                                    <Heart size={48} className="fill-white" />
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="font-bold text-2xl mb-2 text-white">Need Immediate Support?</h3>
                                    <p className="mb-6 opacity-90 font-medium">
                                        Your safety is our priority. If you&apos;re feeling overwhelmed or in crisis, these resources are available 24/7.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                            <div className="text-[10px] uppercase font-black opacity-70 mb-1">National Suicide Prevention</div>
                                            <div className="font-black text-2xl">988</div>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                                            <div className="text-[10px] uppercase font-black opacity-70 mb-1">Crisis Text Line</div>
                                            <div className="font-black text-2xl">HOME to 741741</div>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center flex flex-col justify-center">
                                            <button className="bg-white text-rose-600 font-bold py-2 rounded-xl text-sm">EMERGENCY: 911</button>
                                        </div>
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

