'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Sparkles, Activity, Palette, BookOpen,
    Dumbbell, Timer, X, Play, Pause, RotateCcw,
    CheckCircle2, Music, Wind
} from 'lucide-react';

const TOOLS = [
    { id: 'meditation', label: 'Meditation', icon: Sparkles, color: 'from-purple-400 to-purple-600', description: 'Quiet your mind' },
    { id: 'breathing', label: 'Breathing', icon: Wind, color: 'from-blue-400 to-blue-600', description: '4-7-8 ritual' },
    { id: 'doodle', label: 'Doodle', icon: Palette, color: 'from-pink-400 to-pink-600', description: 'Free expression' },
    { id: 'mindfulness', label: 'Mindful Reading', icon: BookOpen, color: 'from-amber-400 to-amber-600', description: 'Philosophical reset' },
    { id: 'exercise', label: 'Light Exercise', icon: Dumbbell, color: 'from-emerald-400 to-emerald-600', description: 'Body movement' },
];

export default function SelfCareToolbox() {
    const [selectedTool, setSelectedTool] = useState<string | null>(null);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Breathing specific
    const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [breathCount, setBreathCount] = useState(4);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);

                // Breathing logic if active
                if (selectedTool === 'breathing') {
                    setBreathCount(prev => {
                        if (prev > 1) return prev - 1;
                        if (breathPhase === 'inhale') { setBreathPhase('hold'); return 7; }
                        if (breathPhase === 'hold') { setBreathPhase('exhale'); return 8; }
                        setBreathPhase('inhale'); return 4;
                    });
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, breathPhase, selectedTool]);

    const handleStop = async () => {
        setIsActive(false);
        setIsFinished(true);

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mood/check-in`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    activity_type: selectedTool,
                    duration: seconds,
                    nuance_tag: 'Self-Care'
                }),
            });
        } catch (error) {
            console.error('Error saving activity:', error);
        }
    };

    const reset = () => {
        setSelectedTool(null);
        setSeconds(0);
        setIsActive(false);
        setIsFinished(false);
    };

    const renderTimer = () => {
        const formatTime = (s: number) => {
            const mins = Math.floor(s / 60);
            const secs = s % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        };

        const currentTool = TOOLS.find(t => t.id === selectedTool);

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-[var(--bg-card)] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
                    <div className={`h-2 text-center bg-gradient-to-r ${currentTool?.color}`} />

                    <div className="p-8 flex flex-col items-center text-center">
                        <button onClick={reset} className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                            <X size={24} />
                        </button>

                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${currentTool?.color} text-white mb-6 shadow-lg`}>
                            {currentTool && <currentTool.icon size={32} />}
                        </div>

                        <h2 className="text-2xl font-bold mb-2">{currentTool?.label}</h2>

                        {!isFinished ? (
                            <>
                                <div className="text-5xl font-mono font-bold my-8 text-[var(--accent-green)]">
                                    {formatTime(seconds)}
                                </div>

                                {selectedTool === 'breathing' && (
                                    <div className="mb-8 flex flex-col items-center">
                                        <div
                                            className="w-32 h-32 rounded-full border-4 border-[var(--accent-green)] flex items-center justify-center transition-all duration-1000"
                                            style={{
                                                transform: `scale(${breathPhase === 'inhale' ? 1.5 : breathPhase === 'exhale' ? 0.8 : 1.5})`,
                                                backgroundColor: 'var(--accent-green)0A'
                                            }}
                                        >
                                            <div className="flex flex-col items-center">
                                                <span className="text-2xl font-bold">{breathCount}</span>
                                                <span className="text-[10px] uppercase font-bold tracking-widest">{breathPhase}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedTool === 'doodle' && (
                                    <div className="w-full aspect-square bg-[var(--bg-secondary)] rounded-2xl mb-6 border-2 border-dashed border-[var(--border-color)] flex items-center justify-center relative overflow-hidden">
                                        <canvas
                                            className="absolute inset-0 cursor-crosshair"
                                            onMouseDown={(e) => {
                                                const canvas = e.currentTarget;
                                                const ctx = canvas.getContext('2d');
                                                if (!ctx) return;
                                                ctx.beginPath();
                                                ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                                                canvas.dataset.drawing = 'true';
                                            }}
                                            onMouseMove={(e) => {
                                                const canvas = e.currentTarget;
                                                if (canvas.dataset.drawing !== 'true') return;
                                                const ctx = canvas.getContext('2d');
                                                if (!ctx) return;
                                                ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
                                                ctx.stroke();
                                            }}
                                            onMouseUp={(e) => { e.currentTarget.dataset.drawing = 'false'; }}
                                            onMouseLeave={(e) => { e.currentTarget.dataset.drawing = 'false'; }}
                                            ref={(canvas) => {
                                                if (canvas) {
                                                    canvas.width = canvas.parentElement?.clientWidth || 300;
                                                    canvas.height = canvas.parentElement?.clientHeight || 300;
                                                    const ctx = canvas.getContext('2d');
                                                    if (ctx) {
                                                        ctx.strokeStyle = '#86A789';
                                                        ctx.lineWidth = 3;
                                                        ctx.lineCap = 'round';
                                                    }
                                                }
                                            }}
                                        />
                                        <span className="text-xs text-[var(--text-secondary)] pointer-events-none opacity-50">DRAW HERE</span>
                                    </div>
                                )}

                                <div className="flex gap-4 w-full">
                                    {!isActive ? (
                                        <button
                                            onClick={() => setIsActive(true)}
                                            className="flex-1 flex items-center justify-center gap-2 py-4 bg-[var(--accent-green)] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
                                        >
                                            <Play size={20} fill="currentColor" /> START
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setIsActive(false)}
                                            className="flex-1 flex items-center justify-center gap-2 py-4 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-2xl font-bold border-2 border-[var(--border-color)]"
                                        >
                                            <Pause size={20} fill="currentColor" /> PAUSE
                                        </button>
                                    )}

                                    <button
                                        disabled={seconds === 0}
                                        onClick={handleStop}
                                        className="flex-1 py-4 bg-[var(--text-primary)] text-white rounded-2xl font-bold shadow-lg disabled:opacity-50"
                                    >
                                        FINISH
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="py-12 animate-in zoom-in duration-500">
                                <CheckCircle2 size={64} className="text-[var(--accent-green)] mx-auto mb-4" />
                                <h3 className="text-2xl font-bold mb-2">Great Session!</h3>
                                <p className="text-[var(--text-secondary)] mb-8">You invested {formatTime(seconds)} in yourself.</p>
                                <button onClick={reset} className="btn-primary w-full px-12">DONE</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="self-care-toolbox">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {TOOLS.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                        className="card group hover:shadow-xl hover:-translate-y-1 transition-all text-left relative overflow-hidden p-6"
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${tool.color} opacity-5 group-hover:opacity-10 transition-opacity rounded-full -mr-8 -mt-8`} />

                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-6 shadow-md shadow-inner`}>
                            <tool.icon size={24} className="text-white" />
                        </div>

                        <h3 className="text-lg font-bold mb-1">{tool.label}</h3>
                        <p className="text-xs text-[var(--text-secondary)] mb-4">{tool.description}</p>

                        <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--accent-green)] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            Start Session <Play size={10} fill="currentColor" />
                        </div>
                    </button>
                ))}
            </div>

            {selectedTool && renderTimer()}
        </div>
    );
}
