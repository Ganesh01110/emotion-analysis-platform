
'use client';

import { useState, useEffect, useCallback } from 'react';
import Navigation from '../components/Navigation';
import UserHeader from '../components/UserHeader';
import Footer from '../components/Footer';

import { Search, Filter, Calendar, MessageSquare, Globe, AlignLeft, PieChart, Activity, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import dynamic from 'next/dynamic';

const DynamicActivityHeatmap = dynamic(() => import('../components/ActivityHeatmap'), { ssr: false });
const EmotionWheel = dynamic(() => import('../components/EmotionWheel'), { ssr: false });
const SpiderChart = dynamic(() => import('../components/SpiderChart'), { ssr: false });
const BarGraph = dynamic(() => import('../components/BarGraph'), { ssr: false });

import { useAuth } from '../hooks/useAuth';

export default function HistoryPage() {
    const { getToken, user, loading: authLoading, isLocalDev } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterEmotion, setFilterEmotion] = useState('all');
    const [activeHistoryTab, setActiveHistoryTab] = useState<'reflections' | 'links' | 'checkins'>('reflections');
    const [history, setHistory] = useState<any[]>([]);
    const [moodHistory, setMoodHistory] = useState<any[]>([]);
    const [heatmapData, setHeatmapData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEntry, setSelectedEntry] = useState<any>(null);
    const [detailChartTab, setDetailChartTab] = useState<'donut' | 'spider' | 'bar'>('donut');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const ITEMS_PER_PAGE = 10;

    // Debounced search
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeHistoryTab, filterEmotion, debouncedSearch]);

    const fetchData = useCallback(async () => {
        const token = await getToken();
        if (!token && !isLocalDev) return;

        setLoading(true);
        try {
            // Fetch Heatmap Summary (Always needed)
            const summaryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/history/summary`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (summaryRes.ok) setHeatmapData(await summaryRes.json());

            if (activeHistoryTab === 'checkins') {
                // Fetch Mood History
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mood/history?page=${currentPage}&limit=${ITEMS_PER_PAGE}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setMoodHistory(data.items);
                    setTotalItems(data.total);
                    setTotalPages(data.pages);
                }
            } else {
                // Fetch Reflections or Media
                const sourceType = activeHistoryTab === 'reflections' ? 'text' : 'url';
                const historyUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/history`);
                historyUrl.searchParams.append('page', currentPage.toString());
                historyUrl.searchParams.append('limit', ITEMS_PER_PAGE.toString());
                historyUrl.searchParams.append('source_type', sourceType);
                if (filterEmotion !== 'all') historyUrl.searchParams.append('emotion', filterEmotion);
                if (debouncedSearch) historyUrl.searchParams.append('search', debouncedSearch);

                const historyRes = await fetch(historyUrl.toString(), {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (historyRes.ok) {
                    const data = await historyRes.json();
                    setHistory(data.items);
                    setTotalPages(data.pages);
                    setTotalItems(data.total);
                }
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    }, [getToken, isLocalDev, activeHistoryTab, currentPage, filterEmotion, debouncedSearch]);

    useEffect(() => {
        if (!authLoading && (user || isLocalDev)) {
            fetchData();
        }
    }, [user, authLoading, isLocalDev, fetchData]);

    const displayedEntries = history;

    const emotionColors: Record<string, string> = {
        joy: '#FFD700',
        sadness: '#4A90E2',
        anger: '#E74C3C',
        fear: '#9B59B6',
        trust: '#86E3CE',
        disgust: '#8E44AD',
        surprise: '#F39C12',
        anticipation: '#E67E22',
    };

    const moodRatingMap: Record<number, { label: string, color: string, emotion: string }> = {
        1: { label: 'Very Bad', color: '#E74C3C', emotion: 'anger' },
        2: { label: 'Not Good', color: '#E67E22', emotion: 'sadness' },
        3: { label: 'Okay', color: '#F39C12', emotion: 'trust' },
        4: { label: 'Good', color: '#86E3CE', emotion: 'joy' },
        5: { label: 'Great', color: '#FFD700', emotion: 'joy' },
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Navigation />

            <main className="md:ml-60 min-h-screen">
                <UserHeader />
                <div className="p-4 md:p-6 max-w-7xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-1">Emotional Journey</h1>
                        <p className="text-sm text-[var(--text-secondary)]">
                            Explore patterns in your emotional landscape
                        </p>
                    </div>

                    {/* Activity Heatmap */}
                    <div className="card mb-6 overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-xs tracking-wider text-[var(--text-secondary)] uppercase">Emotional Activity Overview</h3>
                            <div className="text-[10px] text-[var(--text-secondary)] font-medium">Last 6 Months</div>
                        </div>
                        <DynamicActivityHeatmap data={heatmapData} emotionColors={emotionColors} width={800} height={140} />

                        {heatmapData.length > 0 && (
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 p-4 bg-[var(--bg-secondary)]/30 rounded-xl border border-[var(--border-color)]/50">
                                <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)]">
                                    <span className="font-bold">INTENSITY:</span>
                                    <div className="flex gap-1">
                                        {[0.1, 0.4, 0.7, 1.0].map((v) => (
                                            <div
                                                key={v}
                                                className="w-3 h-3 rounded-[2px]"
                                                style={{
                                                    backgroundColor: 'var(--accent-green)',
                                                    opacity: 0.3 + (v * 0.7)
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-[10px] text-[var(--text-secondary)]">
                                    <span className="font-bold">COLORS:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {['joy', 'trust', 'fear', 'sadness', 'anger'].map(emo => (
                                            <div key={emo} className="flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: emotionColors[emo] }} />
                                                <span className="uppercase">{emo}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tabs & Search */}
                    <div className="mb-6 flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex items-center gap-1 bg-[var(--bg-secondary)] p-1 rounded-xl w-fit">
                            <button
                                onClick={() => setActiveHistoryTab('reflections')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeHistoryTab === 'reflections' ? 'bg-[var(--bg-card)] shadow-md text-[var(--accent-green)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                <MessageSquare size={14} />
                                REFLECTIONS
                            </button>
                            <button
                                onClick={() => setActiveHistoryTab('checkins')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeHistoryTab === 'checkins' ? 'bg-[var(--bg-card)] shadow-md text-[var(--accent-green)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                <Activity size={14} />
                                QUICK LOGS
                            </button>
                            <button
                                onClick={() => setActiveHistoryTab('links')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeHistoryTab === 'links' ? 'bg-[var(--bg-card)] shadow-md text-[var(--accent-green)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                            >
                                <Globe size={14} />
                                MEDIA LIBRARY
                            </button>
                        </div>

                        <div className="flex-1 flex gap-3 w-full">
                            <div className="flex-1 relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={
                                        activeHistoryTab === 'reflections' ? "Search your thoughts..." :
                                            activeHistoryTab === 'links' ? "Search link titles..." :
                                                "Search your logs..."
                                    }
                                    className="input-field pl-12 h-10 text-sm"
                                    style={{ paddingLeft: '2.75rem' }}
                                />
                            </div>
                            {activeHistoryTab !== 'checkins' && (
                                <div className="relative">
                                    <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] pointer-events-none" />
                                    <select
                                        value={filterEmotion}
                                        onChange={(e) => setFilterEmotion(e.target.value)}
                                        className="input-field w-40 pl-12 h-10 text-sm appearance-none"
                                        style={{ paddingLeft: '2.75rem' }}
                                    >
                                        <option value="all">All Emotions</option>
                                        {Object.keys(emotionColors).map(e => (
                                            <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Entries List */}
                    <div className="space-y-4">
                        {loading ? (
                            <div className="h-64 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-green)]" />
                            </div>
                        ) : activeHistoryTab === 'checkins' ? (
                            moodHistory.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {moodHistory.map((log) => {
                                            const moodInfo = moodRatingMap[log.mood_rating as keyof typeof moodRatingMap] || moodRatingMap[3];
                                            return (
                                                <div key={log.id} className="card border-white/5 ring-1 ring-black/5 bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-secondary)]/5 p-4 group hover:scale-[1.01] transition-all">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)]/50 border border-[var(--border-color)]">
                                                                <Activity size={18} className="text-[var(--accent-green)]" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest leading-none mb-1">
                                                                    {new Date(log.created_at).toLocaleDateString()}
                                                                </p>
                                                                <p className="text-xs font-semibold text-[var(--text-primary)]">
                                                                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase"
                                                            style={{ backgroundColor: `${moodInfo.color}15`, color: moodInfo.color }}
                                                        >
                                                            {moodInfo.label}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 mt-4">
                                                        {log.trigger_tag && (
                                                            <span className="px-3 py-1 bg-[var(--bg-secondary)]/50 rounded-lg text-[10px] font-bold text-[var(--text-secondary)] border border-[var(--border-color)] uppercase tracking-wider">
                                                                #{log.trigger_tag}
                                                            </span>
                                                        )}
                                                        {log.nuance_tag && (
                                                            <span className="px-3 py-1 bg-[var(--accent-green)]/10 rounded-lg text-[10px] font-bold text-[var(--accent-green)] border border-[var(--accent-green)]/20 uppercase tracking-wider">
                                                                {log.nuance_tag}
                                                            </span>
                                                        )}
                                                        {log.activity_type && (
                                                            <span className="px-3 py-1 bg-[var(--accent-yellow)]/10 rounded-lg text-[10px] font-bold text-[var(--accent-yellow)] border border-[var(--accent-yellow)]/20 uppercase tracking-wider">
                                                                {log.activity_type.replace('_', ' ')}
                                                                {log.duration ? ` • ${log.duration}min` : ''}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-4 py-8">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1 || loading}
                                                className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] disabled:opacity-30 transition-all hover:bg-[var(--bg-secondary)]"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>

                                            <div className="flex items-center gap-2">
                                                {[...Array(totalPages)].map((_, i) => {
                                                    const p = i + 1;
                                                    if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
                                                        return (
                                                            <button
                                                                key={p}
                                                                onClick={() => setCurrentPage(p)}
                                                                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === p ? 'bg-[var(--accent-green)] text-white shadow-lg' : 'bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)]'}`}
                                                            >
                                                                {p}
                                                            </button>
                                                        );
                                                    } else if (p === currentPage - 2 || p === currentPage + 2) {
                                                        return <span key={p} className="text-[var(--text-secondary)]">...</span>;
                                                    }
                                                    return null;
                                                })}
                                            </div>

                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages || loading}
                                                className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] disabled:opacity-30 transition-all hover:bg-[var(--bg-secondary)]"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="card h-64 flex flex-col items-center justify-center text-center px-4">
                                    <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-4 opacity-20">
                                        <Activity size={32} />
                                    </div>
                                    <h3 className="font-bold text-[var(--text-secondary)]">No check-ins yet</h3>
                                    <p className="text-xs text-[var(--text-secondary)] opacity-60">Start your journey from the Dashboard!</p>
                                </div>
                            )
                        ) : displayedEntries.length > 0 ? (
                            <>
                                <div className="flex items-center justify-between px-1 mb-2">
                                    <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                                        Showing {displayedEntries.length} of {totalItems} {activeHistoryTab}
                                    </span>
                                </div>
                                {displayedEntries.map((entry) => (
                                    <div key={entry.id} className="card hover:border-[var(--accent-green)] transition-all group">
                                        <div className="flex items-start gap-4">
                                            <div
                                                className="w-1.5 h-16 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: emotionColors[entry.dominant_emotion] }}
                                            />
                                            <div className="flex-1">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            {new Date(entry.timestamp).toLocaleDateString()} at {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        <span
                                                            className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider"
                                                            style={{
                                                                backgroundColor: `${emotionColors[entry.dominant_emotion]}15`,
                                                                color: emotionColors[entry.dominant_emotion],
                                                            }}
                                                        >
                                                            {entry.dominant_emotion.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {activeHistoryTab === 'reflections' ? (
                                                    <p className="text-sm text-[var(--text-primary)] leading-relaxed italic line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                                                        &quot;{entry.text}&quot;
                                                    </p>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Globe size={14} className="text-[var(--accent-green)]" />
                                                        <a
                                                            href={entry.source_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm font-bold text-[var(--accent-green)] hover:underline truncate"
                                                        >
                                                            {entry.source_url}
                                                        </a>
                                                    </div>
                                                )}

                                                <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex items-center justify-between">
                                                    <div className="flex items-center gap-4 flex-1 max-w-xs">
                                                        <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Intensity</span>
                                                        <div className="h-1 flex-1 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full rounded-full"
                                                                style={{
                                                                    width: `${(entry.emotion_scores[entry.dominant_emotion] * 100).toFixed(0)}%`,
                                                                    backgroundColor: emotionColors[entry.dominant_emotion],
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedEntry(entry)}
                                                        className="text-[10px] font-bold text-[var(--accent-green)] hover:tracking-widest transition-all"
                                                    >
                                                        VIEW ANALYSIS →
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-4 py-8">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1 || loading}
                                            className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] disabled:opacity-30 transition-all hover:bg-[var(--bg-secondary)]"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        <div className="flex items-center gap-2">
                                            {[...Array(totalPages)].map((_, i) => {
                                                const p = i + 1;
                                                // Show only current, 1st, last, and relative pages if many exist
                                                if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) {
                                                    return (
                                                        <button
                                                            key={p}
                                                            onClick={() => setCurrentPage(p)}
                                                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${currentPage === p ? 'bg-[var(--accent-green)] text-white shadow-lg' : 'bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-secondary)]'}`}
                                                        >
                                                            {p}
                                                        </button>
                                                    );
                                                } else if (p === currentPage - 2 || p === currentPage + 2) {
                                                    return <span key={p} className="text-[var(--text-secondary)]">...</span>;
                                                }
                                                return null;
                                            })}
                                        </div>

                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages || loading}
                                            className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] disabled:opacity-30 transition-all hover:bg-[var(--bg-secondary)]"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="card h-64 flex flex-col items-center justify-center text-center px-4">
                                <div className="w-16 h-16 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-4 opacity-20">
                                    <Search size={32} />
                                </div>
                                <h3 className="font-bold text-[var(--text-secondary)]">No records found</h3>
                                <p className="text-xs text-[var(--text-secondary)] opacity-60">Try adjusting your filters or search terms.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Analysis Detail Modal */}
                {selectedEntry && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div
                            className="bg-[var(--bg-card)] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Visual Content Column */}
                            <div className="w-full md:w-1/2 p-6 bg-[var(--bg-secondary)]/30 flex flex-col">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-bold text-lg tracking-tight">ANALYSIS BREAKDOWN</h3>
                                    <div className="flex items-center gap-1 bg-[var(--bg-card)] p-1 rounded-lg shadow-sm">
                                        {(['donut', 'spider', 'bar'] as const).map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => setDetailChartTab(t)}
                                                className={`p-2 rounded-md transition-all ${detailChartTab === t ? 'bg-[var(--accent-green)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'}`}
                                            >
                                                {t === 'donut' && <PieChart size={18} />}
                                                {t === 'spider' && <Activity size={18} />}
                                                {t === 'bar' && <AlignLeft size={18} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex-1 flex items-center justify-center min-h-[300px]">
                                    {detailChartTab === 'donut' && <EmotionWheel scores={selectedEntry.emotion_scores} width={320} height={320} />}
                                    {detailChartTab === 'spider' && <SpiderChart scores={selectedEntry.emotion_scores} width={320} height={320} />}
                                    {detailChartTab === 'bar' && <BarGraph scores={selectedEntry.emotion_scores} width={320} height={280} />}
                                </div>

                                <div className="mt-6 space-y-3">
                                    {Object.entries(selectedEntry.emotion_scores)
                                        .sort(([, a], [, b]) => (b as number) - (a as number))
                                        .slice(0, 3)
                                        .map(([emotion, score]: [string, any]) => (
                                            <div key={emotion} className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: emotionColors[emotion] }} />
                                                <span className="text-xs font-bold w-24 uppercase">{emotion}</span>
                                                <div className="flex-1 h-1.5 bg-[var(--bg-card)] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all duration-1000"
                                                        style={{ width: `${score * 100}%`, backgroundColor: emotionColors[emotion] }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-mono w-8 text-right font-bold text-[var(--accent-green)]">
                                                    {(score * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Context Column */}
                            <div className="flex-1 p-8 flex flex-col relative">
                                <button
                                    onClick={() => setSelectedEntry(null)}
                                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-all text-[var(--text-secondary)]"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>

                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div
                                            className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest text-white"
                                            style={{ backgroundColor: emotionColors[selectedEntry.dominant_emotion] }}
                                        >
                                            {selectedEntry.dominant_emotion.toUpperCase()}
                                        </div>
                                        <span className="text-xs font-bold text-[var(--text-secondary)]">
                                            {new Date(selectedEntry.timestamp).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-4 tracking-tight">Full Context</h2>
                                    <div className="p-6 rounded-2xl bg-[var(--bg-secondary)]/40 border border-[var(--border-color)]/50 relative overflow-hidden group">
                                        <div
                                            className="absolute left-0 top-0 w-1 h-full"
                                            style={{ backgroundColor: emotionColors[selectedEntry.dominant_emotion] }}
                                        />
                                        <p className="text-[var(--text-primary)] leading-relaxed text-sm lg:text-base italic overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
                                            {selectedEntry.source_type === 'text'
                                                ? `"${selectedEntry.text}"`
                                                : (
                                                    <span className="flex flex-col gap-2">
                                                        <span className="font-bold text-[var(--accent-green)]">URL SOURCE:</span>
                                                        <a href={selectedEntry.source_url} target="_blank" rel="noreferrer" className="underline break-all">
                                                            {selectedEntry.source_url}
                                                        </a>
                                                    </span>
                                                )
                                            }
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--accent-green)]/5 border border-[var(--accent-green)]/10">
                                        <div className="p-3 bg-[var(--accent-green)] rounded-xl text-white shadow-lg shadow-[var(--accent-green)]/20">
                                            <Sparkles size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-[var(--accent-green)] uppercase tracking-wider mb-0.5">Primary Insight</h4>
                                            <p className="text-sm font-semibold opacity-80">
                                                Your {selectedEntry.dominant_emotion} levels were {(selectedEntry.emotion_scores[selectedEntry.dominant_emotion] * 100).toFixed(0)}% during this reflection.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <Footer />
            </main>

        </div>
    );
}
