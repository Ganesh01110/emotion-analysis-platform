/* Comment */

'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';

interface TemporalDriftData {
    date: string;
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
}

interface TemporalDriftChartProps {
    data: TemporalDriftData[];
}

export default function TemporalDriftChart({ data }: TemporalDriftChartProps) {
    return (
        <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis
                        dataKey="date"
                        stroke="var(--text-secondary)"
                        tick={{ fill: 'var(--text-secondary)' }}
                    />
                    <YAxis
                        stroke="var(--text-secondary)"
                        tick={{ fill: 'var(--text-secondary)' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--bg-card)',
                            borderColor: 'var(--border-color)',
                            color: 'var(--text-primary)'
                        }}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="joy"
                        stroke="var(--emotion-joy)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="sadness"
                        stroke="var(--emotion-sadness)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="anger"
                        stroke="var(--emotion-anger)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="fear"
                        stroke="var(--emotion-fear)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
