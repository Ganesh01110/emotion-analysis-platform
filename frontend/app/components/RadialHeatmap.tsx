/* Comment */

'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface RadialHeatmapProps {
    data: { hour: number; day: number; value: number }[];
    width?: number;
    height?: number;
}

export default function RadialHeatmap({ data, width = 600, height = 600 }: RadialHeatmapProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || !data.length) return;

        // Clear previous
        d3.select(svgRef.current).selectAll('*').remove();

        const innerRadius = 50;
        const outerRadius = Math.min(width, height) / 2 - 50;

        const svg = d3
            .select(svgRef.current)
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);

        // Scales
        const x = d3.scaleBand<number>()
            .range([0, 2 * Math.PI])
            .align(0)
            .domain(d3.range(24)); // 0-23 hours

        const y = d3.scaleBand<number>()
            .range([innerRadius, outerRadius])
            .domain(d3.range(7)); // 0-6 days (Sun-Sat)

        const color = d3.scaleLinear<string>()
            .domain([0, 1]) // Value intensity
            .range(['var(--bg-secondary)', 'var(--accent-green)']);

        // Draw bars
        svg.append('g')
            .selectAll('path')
            .data(data)
            .join('path')
            .attr('fill', d => color(d.value))
            .attr('d', d3.arc<any>()
                .innerRadius(d => y(d.day)!)
                .outerRadius(d => y(d.day)! + y.bandwidth())
                .startAngle(d => x(d.hour)!)
                .endAngle(d => x(d.hour)! + x.bandwidth())
                .padAngle(0.01)
                .padRadius(innerRadius)
            )
            .on('mouseover', function (event, d) {
                d3.select(this).attr('stroke', 'var(--accent-yellow)').attr('stroke-width', 2);
                // Add detailed tooltip logic here if needed
            })
            .on('mouseout', function () {
                d3.select(this).attr('stroke', 'none');
            });

        // Add labels
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Day labels
        svg.append('g')
            .selectAll('g')
            .data(days)
            .join('g')
            .attr('text-anchor', 'middle')
            .attr('transform', (d, i) => `
        rotate(${(i * 360 / 7)})
        translate(0, -${outerRadius + 20})
      `)
            .append('text')
            .text(d => d)
            .style('font-size', '12px')
            .style('fill', 'var(--text-secondary)')
            .attr('transform', (d, i) => (i * 360 / 7) > 180 ? 'rotate(180)' : 'rotate(0)');

        // Hour labels (inner circle)
        const hours = [0, 6, 12, 18];
        svg.append('g')
            .selectAll('g')
            .data(hours)
            .join('g')
            .attr('text-anchor', 'middle')
            .attr('transform', (d) => `rotate(${x(d)! * 180 / Math.PI - 90}) translate(${innerRadius - 15},0)`)
            .append('text')
            .text(d => `${d}h`)
            .style('font-size', '10px')
            .style('fill', 'var(--text-secondary)')
            .attr('transform', d => (x(d)! * 180 / Math.PI - 90) > 90 && (x(d)! * 180 / Math.PI - 90) < 270 ? 'rotate(180)' : 'rotate(0)');

    }, [data, width, height]);

    return <svg ref={svgRef} className="mx-auto" />;
}
