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

    // Initialize Canvas
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
                    ctx.lineWidth = 2.5;
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
                <div className="bg-[var(--bg-card)]/95 backdrop-blur-xl w-full max-w-sm rounded-[1.5rem] overflow-hidden shadow-2xl border border-white/10 ring-1 ring-black/5">
                    <div className={`h-1 transition-all duration-1000 bg-gradient-to-r ${currentTool?.color}`} style={{ width: targetSeconds > 0 ? `${(seconds / targetSeconds) * 100}%` : '100%' }} />

                    <div className="p-6 flex flex-col items-center text-center relative">
                        <button onClick={reset} className="absolute top-3 right-3 p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] rounded-full transition-colors">
                            <X size={18} />
                        </button>

                        <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${currentTool?.color} text-white mb-4 shadow-lg ring-2 ring-white/10`}>
                            {currentTool && <currentTool.icon size={22} />}
                        </div>

                        <h2 className="text-lg font-semibold tracking-tight mb-0.5">{currentTool?.label}</h2>
                        <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-widest font-medium opacity-60">Practice Phase</p>

                        {!isFinished ? (
                            <>
                                {selectedTool === 'custom' && targetSeconds === 0 ? (
                                    <div className="w-full py-6">
                                        <p className="text-[10px] font-semibold text-[var(--text-secondary)] mb-4 uppercase tracking-[0.2em]">Select Duration</p>
                                        <div className="grid grid-cols-2 gap-2 mb-6">
                                            {PRESETS.map(m => (
                                                <button
                                                    key={m}
                                                    onClick={() => setTargetSeconds(m * 60)}
                                                    className="py-3 bg-[var(--bg-secondary)]/40 border border-[var(--border-color)] rounded-xl font-semibold text-base hover:bg-[var(--accent-green)]/10 hover:border-[var(--accent-green)] transition-all"
                                                >
                                                    {m}m
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-5xl font-mono font-medium my-6 text-[var(--text-primary)] tabular-nums tracking-tighter">
                                            {formatTime(seconds, targetSeconds)}
                                        </div>

                                        {selectedTool === 'breathing' && (
                                            <div className="mb-8 flex flex-col items-center">
                                                <div
                                                    className="w-28 h-28 rounded-full ring-1 ring-[var(--accent-green)]/20 flex items-center justify-center transition-all duration-1000 shadow-inner"
                                                    style={{
                                                        transform: `scale(${breathPhase === 'inhale' ? 1.3 : breathPhase === 'exhale' ? 0.9 : 1.3})`,
                                                        backgroundColor: 'var(--accent-green)10'
                                                    }}
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-2xl font-semibold text-[var(--accent-green)]">{breathCount}</span>
                                                        <span className="text-[8px] uppercase font-semibold tracking-widest text-[var(--accent-green)]/50">{breathPhase}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {selectedTool === 'doodle' && (
                                            <div className="w-full aspect-square bg-[var(--bg-secondary)]/30 rounded-2xl mb-6 border border-[var(--border-color)] flex items-center justify-center relative overflow-hidden shadow-inner cursor-crosshair group">
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
                                                <div className="absolute top-2.5 right-2.5 text-[8px] font-semibold opacity-30 group-hover:opacity-50 transition-opacity pointer-events-none uppercase tracking-widest">Zen Canvas</div>
                                            </div>
                                        )}

                                        <div className="flex gap-2.5 w-full mt-2">
                                            {!isActive ? (
                                                <button
                                                    onClick={() => setIsActive(true)}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--accent-green)] text-white rounded-xl font-semibold shadow-md shadow-green-500/10 hover:scale-[1.01] active:scale-98 transition-all text-xs tracking-wider uppercase"
                                                >
                                                    <Play size={16} fill="currentColor" /> START
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setIsActive(false)}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-xl font-semibold border border-[var(--border-color)] hover:bg-[var(--bg-card)] transition-all text-xs tracking-wider uppercase"
                                                >
                                                    <Pause size={16} fill="currentColor" /> PAUSE
                                                </button>
                                            )}

                                            <button
                                                disabled={seconds === 0}
                                                onClick={handleStop}
                                                className="flex-1 py-3 bg-[var(--text-primary)] text-white rounded-xl font-semibold shadow-md hover:scale-[1.01] active:scale-98 transition-all disabled:opacity-20 disabled:pointer-events-none text-xs tracking-wider uppercase"
                                            >
                                                FINISH
                                            </button>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div className="py-8 animate-in zoom-in duration-500 w-full">
                                <div className="p-3 rounded-full bg-[var(--accent-green)]/10 w-fit mx-auto mb-4">
                                    <CheckCircle2 size={40} className="text-[var(--accent-green)]" />
                                </div>
                                <h3 className="text-xl font-semibold mb-0.5">Session Complete</h3>
                                <p className="text-[var(--text-secondary)] font-medium mb-8 text-xs">Invested {formatTime(seconds)}.</p>
                                <button onClick={reset} className="w-full py-3 bg-[var(--accent-green)] text-white rounded-xl font-semibold tracking-wider uppercase text-xs shadow-lg shadow-green-500/10 hover:scale-[1.01] transition-all">CLOSE</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="self-care-toolbox">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                {TOOLS.map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                        className="card group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left relative overflow-hidden p-4 flex flex-col justify-between h-36 border-white/5 ring-1 ring-black/5"
                    >
                        <div className={`absolute top-0 right-0 w-28 h-28 bg-gradient-to-br ${tool.color} opacity-[0.02] group-hover:opacity-[0.05] transition-opacity rounded-full -mr-10 -mt-10 scale-150`} />

                        <div className={`w-10 h-10 rounded-[1rem] bg-gradient-to-br ${tool.color} flex items-center justify-center mb-0 shadow-md ring-2 ring-white/5 transition-transform group-hover:scale-105 duration-300`}>
                            <tool.icon size={18} className="text-white" />
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold mb-0.5 tracking-tight text-[var(--text-primary)]">{tool.label}</h3>
                            <p className="text-[9px] text-[var(--text-secondary)] font-medium mb-0 opacity-60 group-hover:opacity-90 transition-opacity uppercase tracking-tight">{tool.description}</p>
                        </div>

                        <div className="flex items-center gap-1 text-[8px] font-semibold text-[var(--accent-green)] uppercase tracking-widest opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                            PRACTICE <Play size={7} fill="currentColor" />
                        </div>
                    </button>
                ))}
            </div>

            {selectedTool && renderTimer()}
        </div>
    );
}
