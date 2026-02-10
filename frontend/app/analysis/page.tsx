/* Comment */

'use client';

import Navigation from '../components/Navigation';
import RadialHeatmap from '../components/RadialHeatmap';
import TemporalDriftChart from '../components/TemporalDriftChart';
import TriggerMap from '../components/TriggerMap';
import ActivityHeatmap from '../components/ActivityHeatmap';

// Mock Data
const radialData = Array.from({ length: 24 * 7 }, (_, i) => ({
    hour: i % 24,
    day: Math.floor(i / 24),
    value: Math.random() // Intensity
}));

const driftData = [
    { date: 'Mon', joy: 0.8, sadness: 0.2, anger: 0.1, fear: 0.1 },
    { date: 'Tue', joy: 0.6, sadness: 0.4, anger: 0.2, fear: 0.2 },
    { date: 'Wed', joy: 0.5, sadness: 0.3, anger: 0.5, fear: 0.1 },
    { date: 'Thu', joy: 0.7, sadness: 0.1, anger: 0.1, fear: 0.3 },
    { date: 'Fri', joy: 0.9, sadness: 0.1, anger: 0.0, fear: 0.0 },
    { date: 'Sat', joy: 0.8, sadness: 0.2, anger: 0.1, fear: 0.1 },
    { date: 'Sun', joy: 0.9, sadness: 0.0, anger: 0.0, fear: 0.0 },
];

const triggerNodes = [
    { id: 'Work', group: 1, radius: 20, emotion: 'anger' },
    { id: 'Family', group: 1, radius: 25, emotion: 'joy' },
    { id: 'Traffic', group: 2, radius: 15, emotion: 'anger' },
    { id: 'Deadline', group: 2, radius: 18, emotion: 'fear' },
    { id: 'Exercise', group: 1, radius: 22, emotion: 'joy' },
    { id: 'Sleep', group: 3, radius: 20, emotion: 'neutral' },
];

const triggerLinks = [
    { source: 'Work', target: 'Deadline', value: 10 },
    { source: 'Work', target: 'Traffic', value: 5 },
    { source: 'Family', target: 'Exercise', value: 3 },
    { source: 'Deadline', target: 'Sleep', value: 8 },
];

const activityData = Array.from({ length: 112 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    count: Math.floor(Math.random() * 5),
    intensity: Math.random(),
}));

export default function AnalysisPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Navigation />

            <main className="md:ml-64 pt-16 md:pt-0 p-6">
                <div className="max-w-7xl mx-auto space-y-8">

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Deep Insights</h1>
                        <p className="text-[var(--text-secondary)]">Unlock patterns in your emotional data</p>
                    </div>

                    {/* Temporal Drift */}
                    <div className="card">
                        <h3 className="font-semibold mb-4">7-Day Emotional Trends</h3>
                        <p className="text-sm text-[var(--text-secondary)] mb-6">How your emotions fluctuate throughout the week</p>
                        <TemporalDriftChart data={driftData} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* Radial Heatmap */}
                        <div className="card flex flex-col items-center">
                            <h3 className="font-semibold mb-2 self-start">Temporal Patterns</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-6 self-start">When you feel most intense (Hour vs Day)</p>
                            <RadialHeatmap data={radialData} width={400} height={400} />
                        </div>

                        {/* Trigger Map */}
                        <div className="card flex flex-col items-center">
                            <h3 className="font-semibold mb-2 self-start">Trigger Network</h3>
                            <p className="text-sm text-[var(--text-secondary)] mb-6 self-start">Relationships between your life events and emotions</p>
                            <TriggerMap nodes={triggerNodes} links={triggerLinks} width={400} height={400} />
                        </div>

                    </div>

                    {/* Github Style Heatmap */}
                    <div className="card">
                        <h3 className="font-semibold mb-4">Consistency Tracker</h3>
                        <ActivityHeatmap data={activityData} width={1000} height={150} />
                    </div>

                </div>
            </main>
        </div>
    );
}
