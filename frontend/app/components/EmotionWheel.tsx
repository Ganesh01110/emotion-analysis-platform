"""
Emotion Wheel Component
D3.js - based layered donut chart for 8 - emotion visualization
"""

'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface EmotionScores {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    trust: number;
    disgust: number;
    surprise: number;
    anticipation: number;
}

interface EmotionWheelProps {
    scores: EmotionScores;
    width?: number;
    height?: number;
}

const EMOTION_COLORS = {
    joy: '#FFD700',
    sadness: '#4A90E2',
    anger: '#E74C3C',
    fear: '#9B59B6',
    trust: '#86E3CE',
    disgust: '#8E44AD',
    surprise: '#F39C12',
    anticipation: '#E67E22',
};

export default function EmotionWheel({ scores, width = 400, height = 400 }: EmotionWheelProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        // Clear previous chart
        d3.select(svgRef.current).selectAll('*').remove();

        const radius = Math.min(width, height) / 2;
        const innerRadius = radius * 0.4;
        const outerRadius = radius * 0.9;

        // Create SVG
        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Prepare data
        const data = Object.entries(scores).map(([emotion, value]) => ({
            emotion,
            value,
            color: EMOTION_COLORS[emotion as keyof typeof EMOTION_COLORS],
        }));

        // Create pie layout
        const pie = d3
            .pie<{ emotion: string; value: number; color: string }>()
            .value((d) => d.value)
            .sort(null);

        const arc = d3
            .arc<d3.PieArcDatum<{ emotion: string; value: number; color: string }>>()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        // Create arcs
        const arcs = svg
            .selectAll('.arc')
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', 'arc');

        // Add paths
        arcs
            .append('path')
            .attr('d', arc)
            .attr('fill', (d) => d.data.color)
            .attr('stroke', 'var(--bg-primary)')
            .attr('stroke-width', 2)
            .style('opacity', 0.8)
            .on('mouseover', function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('opacity', 1)
                    .attr('transform', 'scale(1.05)');
            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('opacity', 0.8)
                    .attr('transform', 'scale(1)');
            });

        // Add labels
        arcs
            .append('text')
            .attr('transform', (d) => {
                const [x, y] = arc.centroid(d);
                return `translate(${x}, ${y})`;
            })
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .attr('fill', 'white')
            .text((d) => d.data.emotion.charAt(0).toUpperCase() + d.data.emotion.slice(1));

        // Add center text
        svg
            .append('text')
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .attr('fill', 'var(--text-primary)')
            .text('Emotions');

    }, [scores, width, height]);

    return (
        <div className="emotion-wheel">
            <svg ref={svgRef}></svg>
        </div>
    );
}
