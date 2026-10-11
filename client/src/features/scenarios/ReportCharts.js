// src/ReportCharts.js
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const ScoreTimelineChart = ({ data }) => {
    let cumulativeScore = 0;
    const chartData = data.map((item, index) => {
        cumulativeScore += item.points;
        return {
            name: `Choice ${index + 1}`,
            score: cumulativeScore
        };
    });

    return (
        <div style={{ width: 600, height: 300, background: 'white' }}>
            <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};