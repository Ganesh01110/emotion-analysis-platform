/* Comment */

'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ActivityData {
    date: string;
    count: number;
    intensity: number;
}

interface ActivityHeatmapProps {
    data: ActivityData[];
    width?: number;
    height?: number;
}

export default function ActivityHeatmap({ data, width = 800, height = 150 }: ActivityHeatmapProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || !data.length) return;

        // Clear previous chart
        d3.select(svgRef.current).selectAll('*').remove();

        const cellSize = 15;
        const cellPadding = 3;
        const weeksToShow = 16;

        // Create SVG
        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        // Color scale
        const colorScale = d3
            .scaleLinear<string>()
            .domain([0, 0.25, 0.5, 0.75, 1])
            .range([
                'var(--bg-secondary)',
                '#c6e5d9',
                'var(--accent-green)',
                '#4a7c59',
                '#2d4a36',
            ]);

        // Group data by week
        const weeks: ActivityData[][] = [];
        for (let i = 0; i < weeksToShow; i++) {
            weeks.push(data.slice(i * 7, (i + 1) * 7));
        }

        // Draw cells
        weeks.forEach((week, weekIndex) => {
            week.forEach((day, dayIndex) => {
                const x = weekIndex * (cellSize + cellPadding);
                const y = dayIndex * (cellSize + cellPadding);

                svg
                    .append('rect')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('width', cellSize)
                    .attr('height', cellSize)
                    .attr('rx', 3)
                    .attr('fill', colorScale(day.intensity))
                    .style('cursor', 'pointer')
                    .on('mouseover', function (event) {
                        d3.select(this).attr('stroke', 'var(--accent-yellow)').attr('stroke-width', 2);

                        // Show tooltip
                        const tooltip = svg
                            .append('text')
                            .attr('class', 'tooltip')
                            .attr('x', x + cellSize / 2)
                            .attr('y', y - 5)
                            .attr('text-anchor', 'middle')
                            .attr('font-size', '11px')
                            .attr('font-weight', 'bold')
                            .attr('fill', 'var(--text-primary)')
                            .text(`${day.count} entries`);
                    })
                    .on('mouseout', function () {
                        d3.select(this).attr('stroke', 'none');
                        svg.selectAll('.tooltip').remove();
                    });
            });
        });

        // Add day labels
        const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
        days.forEach((day, i) => {
            if (i % 2 === 0) {
                // Only show every other day to avoid crowding
                svg
                    .append('text')
                    .attr('x', -25)
                    .attr('y', i * (cellSize + cellPadding) + cellSize / 2)
                    .attr('text-anchor', 'end')
                    .attr('dominant-baseline', 'middle')
                    .attr('font-size', '10px')
                    .attr('fill', 'var(--text-secondary)')
                    .text(day);
            }
        });

    }, [data, width, height]);

    return (
        <div className="activity-heatmap">
            <svg ref={svgRef}></svg>
        </div>
    );
}

