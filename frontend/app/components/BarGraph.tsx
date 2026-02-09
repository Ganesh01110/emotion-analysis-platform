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

interface BarGraphProps {
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

export default function BarGraph({ scores, width = 400, height = 300 }: BarGraphProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        // Clear previous chart
        d3.select(svgRef.current).selectAll('*').remove();

        const margin = { top: 20, right: 30, bottom: 40, left: 90 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Create SVG
        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Prepare data
        const data = Object.entries(scores)
            .map(([emotion, value]) => ({
                emotion: emotion.charAt(0).toUpperCase() + emotion.slice(1),
                value: value * 100,
                color: EMOTION_COLORS[emotion as keyof typeof EMOTION_COLORS],
            }))
            .sort((a, b) => b.value - a.value);

        // Scales
        const xScale = d3.scaleLinear().domain([0, 100]).range([0, innerWidth]);

        const yScale = d3
            .scaleBand()
            .domain(data.map((d) => d.emotion))
            .range([0, innerHeight])
            .padding(0.3);

        // Axes
        svg
            .append('g')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(xScale).ticks(5).tickFormat((d) => `${d}%`))
            .attr('color', 'var(--text-secondary)')
            .selectAll('text')
            .style('font-size', '10px');

        svg
            .append('g')
            .call(d3.axisLeft(yScale))
            .attr('color', 'var(--text-secondary)')
            .selectAll('text')
            .style('font-size', '11px')
            .style('font-weight', 'bold');

        // Grid lines
        svg
            .append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(
                d3
                    .axisBottom(xScale)
                    .ticks(5)
                    .tickSize(-innerHeight)
                    .tickFormat(() => '')
            )
            .attr('color', 'var(--border-color)')
            .attr('opacity', 0.15);

        // Bars
        svg
            .selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('y', (d) => yScale(d.emotion)!)
            .attr('x', 0)
            .attr('width', 0) // Animation start
            .attr('height', yScale.bandwidth())
            .attr('fill', (d) => d.color)
            .attr('rx', 4)
            .style('opacity', 0.8)
            .transition()
            .duration(1000)
            .attr('width', (d) => xScale(d.value));

        // Interaction
        svg
            .selectAll('rect')
            .on('mouseover', function (event, d: any) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('opacity', 1)
                    .attr('stroke', 'white')
                    .attr('stroke-width', 1);

                // Show value on bar
                svg
                    .append('text')
                    .attr('class', 'value-label')
                    .attr('x', xScale(d.value) + 5)
                    .attr('y', yScale(d.emotion)! + yScale.bandwidth() / 2)
                    .attr('dy', '.35em')
                    .attr('font-size', '10px')
                    .attr('font-weight', 'bold')
                    .attr('fill', 'var(--text-primary)')
                    .text(`${d.value.toFixed(1)}%`);
            })
            .on('mouseout', function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .style('opacity', 0.8)
                    .attr('stroke', 'none');

                svg.selectAll('.value-label').remove();
            });

    }, [scores, width, height]);

    return (
        <div className="bar-graph">
            <svg ref={svgRef}></svg>
        </div>
    );
}
