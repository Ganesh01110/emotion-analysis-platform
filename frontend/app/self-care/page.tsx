/*
 * Self-Care Page
 * Adaptive care features based on emotional state
 */

'use client';

import Navigation from '../components/Navigation';
import BreathingExercise from '../components/BreathingExercise';
import { Heart, Music, Book, Coffee, Sparkles } from 'lucide-react';

export default function SelfCarePage() {
    const moodLifters = [
        {
            icon: Music,
            title: 'Calming Playlist',
            description: 'Curated sounds for serenity',
            color: 'from-blue-400 to-blue-600',
        },
        {
            icon: Book,
            title: 'Guided Journal',
            description: 'Prompts for reflection',
            color: 'from-purple-400 to-purple-600',
        },
        {
            icon: Coffee,
            title: 'Mindful Break',
            description: '5-minute reset ritual',
            color: 'from-amber-400 to-amber-600',
        },
        {
            icon: Sparkles,
            title: 'Gratitude Practice',
            description: 'Find joy in small things',
            color: 'from-pink-400 to-pink-600',
        },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Navigation />

            <main className="md:ml-64 pt-16 md:pt-0 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Self-Care Sanctuary</h1>
                        <p className="text-[var(--text-secondary)]">
                            Tools to nurture your emotional well-being
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Breathing Exercise */}
                        <div className="lg:col-span-1">
                            <BreathingExercise />
                        </div>

                        {/* Mood Lifters */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-xl font-semibold mb-4">Mood Lifters</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {moodLifters.map((lifter) => {
                                    const Icon = lifter.icon;
                                    return (
                                        <div
                                            key={lifter.title}
                                            className="card hover:shadow-lg transition-shadow cursor-pointer"
                                        >
                                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${lifter.color} flex items-center justify-center mb-4`}>
                                                <Icon size={24} className="text-white" />
                                            </div>
                                            <h3 className="font-semibold mb-1">{lifter.title}</h3>
                                            <p className="text-sm text-[var(--text-secondary)]">
                                                {lifter.description}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Crisis Resources */}
                        <div className="lg:col-span-3 card bg-gradient-to-br from-red-500 to-pink-500 text-white">
                            <div className="flex items-start gap-4">
                                <Heart size={32} className="flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-2">Need Immediate Support?</h3>
                                    <p className="mb-4 opacity-90">
                                        If you're experiencing a mental health crisis, please reach out to a professional.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                            <div className="text-xs opacity-75 mb-1">National Suicide Prevention</div>
                                            <div className="font-bold text-lg">988</div>
                                        </div>
                                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                            <div className="text-xs opacity-75 mb-1">Crisis Text Line</div>
                                            <div className="font-bold text-lg">Text HOME to 741741</div>
                                        </div>
                                        <div className="bg-white bg-opacity-20 rounded-lg p-3">
                                            <div className="text-xs opacity-75 mb-1">Emergency</div>
                                            <div className="font-bold text-lg">911</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Affirmations */}
                        <div className="lg:col-span-2 card">
                            <h3 className="font-semibold mb-4">Daily Affirmations</h3>
                            <div className="space-y-3">
                                <div className="p-4 bg-[var(--bg-secondary)] rounded-lg italic">
                                    "I am worthy of love, peace, and happiness."
                                </div>
                                <div className="p-4 bg-[var(--bg-secondary)] rounded-lg italic">
                                    "My feelings are valid, and I honor them."
                                </div>
                                <div className="p-4 bg-[var(--bg-secondary)] rounded-lg italic">
                                    "I am growing stronger with each passing day."
                                </div>
                            </div>
                            <button className="btn-secondary w-full mt-4">
                                Generate New Affirmation
                            </button>
                        </div>

                        {/* Progress Tracker */}
                        <div className="lg:col-span-1 card">
                            <h3 className="font-semibold mb-4">Self-Care Streak</h3>
                            <div className="text-center mb-4">
                                <div className="text-5xl font-bold text-[var(--accent-green)]">7</div>
                                <div className="text-sm text-[var(--text-secondary)]">days in a row</div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span>Breathing exercises</span>
                                    <span className="text-[var(--accent-green)]">✓</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>Journaling</span>
                                    <span className="text-[var(--accent-green)]">✓</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span>Mindful break</span>
                                    <span className="text-[var(--text-secondary)]">○</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

