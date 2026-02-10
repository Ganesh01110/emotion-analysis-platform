/* Comment */

'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface HistoryEntry {
    date: string;
    scores: Record<string, number>;
}

interface EmotionTrendChartProps {
    data: HistoryEntry[];
    selectedDate?: string | null;
    width?: number;
    height?: number;
}

const EMOTIONS = [
    { id: 'joy', label: 'Happiness', color: '#FFD700' },
    { id: 'sadness', label: 'Sadness', color: '#4A90E2' },
    { id: 'anger', label: 'Anger', color: '#E74C3C' },
    { id: 'fear', label: 'Fear', color: '#9B59B6' },
    { id: 'trust', label: 'Hope', color: '#86E3CE' },
    { id: 'disgust', label: 'Disgust', color: '#8E44AD' },
    { id: 'surprise', label: 'Surprise', color: '#F39C12' },
    { id: 'anticipation', label: 'Anticipation', color: '#E67E22' },
];

export default function EmotionTrendChart({ data, selectedDate, width = 800, height = 250 }: EmotionTrendChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [selectedEmotion, setSelectedEmotion] = useState('joy');

    useEffect(() => {
        if (selectedDate && data.length) {
            // Update asynchronously to avoid illegal cascading renders in Next.js 16
            setTimeout(() => {
                const entriesForDate = data.filter(d => d.date.includes(selectedDate));
                if (entriesForDate.length > 0) {
                    const scores = entriesForDate[0].scores;
                    let dominant = 'joy';
                    let maxScore = -1;
                    Object.entries(scores).forEach(([emo, score]) => {
                        if (score > maxScore) {
                            maxScore = score;
                            dominant = emo;
                        }
                    });
                    if (dominant !== selectedEmotion) {
                        setSelectedEmotion(dominant);
                    }
                }
            }, 0);
        }
    }, [selectedDate, data, selectedEmotion]);

    useEffect(() => {
        if (!svgRef.current || !data.length) return;

        // Clear previous chart
        d3.select(svgRef.current).selectAll('*').remove();

        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Prepare data for selected emotion
        const plotData = data.map(d => ({
            date: new Date(d.date),
            value: d.scores[selectedEmotion] || 0
        })).sort((a, b) => a.date.getTime() - b.date.getTime());

        // Scales
        let xDomain: [Date, Date];
        if (selectedDate) {
            const centerDate = new Date(selectedDate);
            const start = new Date(centerDate);
            start.setDate(centerDate.getDate() - 3);
            const end = new Date(centerDate);
            end.setDate(centerDate.getDate() + 3);
            xDomain = [start, end];
        } else {
            xDomain = d3.extent(plotData, d => d.date) as [Date, Date];
            // If only one data point and no range, buffer it
            if (xDomain[0]?.getTime() === xDomain[1]?.getTime()) {
                const d = xDomain[0];
                xDomain = [new Date(d.getTime() - 86400000), new Date(d.getTime() + 86400000)];
            }
        }

        const xScale = d3.scaleTime()
            .domain(xDomain)
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([innerHeight, 0]);

        // Colors
        const activeColor = EMOTIONS.find(e => e.id === selectedEmotion)?.color || 'var(--accent-green)';

        // Axes
        const xAxis = d3.axisBottom(xScale)
            .ticks(innerWidth > 500 ? 7 : 4)
            .tickFormat(d3.timeFormat('%b %d') as any);

        svg.append('g')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(xAxis)
            .attr('color', 'var(--text-secondary)')
            .selectAll('text')
            .style('font-size', '10px');

        svg.append('g')
            .call(d3.axisLeft(yScale).ticks(5).tickFormat(d => `${(+d * 100).toFixed(0)}%`))
            .attr('color', 'var(--text-secondary)')
            .selectAll('text')
            .style('font-size', '10px');

        // Grid lines
        svg.append('g')
            .attr('class', 'grid')
            .attr('opacity', 0.1)
            .call(d3.axisLeft(yScale).ticks(5).tickSize(-innerWidth).tickFormat(() => ''));

        // Line generator
        const line = d3.line<{ date: Date, value: number }>()
            .x(d => xScale(d.date))
            .y(d => yScale(d.value))
            .curve(d3.curveMonotoneX);

        // Path with animation
        const path = svg.append('path')
            .datum(plotData)
            .attr('fill', 'none')
            .attr('stroke', activeColor)
            .attr('stroke-width', 3)
            .attr('stroke-linecap', 'round')
            .attr('d', line);

        const totalLength = path.node()?.getTotalLength() || 0;

        path
            .attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(1500)
            .attr('stroke-dashoffset', 0);

        // Area under line
        const area = d3.area<{ date: Date, value: number }>()
            .x(d => xScale(d.date))
            .y0(innerHeight)
            .y1(d => yScale(d.value))
            .curve(d3.curveMonotoneX);

        svg.append('path')
            .datum(plotData)
            .attr('fill', activeColor)
            .attr('fill-opacity', 0.1)
            .attr('d', area);

        // Interaction points
        svg.selectAll('.dot')
            .data(plotData)
            .enter()
            .append('circle')
            .attr('cx', d => xScale(d.date))
            .attr('cy', d => yScale(d.value))
            .attr('r', 0)
            .attr('fill', activeColor)
            .attr('stroke', 'var(--bg-card)')
            .attr('stroke-width', 2)
            .transition()
            .delay((d, i) => i * 50)
            .duration(500)
            .attr('r', 4);

    }, [data, selectedEmotion, width, height, selectedDate]);

    return (
        <div className="emotion-trend-chart w-full overflow-hidden">
            <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {EMOTIONS.map(emotion => (
                    <button
                        key={emotion.id}
                        onClick={() => setSelectedEmotion(emotion.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap ${selectedEmotion === emotion.id
                            ? 'bg-[var(--bg-card)] shadow-sm'
                            : 'bg-transparent border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                        style={{
                            borderColor: selectedEmotion === emotion.id ? emotion.color : 'transparent',
                            color: selectedEmotion === emotion.id ? emotion.color : undefined
                        }}
                    >
                        {emotion.label}
                    </button>
                ))}
            </div>

            <div className="relative bg-[var(--bg-secondary)]/30 rounded-xl p-4 border border-[var(--border-color)]/50 overflow-x-auto custom-scrollbar">
                <div className="min-w-[600px] lg:min-w-full">
                    <svg ref={svgRef} className="w-full h-auto" viewBox={`0 0 ${width} ${height}`}></svg>
                </div>
            </div>
        </div>
    );
}
