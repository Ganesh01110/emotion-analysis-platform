"""
History Page
View past analyses with filtering and search
"""

'use client';

import { useState } from 'react';
import Navigation from '../components/Navigation';
import ActivityHeatmap from '../components/ActivityHeatmap';
import { Search, Filter, Calendar } from 'lucide-react';

export default function HistoryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterEmotion, setFilterEmotion] = useState('all');

    // Mock data for demonstration
    const mockHeatmapData = Array.from({ length: 112 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        count: Math.floor(Math.random() * 5),
        intensity: Math.random(),
    }));

    const mockEntries = [
        {
            id: 1,
            date: '2026-02-08',
            time: '14:30',
            text: 'Feeling grateful for the small wins today...',
            dominantEmotion: 'joy',
            intensity: 0.8,
        },
        {
            id: 2,
            date: '2026-02-07',
            time: '09:15',
            text: 'Struggling with some anxiety about the upcoming presentation...',
            dominantEmotion: 'fear',
            intensity: 0.6,
        },
        {
            id: 3,
            date: '2026-02-06',
            time: '18:45',
            text: 'Had a productive day, feeling accomplished and energized...',
            dominantEmotion: 'anticipation',
            intensity: 0.7,
        },
    ];

    const emotionColors: Record<string, string> = {
        joy: 'var(--emotion-joy)',
        sadness: 'var(--emotion-sadness)',
        anger: 'var(--emotion-anger)',
        fear: 'var(--emotion-fear)',
        trust: 'var(--emotion-trust)',
        disgust: 'var(--emotion-disgust)',
        surprise: 'var(--emotion-surprise)',
        anticipation: 'var(--emotion-anticipation)',
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Navigation />

            <main className="md:ml-64 pt-16 md:pt-0 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Emotional Journey</h1>
                        <p className="text-[var(--text-secondary)]">
                            Explore patterns in your emotional landscape
                        </p>
                    </div>

                    {/* Activity Heatmap */}
                    <div className="card mb-6">
                        <h3 className="font-semibold mb-4">Activity Overview</h3>
                        <ActivityHeatmap data={mockHeatmapData} width={800} height={150} />
                        <div className="flex items-center gap-4 mt-4 text-xs text-[var(--text-secondary)]">
                            <span>Less</span>
                            <div className="flex gap-1">
                                {[0, 0.25, 0.5, 0.75, 1].map((intensity) => (
                                    <div
                                        key={intensity}
                                        className="w-4 h-4 rounded"
                                        style={{
                                            backgroundColor:
                                                intensity === 0
                                                    ? 'var(--bg-secondary)'
                                                    : `color-mix(in srgb, var(--accent-green) ${intensity * 100}%, var(--bg-secondary))`,
                                        }}
                                    />
                                ))}
                            </div>
                            <span>More</span>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="card mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search your thoughts..."
                                    className="input-field pl-10"
                                />
                            </div>
                            <select
                                value={filterEmotion}
                                onChange={(e) => setFilterEmotion(e.target.value)}
                                className="input-field w-full md:w-48"
                            >
                                <option value="all">All Emotions</option>
                                <option value="joy">Joy</option>
                                <option value="sadness">Sadness</option>
                                <option value="anger">Anger</option>
                                <option value="fear">Fear</option>
                                <option value="trust">Trust</option>
                                <option value="disgust">Disgust</option>
                                <option value="surprise">Surprise</option>
                                <option value="anticipation">Anticipation</option>
                            </select>
                            <button className="btn-secondary flex items-center gap-2">
                                <Calendar size={18} />
                                Date Range
                            </button>
                        </div>
                    </div>

                    {/* Entries List */}
                    <div className="space-y-4">
                        {mockEntries.map((entry) => (
                            <div key={entry.id} className="card hover:shadow-lg transition-shadow cursor-pointer">
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-3 h-3 rounded-full mt-2 flex-shrink-0"
                                        style={{ backgroundColor: emotionColors[entry.dominantEmotion] }}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-sm text-[var(--text-secondary)]">
                                                {entry.date} at {entry.time}
                                            </span>
                                            <span
                                                className="px-2 py-1 rounded-full text-xs font-semibold"
                                                style={{
                                                    backgroundColor: `${emotionColors[entry.dominantEmotion]}20`,
                                                    color: emotionColors[entry.dominantEmotion],
                                                }}
                                            >
                                                {entry.dominantEmotion.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-[var(--text-primary)]">{entry.text}</p>
                                        <div className="mt-3 flex items-center gap-4">
                                            <div className="flex-1">
                                                <div className="text-xs text-[var(--text-secondary)] mb-1">Intensity</div>
                                                <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{
                                                            width: `${entry.intensity * 100}%`,
                                                            backgroundColor: emotionColors[entry.dominantEmotion],
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <button className="text-sm text-[var(--accent-green)] hover:underline">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
