/* Comment */

'use client';

import { useState } from 'react';
import Navigation from '../components/Navigation';
import EmotionWheel from '../components/EmotionWheel';
import SpiderChart from '../components/SpiderChart';
import { Sparkles, Link as LinkIcon, Mic } from 'lucide-react';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<'thoughts' | 'media'>('thoughts');
    const [text, setText] = useState('');
    const [agentMode, setAgentMode] = useState('analytical');
    const [analysis, setAnalysis] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleAnalyze = async () => {
        if (!text.trim()) return;

        setIsAnalyzing(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, agent_mode: agentMode }),
            });

            if (response.ok) {
                const data = await response.json();
                setAnalysis(data);
            }
        } catch (error) {
            console.error('Analysis error:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Navigation />

            {/* Main Content */}
            <main className="md:ml-64 pt-16 md:pt-0 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold mb-2">Good evening, User.</h1>
                        <p className="text-[var(--text-secondary)]">The tide is calm, and your mind is at peace.</p>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Input Card - Spans 2 columns */}
                        <div className="lg:col-span-2 card">
                            <div className="flex gap-4 mb-4 border-b border-[var(--border-color)]">
                                <button
                                    onClick={() => setActiveTab('thoughts')}
                                    className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'thoughts'
                                            ? 'border-b-2 border-[var(--accent-green)] text-[var(--accent-green)]'
                                            : 'text-[var(--text-secondary)]'
                                        }`}
                                >
                                    REFLECTIONS
                                </button>
                                <button
                                    onClick={() => setActiveTab('media')}
                                    className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'media'
                                            ? 'border-b-2 border-[var(--accent-green)] text-[var(--accent-green)]'
                                            : 'text-[var(--text-secondary)]'
                                        }`}
                                >
                                    AUDIO JOURNAL
                                </button>
                            </div>

                            {activeTab === 'thoughts' ? (
                                <>
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Let your thoughts flow like the tide..."
                                        className="textarea-field mb-4"
                                    />
                                    <div className="flex items-center gap-4">
                                        <button className="p-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                                            <Mic size={20} />
                                        </button>
                                        <button className="p-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                                            <LinkIcon size={20} />
                                        </button>
                                        <div className="flex-1" />
                                        <select
                                            value={agentMode}
                                            onChange={(e) => setAgentMode(e.target.value)}
                                            className="input-field w-auto"
                                        >
                                            <option value="counselor">Counselor Mode</option>
                                            <option value="analytical">Analytical Mode</option>
                                            <option value="brutally_honest">Brutally Honest</option>
                                        </select>
                                        <button
                                            onClick={handleAnalyze}
                                            disabled={isAnalyzing || !text.trim()}
                                            className="btn-primary flex items-center gap-2"
                                        >
                                            <Sparkles size={18} />
                                            {isAnalyzing ? 'Analyzing...' : 'ANALYZE'}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12 text-[var(--text-secondary)]">
                                    <Mic size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>Audio journaling coming soon...</p>
                                </div>
                            )}
                        </div>

                        {/* Emotion Wheel */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">INNER BALANCE</h3>
                                <button className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                        <circle cx="10" cy="10" r="2" />
                                        <circle cx="10" cy="4" r="2" />
                                        <circle cx="10" cy="16" r="2" />
                                    </svg>
                                </button>
                            </div>
                            {analysis ? (
                                <EmotionWheel scores={analysis.emotion_scores} width={300} height={300} />
                            ) : (
                                <div className="aspect-square flex items-center justify-center text-[var(--text-secondary)]">
                                    <p>Analyze your thoughts to see your emotional balance</p>
                                </div>
                            )}
                            {analysis && (
                                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-[var(--text-secondary)]">SERENITY</span>
                                        <div className="h-1 bg-[var(--bg-secondary)] rounded-full mt-1">
                                            <div className="h-full bg-[var(--emotion-trust)] rounded-full" style={{ width: `${analysis.emotion_scores.trust * 100}%` }} />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[var(--text-secondary)]">GROWTH</span>
                                        <div className="h-1 bg-[var(--bg-secondary)] rounded-full mt-1">
                                            <div className="h-full bg-[var(--emotion-joy)] rounded-full" style={{ width: `${analysis.emotion_scores.joy * 100}%` }} />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[var(--text-secondary)]">CLARITY</span>
                                        <div className="h-1 bg-[var(--bg-secondary)] rounded-full mt-1">
                                            <div className="h-full bg-[var(--emotion-anticipation)] rounded-full" style={{ width: `${analysis.emotion_scores.anticipation * 100}%` }} />
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[var(--text-secondary)]">CALM</span>
                                        <div className="h-1 bg-[var(--bg-secondary)] rounded-full mt-1">
                                            <div className="h-full bg-[var(--accent-green)] rounded-full" style={{ width: `${(1 - analysis.emotion_scores.anger) * 100}%` }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mindfulness Streak */}
                        <div className="card">
                            <h3 className="font-semibold mb-4">MINDFULNESS STREAK</h3>
                            <div className="grid grid-cols-7 gap-2">
                                {Array.from({ length: 28 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="aspect-square rounded bg-[var(--bg-secondary)]"
                                        style={{
                                            backgroundColor: i < 15 ? 'var(--accent-green)' : 'var(--bg-secondary)',
                                            opacity: i < 15 ? 0.3 + (i / 28) * 0.7 : 0.3,
                                        }}
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] mt-4 italic">
                                Finding flow in consistency.
                            </p>
                        </div>

                        {/* Sentiment Drift */}
                        <div className="card">
                            <h3 className="font-semibold mb-4">SENTIMENT DRIFT</h3>
                            <div className="flex gap-2 mb-4">
                                <span className="px-3 py-1 rounded-full text-xs bg-[var(--emotion-joy)] bg-opacity-20 text-[var(--emotion-joy)]">
                                    JOY
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                                    CALM
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                                    SERENITY
                                </span>
                                <span className="px-3 py-1 rounded-full text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)]">
                                    GRO
                                </span>
                            </div>
                            {analysis ? (
                                <SpiderChart scores={analysis.emotion_scores} width={250} height={200} />
                            ) : (
                                <div className="h-48 flex items-center justify-center text-[var(--text-secondary)]">
                                    <p>Weekly sentiment visualization</p>
                                </div>
                            )}
                            <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-2">
                                <span>MON</span>
                                <span>WED</span>
                                <span>FRI</span>
                                <span>SUN</span>
                            </div>
                        </div>

                        {/* Breathing Space */}
                        <div className="card bg-gradient-to-br from-[var(--accent-green)] to-[var(--accent-yellow)] text-white">
                            <h3 className="font-semibold mb-2">BREATHING SPACE</h3>
                            <p className="text-sm mb-4 opacity-90">Quiet the noise around you.</p>
                            <div className="flex items-center justify-center my-8">
                                <div className="w-20 h-20 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="white">
                                        <path d="M20 5 L20 15 M20 25 L20 35 M5 20 L15 20 M25 20 L35 20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                            </div>
                            <button className="w-full py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors flex items-center justify-center gap-2">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                                    <circle cx="8" cy="8" r="6" />
                                </svg>
                                <span className="text-sm font-semibold">5 MIN GUIDE</span>
                            </button>
                        </div>

                        {/* Agent Response */}
                        {analysis && analysis.agent_response && (
                            <div className="lg:col-span-3 card">
                                <h3 className="font-semibold mb-4">WISDOM OF THE DAY</h3>
                                <p className="text-lg italic">&ldquo;{analysis.agent_response}&rdquo;</p>
                                <div className="mt-4 flex gap-2">
                                    <span className="px-3 py-1 rounded-full text-xs bg-[var(--accent-green)] bg-opacity-20 text-[var(--accent-green)]">
                                        SELF-COMPASSION
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-xs bg-[var(--accent-yellow)] bg-opacity-20 text-[var(--accent-yellow)]">
                                        DEEPREST
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

