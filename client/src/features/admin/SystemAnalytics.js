import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { FaShieldAlt } from 'react-icons/fa';
import './styles/AdminLayout.css';
import './styles/UserManagement.css'; // Reusing table styles

const SystemAnalytics = () => {
    const { token } = useContext(AuthContext);
    const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await fetch('/api/admin/content-analytics', {
                    headers: { 'x-auth-token': token }
                });
                if (res.ok) {
                    const data = await res.json();
                    setAnalytics(data);
                }
            } catch (err) {
                console.error("Failed to load intelligence:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [token]);

    return (
        <div className="course-manager fade-in">
            <div className="manager-header" style={{ marginBottom: '1rem' }}>
                <h3>SYSTEM ANALYTICS</h3>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Real-time performance metrics for all training modules.</p>
            </div>

            <div className="admin-table-container">
                {loading ? (
                    <div style={{ padding: '2rem', color: '#fff' }}>Decyrpting Analytics...</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>PROTOCOL ID</th>
                                <th>AGENTS CLEARED</th>
                                <th>TOTAL RUNS</th>
                                <th>AVG SCORE</th>
                                <th>PASS RATE</th>
                                <th>LATEST ACTIVITY</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics.length === 0 ? (
                                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No Field Data Collected Yet.</td></tr>
                            ) : (
                                analytics.map(row => (
                                    <tr key={row.scenarioId}>
                                        <td style={{ color: '#fff', fontWeight: 'bold' }}>
                                            <FaShieldAlt style={{ marginRight: '8px', color: '#3b82f6' }} />
                                            {row.scenarioId}
                                        </td>
                                        <td><span className="kb-badge">{row.uniqueAgents}</span></td>
                                        <td>{row.totalRuns}</td>
                                        <td style={{ color: row.avgScore >= 80 ? '#10b981' : '#f59e0b' }}>{row.avgScore} pts</td>
                                        <td>
                                            <div style={{ width: '100px', background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', position: 'relative' }}>
                                                <div style={{ width: `${row.passRate}%`, background: row.passRate > 70 ? '#10b981' : '#ef4444', height: '100%', borderRadius: '3px' }}></div>
                                            </div>
                                            <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{row.passRate}%</span>
                                        </td>
                                        <td style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                                            {new Date(row.lastPlayed).toLocaleDateString()}
                                        </td>
                                        <td><span className="status-badge active">LIVE</span></td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default SystemAnalytics;
