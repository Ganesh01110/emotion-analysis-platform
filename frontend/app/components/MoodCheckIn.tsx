'use client';

import { useState } from 'react';
import {
    Briefcase, GraduationCap, Users, Heart, Activity,
    Smile, Sun, Palette, DollarSign, PartyPopper,
    Dumbbell, Plane, Moon, Plus, ChevronRight, CheckCircle2,
    Frown, Meh, Smile as SmileIcon, Laugh, Angry
} from 'lucide-react';

const MOODS = [
    { id: 1, label: 'Very Bad', icon: Angry, color: '#E74C3C' },
    { id: 2, label: 'Not Good', icon: Frown, color: '#E67E22' },
    { id: 3, label: 'Okay', icon: Meh, color: '#F39C12' },
    { id: 4, label: 'Good', icon: SmileIcon, color: '#86E3CE' },
    { id: 5, label: 'Great', icon: Laugh, color: '#FFD700' },
];

const TRIGGERS = [
    { id: 'work', label: 'Work', icon: Briefcase },
    { id: 'school', label: 'School', icon: GraduationCap },
    { id: 'family', label: 'Family', icon: Users },
    { id: 'partner', label: 'Partner', icon: Heart },
    { id: 'health', label: 'Health', icon: Activity },
    { id: 'friends', label: 'Friends', icon: Smile },
    { id: 'weather', label: 'Weather', icon: Sun },
    { id: 'hobbies', label: 'Hobbies', icon: Palette },
    { id: 'finances', label: 'Finances', icon: DollarSign },
    { id: 'events', label: 'Events', icon: PartyPopper },
    { id: 'exercise', label: 'Exercise', icon: Dumbbell },
    { id: 'travel', label: 'Travel', icon: Plane },
    { id: 'sleep', label: 'Sleep', icon: Moon },
    { id: 'custom', label: 'Custom', icon: Plus },
];

const NUANCES = [
    'Anxious', 'Grateful', 'Overwhelmed', 'Peaceful',
    'Lonely', 'Inspired', 'Tired', 'Excited',
    'Frustrated', 'Calm', 'Bored', 'Stressed'
];

interface MoodCheckInProps {
    onComplete?: () => void;
}

export default function MoodCheckIn({ onComplete }: MoodCheckInProps) {
    const [step, setStep] = useState(1);
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
    const [selectedNuance, setSelectedNuance] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mood/check-in`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mood_rating: selectedMood,
                    trigger_tag: selectedTrigger,
                    nuance_tag: selectedNuance,
                }),
            });

            if (response.ok) {
                setStep(4); // Success step
                if (onComplete) setTimeout(onComplete, 2000);
            }
        } catch (error) {
            console.error('Error saving mood check-in:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep1 = () => (
        <div className="flex flex-col items-center py-6">
            <h2 className="text-xl font-bold mb-8">How do you feel today?</h2>

            <div className="relative w-64 h-32 mb-8">
                {/* Gauge Background */}
                <svg className="w-full h-full" viewBox="0 0 100 50">
                    <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke="var(--bg-secondary)"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />
                    {/* Active Gauge Segment (Approximate) */}
                    {selectedMood && (
                        <path
                            d="M 10 50 A 40 40 0 0 1 90 50"
                            fill="none"
                            stroke={MOODS[selectedMood - 1].color}
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray="126"
                            strokeDashoffset={126 - (selectedMood / 5) * 126}
                            className="transition-all duration-500"
                        />
                    )}
                </svg>

                {/* Big Mood Icon */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
                    {selectedMood ? (
                        <>
                            {(() => {
                                const MoodIcon = MOODS[selectedMood - 1].icon;
                                return <MoodIcon size={48} color={MOODS[selectedMood - 1].color} className="mb-2" />;
                            })()}
                            <span className="font-bold text-lg" style={{ color: MOODS[selectedMood - 1].color }}>
                                {MOODS[selectedMood - 1].label}
                            </span>
                        </>
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] mb-2" />
                    )}
                </div>
            </div>

            <div className="flex gap-4">
                {MOODS.map((mood) => (
                    <button
                        key={mood.id}
                        onClick={() => setSelectedMood(mood.id)}
                        className={`p-3 rounded-full transition-all transform hover:scale-110 ${selectedMood === mood.id ? 'bg-[var(--bg-card)] shadow-lg' : 'opacity-50 hover:opacity-100'}`}
                    >
                        <mood.icon size={24} color={mood.color} />
                    </button>
                ))}
            </div>

            {selectedMood && (
                <button
                    onClick={() => setStep(2)}
                    className="mt-8 flex items-center gap-2 px-6 py-2 bg-[var(--accent-green)] text-white rounded-full font-bold shadow-md hover:bg-opacity-90 transition-all"
                >
                    CONTINUE <ChevronRight size={18} />
                </button>
            )}
        </div>
    );

    const renderStep2 = () => (
        <div className="flex flex-col items-center py-4">
            <h2 className="text-xl font-bold mb-6">What is the reason?</h2>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 mb-8">
                {TRIGGERS.map((trigger) => (
                    <button
                        key={trigger.id}
                        onClick={() => setSelectedTrigger(trigger.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all border ${selectedTrigger === trigger.id ? 'bg-[var(--accent-green)]/10 border-[var(--accent-green)] text-[var(--accent-green)]' : 'bg-[var(--bg-secondary)]/30 border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]/50'}`}
                    >
                        <trigger.icon size={20} className="mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-tighter">{trigger.label}</span>
                    </button>
                ))}
            </div>

            <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="px-6 py-2 text-[var(--text-secondary)] font-bold">BACK</button>
                <button
                    disabled={!selectedTrigger}
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 px-6 py-2 bg-[var(--accent-green)] text-white rounded-full font-bold shadow-md hover:bg-opacity-90 transition-all disabled:opacity-50"
                >
                    CONTINUE <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="flex flex-col items-center py-4">
            <h2 className="text-xl font-bold mb-6">Feeling deeper?</h2>

            <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-lg">
                {NUANCES.map((nuance) => (
                    <button
                        key={nuance}
                        onClick={() => setSelectedNuance(nuance)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${selectedNuance === nuance ? 'bg-[var(--accent-green)] border-[var(--accent-green)] text-white' : 'bg-transparent border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'}`}
                    >
                        {nuance}
                    </button>
                ))}
            </div>

            <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="px-6 py-2 text-[var(--text-secondary)] font-bold">BACK</button>
                <button
                    disabled={isSubmitting}
                    onClick={handleSave}
                    className="flex items-center gap-2 px-8 py-2 bg-[var(--accent-green)] text-white rounded-full font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                >
                    {isSubmitting ? 'SAVING...' : 'FINISH CHECK-IN'}
                </button>
            </div>
        </div>
    );

    const renderSuccess = () => (
        <div className="flex flex-col items-center justify-center py-12 animate-in zoom-in duration-500">
            <CheckCircle2 size={64} className="text-[var(--accent-green)] mb-4" />
            <h2 className="text-2xl font-bold mb-2">Check-in Complete!</h2>
            <p className="text-[var(--text-secondary)]">Your emotional pattern has been saved.</p>
        </div>
    );

    return (
        <div className="mood-check-in card border-2 border-dashed border-[var(--accent-green)]/30 bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-secondary)]/10 overflow-hidden">
            <div className="relative">
                {step < 4 && (
                    <div className="absolute top-0 right-0 p-2 text-[10px] font-bold text-[var(--text-secondary)] uppercase">
                        Step {step} of 3
                    </div>
                )}
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderSuccess()}
            </div>
        </div>
    );
}
