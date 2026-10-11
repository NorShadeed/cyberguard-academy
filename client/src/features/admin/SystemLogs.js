import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../auth/AuthContext';
import { FaTerminal, FaCircle, FaSync } from 'react-icons/fa';
import './styles/SystemLogs.css';

const SystemLogs = () => {
    const { token } = useContext(AuthContext);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef(null);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/logs', {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                setLogs(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            console.error("Log Stream Error:", err);
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
        // Auto-refresh every 30s
        const interval = setInterval(fetchLogs, 30000);
        return () => clearInterval(interval);
    }, [token]);

    const getSeverityColor = (sev) => {
        if (sev === 'SUCCESS') return '#10b981'; // Green
        if (sev === 'WARN') return '#f59e0b'; // Orange
        if (sev === 'CRIT') return '#ef4444'; // Red
        return '#3b82f6'; // Blue info
    };

    return (
        <div className="system-logs fade-in">
            <div className="manager-header" style={{ marginBottom: '1rem', justifyContent: 'space-between' }}>
                <div>
                    <h3><FaTerminal /> SYSTEM LOG STREAM</h3>
                    <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Live chronological feed of all system activities.</p>
                </div>
                <button className="btn-action" onClick={fetchLogs}><FaSync /> REFRESH LINK</button>
            </div>

            <div className="terminal-window">
                <div className="terminal-header">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                    <span className="terminal-title">user@admin-console:~/logs</span>
                </div>
                <div className="terminal-body">
                    {loading && logs.length === 0 ? (
                        <div className="log-line">Initializing Log Stream...</div>
                    ) : (
                        logs.map((log, idx) => (
                            <div key={idx} className="log-line">
                                <span className="log-time">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                                <span className="log-type" style={{ color: getSeverityColor(log.severity) }}>{log.type}</span>
                                <span className="log-source">@{log.source}:</span>
                                <span className="log-msg">{log.message}</span>
                            </div>
                        ))
                    )}
                    {logs.length === 0 && !loading && (
                        <div className="log-line text-muted">No recent activity found. System idle.</div>
                    )}
                    <div className="log-cursor">_</div>
                    <div ref={bottomRef}></div>
                </div>
            </div>
        </div>
    );
};

export default SystemLogs;
