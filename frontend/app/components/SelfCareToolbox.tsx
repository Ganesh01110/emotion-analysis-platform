'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Sparkles, Activity, Palette, BookOpen,
    Dumbbell, Timer, X, Play, Pause, RotateCcw,
    CheckCircle2, Music, Wind, Clock
} from 'lucide-react';

const TOOLS = [
    { id: 'meditation', label: 'Meditation', icon: Sparkles, color: 'from-purple-500/80 to-purple-600/80', description: 'Quiet your mind' },
    { id: 'breathing', label: 'Breathing', icon: Wind, color: 'from-blue-500/80 to-blue-600/80', description: '4-7-8 ritual' },
    { id: 'doodle', label: 'Doodle', icon: Palette, color: 'from-rose-500/80 to-rose-600/80', description: 'Free expression' },
    { id: 'custom', label: 'Custom Timer', icon: Clock, color: 'from-emerald-500/80 to-emerald-600/80', description: 'Set your rhythm' },
];

const PRESETS = [5, 10, 15, 30];

export default function SelfCareToolbox() {
    const [selectedTool, setSelectedTool] = useState<string | null>(null);
    const [seconds, setSeconds] = useState(0);
    const [targetSeconds, setTargetSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    // Breathing specific
    const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [breathCount, setBreathCount] = useState(4);

    // Doodle specific
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawingRef = useRef(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            interval = setInterval(() => {
                if (selectedTool === 'custom' && targetSeconds > 0) {
                    setSeconds(s => {
                        if (s >= targetSeconds) {
                            handleStop();
                            return s;
                        }
                        return s + 1;
                    });
                } else {
                    setSeconds(s => s + 1);
                }

                // Breathing logic
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
    }, [isActive, breathPhase, selectedTool, targetSeconds]);

    // Initialize Canvas only once when selectedTool becomes 'doodle'
    useEffect(() => {
        if (selectedTool === 'doodle' && canvasRef.current && !isFinished) {
            const canvas = canvasRef.current;
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.strokeStyle = '#86A789';
                    ctx.lineWidth = 3;
                    ctx.lineCap = 'round';
                    ctx.lineJoin = 'round';
                }
            }
        }
    }, [selectedTool, isFinished]);

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
        if (isActive && !confirm("Stop current session?")) return;
        setSelectedTool(null);
        setSeconds(0);
        setTargetSeconds(0);
        setIsActive(false);
        setIsFinished(false);
        setBreathPhase('inhale');
        setBreathCount(4);
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        isDrawingRef.current = true;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawingRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        isDrawingRef.current = false;
    };

    const renderTimer = () => {
        const formatTime = (s: number, target?: number) => {
            if (target && target > 0) {
                const remaining = Math.max(0, target - s);
                const mins = Math.floor(remaining / 60);
                const secs = remaining % 60;
                return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }
            const mins = Math.floor(s / 60);
            const secs = s % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        };

        const currentTool = TOOLS.find(t => t.id === selectedTool);

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300">
                <div className="bg-[var(--bg-card)]/95 backdrop-blur-xl w-full max-w-sm rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 ring-1 ring-black/5">
                    <div className={`h-1.5 transition-all duration-1000 bg-gradient-to-r ${currentTool?.color}`} style={{ width: targetSeconds > 0 ? `${(seconds / targetSeconds) * 100}%` : '100%' }} />

                    <div className="p-8 flex flex-col items-center text-center relative">
                        <button onClick={reset} className="absolute top-4 right-4 p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-full transition-colors">
                            <X size={20} />
                        </button>

                        <div className={`p-4 rounded-3xl bg-gradient-to-br ${currentTool?.color} text-white mb-6 shadow-xl ring-4 ring-white/10`}>
                            {currentTool && <currentTool.icon size={28} />}
                        </div>

                        <h2 className="text-xl font-black tracking-tight mb-1">{currentTool?.label}</h2>

                        {!isFinished ? (
                            <>
                                {selectedTool === 'custom' && targetSeconds === 0 ? (
                                    <div className="w-full py-8">
                                        <p className="text-sm font-bold text-[var(--text-secondary)] mb-6 uppercase tracking-widest">Select Duration</p>
                                        <div className="grid grid-cols-2 gap-3 mb-8">
                                            {PRESETS.map(m => (
                                                <button
                                                    key={m}
                                                    onClick={() => setTargetSeconds(m * 60)}
                                                    className="py-4 bg-[var(--bg-secondary)]/50 border border-[var(--border-color)] rounded-2xl font-black text-lg hover:bg-[var(--accent-green)]/10 hover:border-[var(--accent-green)] transition-all"
                                                >
                                                    {m}m
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-6xl font-mono font-black my-8 text-[var(--text-primary)] tabular-nums tracking-tighter">
                                            {formatTime(seconds, targetSeconds)}
                                        </div>

                                        {selectedTool === 'breathing' && (
                                            <div className="mb-10 flex flex-col items-center">
                                                <div
                                                    className="w-32 h-32 rounded-full ring-2 ring-[var(--accent-green)]/20 flex items-center justify-center transition-all duration-1000 shadow-inner"
                                                    style={{
                                                        transform: `scale(${breathPhase === 'inhale' ? 1.4 : breathPhase === 'exhale' ? 0.9 : 1.4})`,
                                                        backgroundColor: 'var(--accent-green)1A'
                                                    }}
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-3xl font-black text-[var(--accent-green)]">{breathCount}</span>
                                                        <span className="text-[10px] uppercase font-black tracking-[0.2em] text-[var(--accent-green)]/60">{breathPhase}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {selectedTool === 'doodle' && (
                                            <div className="w-full aspect-square bg-[var(--bg-secondary)]/50 rounded-3xl mb-8 border border-[var(--border-color)] flex items-center justify-center relative overflow-hidden shadow-inner cursor-crosshair group">
                                                <canvas
                                                    ref={canvasRef}
                                                    className="absolute inset-0 touch-none"
                                                    onMouseDown={startDrawing}
                                                    onMouseMove={draw}
                                                    onMouseUp={stopDrawing}
                                                    onMouseLeave={stopDrawing}
                                                    onTouchStart={startDrawing}
                                                    onTouchMove={draw}
                                                    onTouchEnd={stopDrawing}
                                                />
                                                <div className="absolute top-3 right-3 text-[10px] font-black opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none uppercase tracking-widest">Zen Canvas</div>
                                            </div>
                                        )}

                                        <div className="flex gap-3 w-full mt-4">
                                            {!isActive ? (
                                                <button
                                                    onClick={() => setIsActive(true)}
                                                    className="flex-1 flex items-center justify-center gap-3 py-4 bg-[var(--accent-green)] text-white rounded-2xl font-black shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all text-sm tracking-widest uppercase"
                                                >
                                                    <Play size={18} fill="currentColor" /> START
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setIsActive(false)}
                                                    className="flex-1 flex items-center justify-center gap-3 py-4 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-2xl font-black border border-[var(--border-color)] hover:bg-[var(--bg-card)] transition-all text-sm tracking-widest uppercase"
                                                >
                                                    <Pause size={18} fill="currentColor" /> PAUSE
                                                </button>
                                            )}

                                            <button
                                                disabled={seconds === 0}
                                                onClick={handleStop}
                                                className="flex-1 py-4 bg-[var(--text-primary)] text-white rounded-2xl font-black shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none text-sm tracking-widest uppercase"
                                            >
                                                FINISH
                                            </button>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="py-12 animate-in zoom-in duration-500 w-full">
                                <div className="p-4 rounded-full bg-[var(--accent-green)]/10 w-fit mx-auto mb-6">
                                    <CheckCircle2 size={56} className="text-[var(--accent-green)]" />
                                </div>
                                <h3 className="text-2xl font-black mb-1">Session Complete!</h3>
                                <p className="text-[var(--text-secondary)] font-medium mb-10 text-sm">You invested {formatTime(seconds)} in yourself.</p>
                                <button onClick={reset} className="w-full py-4 bg-[var(--accent-green)] text-white rounded-2xl font-black tracking-widest uppercase text-sm shadow-xl shadow-green-500/20 hover:scale-[1.02] transition-all">CLOSE SANCTUARY</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="self-care-toolbox">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {TOOLS.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                        className="card group hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 text-left relative overflow-hidden p-5 flex flex-col justify-between h-40 border-white/5 ring-1 ring-black/5"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity rounded-full -mr-12 -mt-12 scale-150`} />

                        <div className={`w-11 h-11 rounded-[1.2rem] bg-gradient-to-br ${tool.color} flex items-center justify-center mb-0 shadow-lg ring-4 ring-white/5`}>
                            <tool.icon size={22} className="text-white" />
                        </div>

                        <div>
                            <h3 className="text-sm font-black mb-1 tracking-tight text-[var(--text-primary)]">{tool.label}</h3>
                            <p className="text-[10px] text-[var(--text-secondary)] font-medium mb-0 opacity-70 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">{tool.description}</p>
                        </div>

                        <div className="flex items-center gap-1 text-[9px] font-black text-[var(--accent-green)] uppercase tracking-[0.2em] opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            START <Play size={8} fill="currentColor" />
                        </div>
                    </button>
                ))}
            </div>

            {selectedTool && renderTimer()}
        </div>
    );
}
