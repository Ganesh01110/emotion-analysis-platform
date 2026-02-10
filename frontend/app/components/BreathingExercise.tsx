/* Comment */

'use client';

import { useState, useEffect } from 'react';

export default function BreathingExercise() {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [count, setCount] = useState(4);
    const [cycles, setCycles] = useState(0);

    useEffect(() => {
        if (!isActive) return;

        const timer = setInterval(() => {
            setCount((prev) => {
                if (prev > 1) return prev - 1;

                // Move to next phase
                if (phase === 'inhale') {
                    setPhase('hold');
                    return 4;
                } else if (phase === 'hold') {
                    setPhase('exhale');
                    return 6;
                } else {
                    setPhase('inhale');
                    setCycles((c) => c + 1);
                    return 4;
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, phase]);

    const handleStart = () => {
        setIsActive(true);
        setPhase('inhale');
        setCount(4);
        setCycles(0);
    };

    const handleStop = () => {
        setIsActive(false);
        setPhase('inhale');
        setCount(4);
    };

    const getCircleScale = () => {
        if (phase === 'inhale') return 1 + (4 - count) * 0.25;
        if (phase === 'exhale') return 2 - (6 - count) * 0.25;
        return 2;
    };

    return (
        <div className="card text-center">
            <h3 className="font-semibold mb-2">Box Breathing</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-6">
                A simple technique to calm your nervous system
            </p>

            <div className="relative flex items-center justify-center my-12">
                <div
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--accent-green)] to-[var(--accent-yellow)] flex items-center justify-center transition-transform duration-1000 ease-in-out"
                    style={{ transform: `scale(${isActive ? getCircleScale() : 1})` }}
                >
                    <div className="text-white">
                        <div className="text-4xl font-bold">{count}</div>
                        <div className="text-sm uppercase tracking-wider mt-1">{phase}</div>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <div className="text-sm text-[var(--text-secondary)] mb-2">Cycles completed</div>
                <div className="text-2xl font-bold text-[var(--accent-green)]">{cycles}</div>
            </div>

            <div className="flex gap-3">
                {!isActive ? (
                    <button onClick={handleStart} className="btn-primary flex-1">
                        Start
                    </button>
                ) : (
                    <button onClick={handleStop} className="btn-secondary flex-1">
                        Stop
                    </button>
                )}
            </div>

            <div className="mt-6 p-4 bg-[var(--bg-secondary)] rounded-lg text-left">
                <div className="text-xs font-semibold text-[var(--text-secondary)] mb-2">HOW IT WORKS</div>
                <ul className="text-sm space-y-1 text-[var(--text-secondary)]">
                    <li>• Inhale for 4 seconds</li>
                    <li>• Hold for 4 seconds</li>
                    <li>• Exhale for 6 seconds</li>
                    <li>• Repeat for 5-10 cycles</li>
                </ul>
            </div>
        </div>
    );
}

