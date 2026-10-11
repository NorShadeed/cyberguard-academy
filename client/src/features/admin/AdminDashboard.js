import React, { useState, useEffect, useContext } from 'react';
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { FaServer, FaUsers, FaGlobeAmericas, FaShieldAlt } from 'react-icons/fa';
import { AuthContext } from '../auth/AuthContext';
import './styles/AdminDashboard.css'; // New Modular CSS

const AdminDashboard = () => {
    const { token } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [trafficData, setTrafficData] = useState([]);
    const [moduleData, setModuleData] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch High-Level Stats & Modules
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Parallel fetch for speed
                const [statsRes, modulesRes] = await Promise.all([
                    fetch('/api/admin/stats', { headers: { 'x-auth-token': token } }),
                    fetch('/api/admin/content-analytics', { headers: { 'x-auth-token': token } })
                ]);

                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setStats(data);
                }

                if (modulesRes.ok) {
                    const rawData = await modulesRes.json();

                    // AGGREGATE BY COURSE
                    // We map specific scenario/phase IDs to their Parent Course
                    const courseStats = {};

                    rawData.forEach(item => {
                        let courseName = 'Unknown Module';
                        const id = item.scenarioId;

                        // Logic to identify Course based on ID patterns
                        if (id.startsWith('pm_') || id.includes('password')) {
                            courseName = 'Password Mastery';
                        } else if (id.startsWith('p') || id.startsWith('sc_') || id.startsWith('exam_')) {
                            courseName = 'Cyber Awareness Fundamentals';
                        }

                        if (!courseStats[courseName]) {
                            courseStats[courseName] = { name: courseName, totalRuns: 0, totalPasses: 0, count: 0 };
                        }

                        courseStats[courseName].totalRuns += item.totalRuns;
                        // Calculate passes from rate
                        const passes = Math.round((item.passRate / 100) * item.totalRuns);
                        courseStats[courseName].totalPasses += passes;
                        courseStats[courseName].count += 1;
                    });

                    // Convert back to array for Recharts
                    const formatData = Object.values(courseStats).map(c => ({
                        name: c.name,
                        completions: c.totalRuns,
                        passRate: c.totalRuns > 0 ? Math.round((c.totalPasses / c.totalRuns) * 100) : 0
                    }));

                    setModuleData(formatData);
                }

            } catch (err) {
                console.error("Admin Dashboard Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    // 2. Poll for Live Traffic (Every 2s)
    useEffect(() => {
        const fetchTraffic = async () => {
            try {
                const res = await fetch('/api/admin/traffic', {
                    headers: { 'x-auth-token': token }
                });
                if (res.ok) {
                    const data = await res.json();
                    // Data is an array of requests. We need to aggregate requests per second/time-slice for the chart.
                    // For the "Live Network Requests" chart, we want to show volume over time.
                    // Since the API returns a buffer of ALL recent requests, we just need to count them buckets?
                    // actually, the previous fake code was "requests per second".
                    // The API `getTrafficData` returns the raw log buffer (array of objects).
                    // We need to visualize Volume or simple "Count of entries in buffer" as a proxy for load?
                    // Let's visualize the "Duration" of recent requests to show latency spikes?
                    // OR: Just count how many requests happened in the last 2 seconds.

                    // Let's adapt: We receive the last 100 requests.
                    // We can plot the 'duration' of the last 20 requests to show system latency health.
                    // OR we just count them.

                    // Simplified Interpretation for "Live Traffic Graph":
                    // We'll create a single data point representing "Now" with the 'active buffer load'
                    const now = new Date();
                    const point = {
                        time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
                        requests: data.length, // Visualize buffer filling up? Or just raw count
                        latency: data.reduce((acc, curr) => acc + parseInt(curr.duration), 0) / (data.length || 1) // Avg Latency
                    };

                    setTrafficData(prev => {
                        const newData = [...prev, point];
                        if (newData.length > 20) newData.shift();
                        return newData;
                    });
                }
            } catch (err) {
                // Silent fail for traffic poll
            }
        };

        const interval = setInterval(fetchTraffic, 2000);
        return () => clearInterval(interval);
    }, [token]);


    if (loading) return <div className="admin-dashboard"><h2 style={{ color: 'white' }}>Acquiring Uplink...</h2></div>;

    return (
        <div className="admin-dashboard">
            {/* TOP METRICS GRID */}
            <div className="dashboard-grid-top">
                <div className="stat-panel">
                    <div className="panel-icon"><FaUsers /></div>
                    <div className="panel-info">
                        <h3>TOTAL OPERATIVES</h3>
                        <p className="panel-value">{stats?.totalUsers || 0}</p>
                    </div>
                </div>
                <div className="stat-panel">
                    <div className="panel-icon"><FaGlobeAmericas /></div>
                    <div className="panel-info">
                        <h3>ACTIVE TODAY</h3>
                        <p className="panel-value">{stats?.activeUsers || 0}</p>
                    </div>
                </div>
                <div className="stat-panel">
                    <div className="panel-icon"><FaShieldAlt /></div>
                    <div className="panel-info">
                        <h3>AVG PASS RATE</h3>
                        <p className="panel-value">
                            {moduleData.length > 0
                                ? Math.round(moduleData.reduce((acc, curr) => acc + curr.passRate, 0) / moduleData.length) + '%'
                                : '0%'}
                        </p>
                    </div>
                </div>
                <div className="stat-panel">
                    <div className="panel-icon"><FaServer /></div>
                    <div className="panel-info">
                        <h3>SYSTEM HEALTH</h3>
                        <p className="panel-value" style={{ color: '#10b981' }}>
                            {stats?.threatLevel === 'LOW' ? 'OPTIMAL' : stats?.threatLevel || 'UNKNOWN'}
                        </p>
                    </div>
                </div>
            </div>

            {/* CHARTS GRID */}
            <div className="dashboard-charts">
                {/* LIVE TRAFFIC (LATENCY/LOAD) */}
                <div className="chart-container wide">
                    <h3>LIVE NETWORK LATENCY (ms)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={trafficData}>
                            <defs>
                                <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis dataKey="time" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip
                                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLatency)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* MODULE STATS (Updated to Bar Chart for better comparison) */}
                <div className="chart-container">
                    <h3>MODULE COMPLETIONS</h3>
                    {moduleData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={moduleData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.1)" />
                                <XAxis type="number" stroke="#6b7280" />
                                <YAxis dataKey="name" type="category" stroke="#fff" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#1e293b', border: 'none' }} itemStyle={{ color: '#fff' }} />
                                <Bar dataKey="completions" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ color: '#9ca3af', fontStyle: 'italic', padding: '2rem' }}>
                            No module data available yet. Operatives must complete scenarios to populate this graph.
                        </div>
                    )}
                </div>

                {/* SYSTEM LOAD (Real Data) */}
                <div className="chart-container">
                    <h3>SERVER RESOURCES</h3>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', height: '100%' }}>
                        <div style={{ flex: 1 }}>
                            <div className="metric-row" style={{ marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <span style={{ color: '#9ca3af' }}>CPU LOAD</span>
                                    <span style={{ color: '#fff' }}>{stats?.systemLoad?.cpu || 0}%</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                                    <div style={{ width: `${stats?.systemLoad?.cpu || 0}%`, height: '100%', background: '#10b981', borderRadius: '3px' }}></div>
                                </div>
                            </div>
                            <div className="metric-row">
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    <span style={{ color: '#9ca3af' }}>MEMORY</span>
                                    <span style={{ color: '#fff' }}>{stats?.systemLoad?.memory || 'Unavail'}</span>
                                </div>
                                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
                                    {/* Mock visual for memory since backend sends string */}
                                    <div style={{ width: '40%', height: '100%', background: '#6366f1', borderRadius: '3px' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
