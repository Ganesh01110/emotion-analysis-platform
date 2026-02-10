/* Comment */

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

interface SpiderChartProps {
    scores: EmotionScores;
    width?: number;
    height?: number;
}

export default function SpiderChart({ scores, width = 400, height = 400 }: SpiderChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        // Clear previous chart
        d3.select(svgRef.current).selectAll('*').remove();

        const radius = Math.min(width, height) / 2 - 40;
        const angleSlice = (Math.PI * 2) / 8;

        // Create SVG
        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`);

        // Prepare data
        const emotions = Object.keys(scores);
        const values = Object.values(scores);

        // Create radial scale
        const rScale = d3.scaleLinear().domain([0, 1]).range([0, radius]);

        // Draw circular grid
        const levels = 5;
        for (let i = 1; i <= levels; i++) {
            const levelRadius = (radius / levels) * i;

            svg
                .append('circle')
                .attr('r', levelRadius)
                .attr('fill', 'none')
                .attr('stroke', 'var(--border-color)')
                .attr('stroke-width', 1)
                .attr('opacity', 0.3);
        }

        // Draw axes
        emotions.forEach((emotion, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            // Axis line
            svg
                .append('line')
                .attr('x1', 0)
                .attr('y1', 0)
                .attr('x2', x)
                .attr('y2', y)
                .attr('stroke', 'var(--border-color)')
                .attr('stroke-width', 1);

            // Axis label
            const labelX = Math.cos(angle) * (radius + 25);
            const labelY = Math.sin(angle) * (radius + 25);

            svg
                .append('text')
                .attr('x', labelX)
                .attr('y', labelY)
                .attr('text-anchor', 'middle')
                .attr('dominant-baseline', 'middle')
                .attr('font-size', '12px')
                .attr('font-weight', 'bold')
                .attr('fill', 'var(--text-primary)')
                .text(emotion.charAt(0).toUpperCase() + emotion.slice(1));
        });

        // Create radar area
        const radarLine = d3
            .lineRadial<number>()
            .angle((d, i) => angleSlice * i)
            .radius((d) => rScale(d))
            .curve(d3.curveLinearClosed);

        // Draw radar area
        svg
            .append('path')
            .datum(values)
            .attr('d', radarLine)
            .attr('fill', 'var(--accent-green)')
            .attr('fill-opacity', 0.3)
            .attr('stroke', 'var(--accent-green)')
            .attr('stroke-width', 2);

        // Draw data points
        values.forEach((value, i) => {
            const angle = angleSlice * i - Math.PI / 2;
            const r = rScale(value);
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;

            svg
                .append('circle')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', 5)
                .attr('fill', 'var(--accent-yellow)')
                .attr('stroke', 'white')
                .attr('stroke-width', 2)
                .style('cursor', 'pointer')
                .on('mouseover', function (event) {
                    d3.select(this).attr('r', 7);

                    // Show tooltip
                    const tooltip = svg
                        .append('text')
                        .attr('class', 'tooltip')
                        .attr('x', x)
                        .attr('y', y - 15)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', '12px')
                        .attr('font-weight', 'bold')
                        .attr('fill', 'var(--text-primary)')
                        .text(`${(value * 100).toFixed(0)}%`);
                })
                .on('mouseout', function () {
                    d3.select(this).attr('r', 5);
                    svg.selectAll('.tooltip').remove();
                });
        });

    }, [scores, width, height]);

    return (
        <div className="spider-chart">
            <svg ref={svgRef}></svg>
        </div>
    );
}

