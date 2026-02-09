/* Comment */

'use client';

import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import UserHeader from '../components/UserHeader';
import { useAuth } from '../hooks/useAuth';
import dynamic from 'next/dynamic';
import LoadingSpinner from '../components/LoadingSpinner';
import { Sparkles, Link as LinkIcon, Mic, PieChart, Activity, AlignLeft } from 'lucide-react';
const EmotionWheel = dynamic(() => import('../components/EmotionWheel'), {
    loading: () => <LoadingSpinner />,
    ssr: false
});
const SpiderChart = dynamic(() => import('../components/SpiderChart'), {
    loading: () => <LoadingSpinner />,
    ssr: false
});
const BarGraph = dynamic(() => import('../components/BarGraph'), {
    loading: () => <LoadingSpinner />,
    ssr: false
});
const ActivityHeatmap = dynamic(() => import('../components/ActivityHeatmap'), {
    ssr: false
});
const EmotionTrendChart = dynamic(() => import('../components/EmotionTrendChart'), {
    ssr: false
});

export default function DashboardPage() {
    const { getDisplayName } = useAuth();
    const [activeTab, setActiveTab] = useState<'thoughts' | 'media' | 'url'>('thoughts');
    const [text, setText] = useState('');
    const [url, setUrl] = useState('');
    const [agentMode, setAgentMode] = useState('analytical');
    const [analysis, setAnalysis] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [chartTab, setChartTab] = useState<'donut' | 'spider' | 'bar'>('donut');

    // History states
    const [history, setHistory] = useState<any[]>([]);
    const [heatmapData, setHeatmapData] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const fetchDashboardData = async () => {
        try {
            const [historyRes, summaryRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/history`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/history/summary`)
            ]);

            if (historyRes.ok) {
                const data = await historyRes.json();
                setHistory(data.items || data); // Fallback for safety
            }
            if (summaryRes.ok) setHeatmapData(await summaryRes.json());
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

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
                fetchDashboardData(); // Refresh history after analysis
            }
        } catch (error) {
            console.error('Analysis error:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAnalyzeMedia = async () => {
        if (!url.trim()) return;

        setIsAnalyzing(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scrape`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });

            if (response.ok) {
                const data = await response.json();
                setAnalysis(data);
                fetchDashboardData(); // Refresh history after analysis
            }
        } catch (error) {
            console.error('Media analysis error:', error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Filter history for trend chart
    const trendData = history.map(h => ({
        date: h.timestamp.split('T')[0],
        scores: h.emotion_scores
    }));

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Navigation />

            {/* Main Content */}
            <main className="md:ml-60 min-h-screen">
                <UserHeader />

                <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-4">
                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
                        {/* Input Card - Spans 2 columns */}
                        <div className="lg:col-span-2 card">
                            <div className="flex gap-4 mb-3 border-b border-[var(--border-color)]">
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
                                    onClick={() => setActiveTab('url')}
                                    className={`pb-3 px-4 font-semibold transition-colors ${activeTab === 'url'
                                        ? 'border-b-2 border-[var(--accent-green)] text-[var(--accent-green)]'
                                        : 'text-[var(--text-secondary)]'
                                        }`}
                                >
                                    ANALYSE MEDIA
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
                                        className="textarea-field mb-3"
                                    />
                                    <div className="flex items-center gap-3">
                                        <button className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                                            <Mic size={18} />
                                        </button>
                                        <button className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                                            <LinkIcon size={18} />
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
                                            <Sparkles size={16} />
                                            {isAnalyzing ? 'Analyzing...' : 'ANALYZE'}
                                        </button>
                                    </div>
                                </>
                            ) : activeTab === 'url' ? (
                                <>
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="Paste article or media URL here..."
                                        className="input-field mb-3"
                                    />
                                    <p className="text-xs text-[var(--text-secondary)] mb-3">
                                        Analyze the emotional tone of news articles, blog posts, or any web content
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1" />
                                        <button
                                            onClick={handleAnalyzeMedia}
                                            disabled={isAnalyzing || !url.trim()}
                                            className="btn-primary flex items-center gap-2"
                                        >
                                            <Sparkles size={16} />
                                            {isAnalyzing ? 'Analyzing...' : 'ANALYZE MEDIA'}
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

                        {/* Emotion Visualization Card */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-sm">INNER BALANCE</h3>
                                <div className="flex items-center gap-1 bg-[var(--bg-secondary)] p-1 rounded-lg">
                                    <button
                                        onClick={() => setChartTab('donut')}
                                        className={`p-1.5 rounded-md transition-all ${chartTab === 'donut' ? 'bg-[var(--bg-card)] shadow-sm text-[var(--accent-green)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                                        title="Donut Chart"
                                    >
                                        <PieChart size={16} />
                                    </button>
                                    <button
                                        onClick={() => setChartTab('spider')}
                                        className={`p-1.5 rounded-md transition-all ${chartTab === 'spider' ? 'bg-[var(--bg-card)] shadow-sm text-[var(--accent-green)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                                        title="Spider Chart"
                                    >
                                        <Activity size={16} />
                                    </button>
                                    <button
                                        onClick={() => setChartTab('bar')}
                                        className={`p-1.5 rounded-md transition-all ${chartTab === 'bar' ? 'bg-[var(--bg-card)] shadow-sm text-[var(--accent-green)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                                        title="Bar Graph"
                                    >
                                        <AlignLeft size={16} />
                                    </button>
                                </div>
                            </div>
                            {analysis ? (
                                <div className="transition-all duration-300">
                                    {chartTab === 'donut' && <EmotionWheel scores={analysis.emotion_scores} width={280} height={280} />}
                                    {chartTab === 'spider' && <SpiderChart scores={analysis.emotion_scores} width={280} height={280} />}
                                    {chartTab === 'bar' && <BarGraph scores={analysis.emotion_scores} width={280} height={240} />}
                                </div>
                            ) : (
                                <div className="aspect-square flex flex-col items-center justify-center text-[var(--text-secondary)] text-center px-4">
                                    <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-4">
                                        <PieChart size={32} className="opacity-20" />
                                    </div>
                                    <p className="text-xs">Analyze your data to visualize your emotional landscape</p>
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

                        {/* Mindfulness Streak - Heatmap Card */}
                        <div className="card">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-xs tracking-wider text-[var(--text-secondary)]">MINDFULNESS STREAK</h3>
                                <div className="text-[10px] text-[var(--text-secondary)] font-medium">Last 6 Months</div>
                            </div>
                            <ActivityHeatmap
                                data={heatmapData}
                                width={300}
                                height={130}
                                onDateClick={(date) => setSelectedDate(date)}
                            />
                            <p className="text-[10px] text-[var(--text-secondary)] mt-4 italic opacity-80">
                                {selectedDate ? `Viewing patterns for ${new Date(selectedDate).toLocaleDateString()}` : "Click a tile to explore daily patterns."}
                            </p>
                        </div>

                        {/* Emotion Trends - Wide Card */}
                        <div className="md:col-span-2 card">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-semibold text-xs tracking-wider text-[var(--text-secondary)] uppercase">Emotional Resonance</h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
                                    <span className="text-[10px] font-bold text-[var(--text-secondary)]">LIVE TRENDS</span>
                                </div>
                            </div>
                            <div className="mt-4">
                                {trendData.length > 0 ? (
                                    <EmotionTrendChart data={trendData} />
                                ) : (
                                    <div className="h-[200px] flex flex-col items-center justify-center text-center px-10">
                                        <Sparkles size={32} className="text-[var(--text-secondary)] opacity-10 mb-4" />
                                        <p className="text-xs text-[var(--text-secondary)] opacity-60">
                                            Logs your first thoughts to begin charting your emotional landscape over time.
                                        </p>
                                    </div>
                                )}
                            </div>
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

