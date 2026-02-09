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
    onDateClick?: (date: string) => void;
    width?: number;
    height?: number;
}

export default function ActivityHeatmap({ data, onDateClick, width = 700, height = 140 }: ActivityHeatmapProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        // Clear previous chart
        d3.select(svgRef.current).selectAll('*').remove();

        const cellSize = 12;
        const cellPadding = 3;
        const dayLabelWidth = 30;
        const monthLabelHeight = 20;

        // Calculate weeks (GitHub style: columns are weeks, rows are days of week)
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Intensity color scale
        const colorScale = d3
            .scaleLinear<string>()
            .domain([0, 0.25, 0.5, 0.75, 1])
            .range([
                'var(--bg-secondary)',
                'var(--accent-green-low, #c6e5d9)',
                'var(--accent-green)',
                'var(--accent-green-high, #2d4a36)',
                '#1d3324',
            ]);

        // Process data into a map for easy lookup
        const dataMap = new Map(data.map(d => [d.date, d]));

        // Generate dates for the last 6 months
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        // Align startDate to the Monday of the week ~6 months ago
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - (26 * 7));
        const dayOffset = (startDate.getDay() + 6) % 7; // distance to Monday
        startDate.setDate(startDate.getDate() - dayOffset);
        startDate.setHours(0, 0, 0, 0);

        const dates: Date[] = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            dates.push(new Date(d));
        }

        const totalWeeks = Math.ceil(dates.length / 7) + 1;
        const requiredWidth = totalWeeks * (cellSize + cellPadding) + dayLabelWidth + 20;

        const svg = d3
            .select(svgRef.current)
            .attr('width', requiredWidth)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${dayLabelWidth}, ${monthLabelHeight})`);

        // Draw day labels
        dayNames.forEach((day, i) => {
            if (i % 2 === 0) {
                svg.append('text')
                    .attr('x', -5)
                    .attr('y', i * (cellSize + cellPadding) + cellSize / 2)
                    .attr('text-anchor', 'end')
                    .attr('alignment-baseline', 'middle')
                    .attr('font-size', '9px')
                    .attr('fill', 'var(--text-secondary)')
                    .text(day);
            }
        });

        // Draw cells and look for month changes
        let currentMonth = -1;
        dates.forEach((date) => {
            // Calculate position based on the number of days since startDate
            const diffDays = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            const weekIndex = Math.floor(diffDays / 7);
            const dayIndex = (date.getDay() + 6) % 7; // Monday is 0, Sunday is 6

            // Local date string lookup (YYYY-MM-DD)
            const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const dayData = dataMap.get(dateStr) || { date: dateStr, count: 0, intensity: 0 };

            // Draw month label if month changes
            if (date.getMonth() !== currentMonth) {
                currentMonth = date.getMonth();
                svg.append('text')
                    .attr('x', weekIndex * (cellSize + cellPadding))
                    .attr('y', -8)
                    .attr('font-size', '10px')
                    .attr('font-weight', 'bold')
                    .attr('fill', 'var(--text-secondary)')
                    .text(months[currentMonth]);
            }

            svg.append('rect')
                .attr('x', weekIndex * (cellSize + cellPadding))
                .attr('y', dayIndex * (cellSize + cellPadding))
                .attr('width', cellSize)
                .attr('height', cellSize)
                .attr('rx', 2)
                .attr('fill', dayData.count > 0 ? colorScale(dayData.intensity) : 'var(--bg-secondary)')
                .attr('opacity', 1)
                .style('cursor', 'pointer')
                .on('mouseover', function () {
                    d3.select(this)
                        .attr('stroke', 'var(--accent-yellow)')
                        .attr('stroke-width', 1.5);
                })
                .on('mouseout', function () {
                    d3.select(this).attr('stroke', 'none');
                })
                .on('click', () => {
                    if (onDateClick) onDateClick(dateStr);
                });
        });

    }, [data, onDateClick, width, height]);

    return (
        <div className="activity-heatmap-container overflow-x-auto scrollbar-hide pb-2">
            <svg ref={svgRef}></svg>
        </div>
    );
}
