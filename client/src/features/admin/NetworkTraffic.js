import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { FaNetworkWired, FaSync, FaArrowDown, FaArrowUp } from 'react-icons/fa';
import './styles/AdminLayout.css';
import './styles/UserManagement.css'; // Reusing table styles

const NetworkTraffic = () => {
    const { token } = useContext(AuthContext);
    const [packets, setPackets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    const fetchTraffic = async () => {
        if (isPaused) return; // Stop fetching if paused

        try {
            const res = await fetch('/api/admin/traffic', {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                setPackets(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Packet Capture Failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTraffic();
        const interval = setInterval(fetchTraffic, 2000); // 2s Poll
        return () => clearInterval(interval);
    }, [token, isPaused]); // Re-run when pause state changes

    const getStatusColor = (status) => {
        if (status >= 500) return '#ef4444'; // Red
        if (status >= 400) return '#f59e0b'; // Orange
        if (status >= 200) return '#10b981'; // Green
        return '#94a3b8';
    };

    return (
        <div className="network-monitor fade-in">
            <div className="manager-header" style={{ marginBottom: '1rem', justifyContent: 'space-between' }}>
                <div>
                    <h3><FaNetworkWired /> NETWORK INTERCEPTOR</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Live Packet Capture & Analysis</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button
                        className="btn-action"
                        onClick={() => setIsPaused(!isPaused)}
                        style={{ borderColor: isPaused ? '#f59e0b' : '#10b981', color: isPaused ? '#f59e0b' : '#10b981' }}
                    >
                        {isPaused ? <FaSync className="spin-paused" /> : <FaSync className="spin" />}
                        {isPaused ? 'RESUME FEED' : 'PAUSE FEED'}
                    </button>
                    <div className="stat-mini-pill">
                        <FaArrowDown style={{ color: '#10b981' }} /> INCOMING
                    </div>
                </div>
            </div>

            <div className="admin-table-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                <table className="admin-table traffic-table">
                    <thead style={{ position: 'sticky', top: 0, background: '#1e293b', zIndex: 10 }}>
                        <tr>
                            <th style={{ width: '10%' }}>METHOD</th>
                            <th style={{ width: '45%' }}>ENDPOINT / PATH</th>
                            <th style={{ width: '10%' }}>STATUS</th>
                            <th style={{ width: '10%' }}>LATENCY</th>
                            <th style={{ width: '25%' }}>TIMESTAMP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {packets.map(pkt => (
                            <tr key={pkt.id} className="packet-row">
                                <td style={{ fontWeight: 'bold', color: pkt.method === 'GET' ? '#60a5fa' : '#c084fc' }}>
                                    {pkt.method}
                                </td>
                                <td style={{ fontFamily: 'monospace', color: '#e2e8f0', wordBreak: 'break-all' }}>
                                    {pkt.path}
                                </td>
                                <td>
                                    <span className="status-pill" style={{ color: getStatusColor(pkt.status), borderColor: getStatusColor(pkt.status) }}>
                                        {pkt.status}
                                    </span>
                                </td>
                                <td style={{ color: '#94a3b8' }}>{pkt.duration}</td>
                                <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                    {new Date(pkt.timestamp).toLocaleTimeString()}
                                </td>
                            </tr>
                        ))}
                        {packets.length === 0 && (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Listening for traffic...</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NetworkTraffic;
