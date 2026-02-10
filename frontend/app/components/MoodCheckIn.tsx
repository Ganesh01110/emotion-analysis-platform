'use client';

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
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
    const { getToken } = useAuth();
    const [step, setStep] = useState(1);
    const [selectedMood, setSelectedMood] = useState<number | null>(null);
    const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
    const [selectedNuance, setSelectedNuance] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async () => {
        const token = await getToken();

        setIsSubmitting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mood/check-in`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
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
        <div className="flex flex-col items-center py-2">
            <h2 className="text-lg font-semibold mb-6 tracking-tight">How do you feel today?</h2>

            <div className="relative w-48 h-24 mb-6">
                {/* Gauge Background */}
                <svg className="w-full h-full" viewBox="0 0 100 50">
                    <path
                        d="M 10 50 A 40 40 0 0 1 90 50"
                        fill="none"
                        stroke="var(--bg-secondary)"
                        strokeWidth="6"
                        strokeLinecap="round"
                        className="opacity-40"
                    />
                    {/* Active Gauge Segment */}
                    {selectedMood && (
                        <path
                            d="M 10 50 A 40 40 0 0 1 90 50"
                            fill="none"
                            stroke={MOODS[selectedMood - 1].color}
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray="126"
                            strokeDashoffset={126 - (selectedMood / 5) * 126}
                            className="transition-all duration-700 ease-out"
                        />
                    )}
                </svg>

                {/* Big Mood Icon */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
                    {selectedMood ? (
                        <>
                            {(() => {
                                const MoodIcon = MOODS[selectedMood - 1].icon;
                                return <MoodIcon size={32} color={MOODS[selectedMood - 1].color} className="mb-1.5 animate-in zoom-in-50 duration-300" />;
                            })()}
                            <span className="font-semibold text-sm uppercase tracking-wider" style={{ color: MOODS[selectedMood - 1].color }}>
                                {MOODS[selectedMood - 1].label}
                            </span>
                        </>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] mb-1.5 opacity-20" />
                    )}
                </div>
            </div>

            <div className="flex gap-3">
                {MOODS.map((mood) => (
                    <button
                        key={mood.id}
                        onClick={() => setSelectedMood(mood.id)}
                        className={`p-2.5 rounded-2xl transition-all transform hover:scale-110 active:scale-95 ${selectedMood === mood.id ? 'bg-[var(--bg-card)] shadow-md ring-1 ring-[var(--border-color)]' : 'opacity-40 hover:opacity-100'}`}
                    >
                        <mood.icon size={18} color={mood.color} />
                    </button>
                ))}
            </div>

            {selectedMood && (
                <button
                    onClick={() => setStep(2)}
                    className="mt-6 flex items-center gap-1.5 px-6 py-2 bg-[var(--accent-green)] text-white rounded-xl font-bold text-[10px] tracking-widest uppercase shadow-lg shadow-green-500/10 hover:scale-[1.02] active:scale-98 transition-all"
                >
                    CONTINUE <ChevronRight size={14} />
                </button>
            )}
        </div>
    );

    const renderStep2 = () => (
        <div className="flex flex-col items-center py-2">
            <h2 className="text-lg font-semibold mb-5 tracking-tight">What is the reason?</h2>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mb-6 w-full px-4">
                {TRIGGERS.map((trigger) => (
                    <button
                        key={trigger.id}
                        onClick={() => setSelectedTrigger(trigger.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all border ${selectedTrigger === trigger.id ? 'bg-[var(--accent-green)]/10 border-[var(--accent-green)] text-[var(--accent-green)]' : 'bg-[var(--bg-secondary)]/20 border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]/40'}`}
                    >
                        <trigger.icon size={16} className="mb-1" />
                        <span className="text-[8px] font-bold uppercase tracking-tight">{trigger.label}</span>
                    </button>
                ))}
            </div>

            <div className="flex gap-2">
                <button onClick={() => setStep(1)} className="px-5 py-2 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">BACK</button>
                <button
                    disabled={!selectedTrigger}
                    onClick={() => setStep(3)}
                    className="flex items-center gap-1.5 px-6 py-2 bg-[var(--accent-green)] text-white rounded-xl font-bold text-[10px] tracking-widest uppercase shadow-lg shadow-green-500/10 hover:scale-[1.02] transition-all disabled:opacity-30"
                >
                    CONTINUE <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="flex flex-col items-center py-2">
            <h2 className="text-lg font-semibold mb-5 tracking-tight">Feeling deeper?</h2>

            <div className="flex flex-wrap justify-center gap-1.5 mb-6 max-w-md px-4">
                {NUANCES.map((nuance) => (
                    <button
                        key={nuance}
                        onClick={() => setSelectedNuance(nuance)}
                        className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold transition-all border ${selectedNuance === nuance ? 'bg-[var(--accent-green)] border-[var(--accent-green)] text-white' : 'bg-transparent border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'}`}
                    >
                        {nuance}
                    </button>
                ))}
            </div>

            <div className="flex gap-2">
                <button onClick={() => setStep(2)} className="px-5 py-2 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">BACK</button>
                <button
                    disabled={isSubmitting}
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-7 py-2 bg-[var(--accent-green)] text-white rounded-xl font-bold text-[10px] tracking-widest uppercase shadow-lg shadow-green-500/10 hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-30"
                >
                    {isSubmitting ? 'SAVING...' : 'FINISH CHECK-IN'}
                </button>
            </div>
        </div>
    );

    const renderSuccess = () => (
        <div className="flex flex-col items-center justify-center py-8 animate-in zoom-in duration-500 text-center">
            <div className="p-3 rounded-full bg-[var(--accent-green)]/10 text-[var(--accent-green)] mb-3">
                <CheckCircle2 size={32} />
            </div>
            <h2 className="text-xl font-semibold mb-1 tracking-tight">Check-in Complete!</h2>
            <p className="text-xs text-[var(--text-secondary)] font-medium">Patterns that guide your journey have been saved.</p>
        </div>
    );

    return (
        <div className="mood-check-in card border-white/5 ring-1 ring-black/5 bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-secondary)]/5 overflow-hidden shadow-sm">
            <div className="relative p-4 md:p-5">
                {step < 4 && (
                    <div className="absolute top-4 right-4 text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] opacity-40">
                        Step {step} of 3
                    </div>
                )}
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderSuccess()}
                </div>
            </div>
        </div>
    );
}
