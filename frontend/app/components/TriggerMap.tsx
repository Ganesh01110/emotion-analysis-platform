/* Comment */

'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TriggerNode {
    id: string;
    group: number;
    radius: number;
    emotion: string;
}

interface TriggerLink {
    source: string;
    target: string;
    value: number;
}

interface TriggerMapProps {
    nodes: TriggerNode[];
    links: TriggerLink[];
    width?: number;
    height?: number;
}

export default function TriggerMap({ nodes, links, width = 600, height = 400 }: TriggerMapProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current || !nodes.length) return;

        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        // Simulation
        const simulation = d3.forceSimulation<TriggerNode>(nodes)
            .force('link', d3.forceLink<TriggerNode, TriggerLink>(links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-200))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(d => d.radius + 5));

        // Draw links
        const link = svg.append('g')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', 'var(--border-color)')
            .attr('stroke-opacity', 0.6)
            .attr('stroke-width', d => Math.sqrt(d.value));

        // Draw nodes
        const node = svg.append('g')
            .selectAll('g')
            .data(nodes)
            .join('g')
            .call(d3.drag<SVGGElement, TriggerNode>()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended) as any);

        // Node circles
        node.append('circle')
            .attr('r', d => d.radius)
            // @ts-ignore
            .attr('fill', d => `var(--emotion-${d.emotion})`)
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5);

        // Node labels
        node.append('text')
            .text(d => d.id)
            .attr('x', 0)
            .attr('y', d => d.radius + 15)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', 'var(--text-primary)')
            .style('pointer-events', 'none');

        // Simulation tick
        simulation.on('tick', () => {
            link
                // @ts-ignore
                .attr('x1', d => d.source.x)
                // @ts-ignore
                .attr('y1', d => d.source.y)
                // @ts-ignore
                .attr('x2', d => d.target.x)
                // @ts-ignore
                .attr('y2', d => d.target.y);

            node
                .attr('transform', d => `translate(${d.x},${d.y})`);
        });

        function dragstarted(event: any, d: any) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event: any, d: any) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event: any, d: any) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return () => {
            simulation.stop();
        };
    }, [nodes, links, width, height]);

    return <svg ref={svgRef} className="mx-auto border border-[var(--border-color)] rounded-lg bg-[var(--bg-card)]" />;
}
