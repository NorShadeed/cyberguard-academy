import React, { useState, useEffect } from 'react';
import './InvisibleYouSim.css';
import {
    FaUserSecret, FaSearch, FaTrash, FaShieldAlt, FaEyeSlash,
    FaGlobeAmericas, FaServer, FaCheck
} from 'react-icons/fa';

/**
 * Invisible You Simulation
 * Module 3: Privacy & Data Scrubbing
 *
 * Objective: Reduce Digital Footprint.
 * 1. Social Media Cleanup (Redact PI posts)
 * 2. Broker Opt-Out (Send Delete Requests)
 */
const InvisibleYouSim = ({ onComplete }) => {
    // --- STATE ---
    const [privacyScore, setPrivacyScore] = useState(45); // Start low
    const [posts, setPosts] = useState([
        { id: 1, text: "Can't believe it's my birthday! Born in 1995!", isRisk: true, redacted: false, riskType: "DOB Leak" },
        { id: 2, text: "Just got the keys to my new place at 123 Maple Dr!", isRisk: true, redacted: false, riskType: "Address Leak" },
        { id: 3, text: "Loving the new coffee shop downtown.", isRisk: false, redacted: false, riskType: null },
        { id: 4, text: "My dog 'Buster' is the best boy ever.", isRisk: true, redacted: false, riskType: "Password Hint" }
    ]);

    const [brokers, setBrokers] = useState([
        { id: 1, name: "DataMine Corp", status: "exposed", processing: false },
        { id: 2, name: "PeopleFinder.net", status: "exposed", processing: false },
        { id: 3, name: "PublicRecords.io", status: "exposed", processing: false },
        { id: 4, name: "AdProfile Global", status: "exposed", processing: false }
    ]);

    // --- LOGIC ---
    useEffect(() => {
        // Calculate Score
        let score = 45;

        // +10 for each redacted risk post (Max 30)
        const redactedCount = posts.filter(p => p.isRisk && p.redacted).length;
        score += (redactedCount * 10);

        // +5 for each clean broker (Max 20)
        const cleanBrokers = brokers.filter(b => b.status === 'clean').length;
        score += (cleanBrokers * 6.25); // Math to reach 100 roughly

        setPrivacyScore(Math.min(Math.round(score), 100));

        if (score >= 95) {
            // Wait a moment then finish
        }
    }, [posts, brokers]);

    const handleRedact = (id) => {
        setPosts(posts.map(p =>
            p.id === id ? { ...p, redacted: true } : p
        ));
    };

    const handleOptOut = (id) => {
        // Optimistic UI update with fake loading
        setBrokers(brokers.map(b =>
            b.id === id ? { ...b, processing: true } : b
        ));

        setTimeout(() => {
            setBrokers(prev => prev.map(b =>
                b.id === id ? { ...b, status: 'clean', processing: false } : b
            ));
        }, 1500);
    };

    const handleAutoClean = () => {
        // "DeleteMe" automation power-up (if we wanted to add it)
        // For now, manual is better for learning.
    };

    return (
        <div className="scrubber-container" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: 50,
            overflowY: 'auto',
            paddingTop: '60px',
            background: 'var(--simulation-bg)',
            backgroundRepeat: 'repeat',
            backgroundSize: '512px 512px',
            backgroundAttachment: 'fixed',
        }}>
            <div className="terminal-frame">
                <div className="terminal-header-bar">
                    <div className="traffic-light red"></div>
                    <div className="traffic-light yellow"></div>
                    <div className="traffic-light green"></div>
                    <span className="term-title">GHOST_PROTOCOL_V4.2 // DATA_SCRUBBER</span>
                </div>

                <div className="term-body">
                    <div className="dashboard-grid">

                        {/* LEFT: SOCIAL MEDIA SCANNER */}
                        <div className="panel">
                            <div className="panel-title">
                                <span><FaGlobeAmericas /> SOCIAL_MONITOR</span>
                                <span style={{ color: '#f59e0b' }}>ALERTS: {posts.filter(p => p.isRisk && !p.redacted).length}</span>
                            </div>

                            <div style={{ overflowY: 'auto', flex: 1 }}>
                                {posts.map(post => (
                                    <div key={post.id} className="post-item">
                                        <div className="post-header">
                                            <span>@User123</span>
                                            {post.isRisk && !post.redacted && <span style={{ color: '#ef4444' }}>[RISK DETECTED: {post.riskType}]</span>}
                                        </div>
                                        <div className={post.redacted ? 'redacted' : ''}>
                                            {post.text}
                                        </div>
                                        {post.isRisk && !post.redacted && (
                                            <button className="redact-btn" onClick={() => handleRedact(post.id)}>
                                                <FaEyeSlash /> REDACT CONTENT
                                            </button>
                                        )}
                                        {post.redacted && <div style={{ color: '#ef4444', fontSize: '10px', marginTop: '5px' }}>Content removed by user request.</div>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: DATA BROKERS */}
                        <div className="panel">
                            <div className="panel-title">
                                <span><FaServer /> BROKER_DATABASE</span>
                                <span style={{ color: '#3b82f6' }}>OPT-OUT QUEUE</span>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                {brokers.map(broker => (
                                    <div key={broker.id} className="broker-item">
                                        <div>
                                            <span className="broker-name">{broker.name}</span>
                                            <br />
                                            <span style={{ fontSize: '10px', color: '#666' }}>ID: {Math.random().toString(36).substr(2, 9)}</span>
                                        </div>

                                        {broker.status === 'exposed' && !broker.processing && (
                                            <button className="action-btn" onClick={() => handleOptOut(broker.id)}>
                                                SEND TAKEDOWN
                                            </button>
                                        )}

                                        {broker.processing && (
                                            <span style={{ color: '#f59e0b', fontSize: '11px' }}>PROCESSING...</span>
                                        )}

                                        {broker.status === 'clean' && (
                                            <span className="status-indicator clean"><FaCheck /> REMOVED</span>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="score-display">
                                <div className="score-label">PRIVACY EXPOSURE RISK</div>
                                {/* Invert score for "Risk" display (100 - Score) */}
                                <div className="score-val" style={{ color: privacyScore > 80 ? '#10b981' : '#ef4444' }}>
                                    {100 - privacyScore}%
                                </div>
                                <div className="score-label">Lower is Better</div>
                            </div>
                        </div>

                    </div>

                    {/* FOOTER / COMPLETION */}
                    <div style={{ borderTop: '1px solid #333', marginTop: '15px', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            Status: {privacyScore >= 95 ? "INVISIBLE" : "EXPOSED"}
                        </div>
                        {privacyScore >= 95 ? (
                            <button
                                className="action-btn"
                                style={{ background: '#10b981', color: '#fff', fontSize: '14px', padding: '8px 20px' }}
                                onClick={() => onComplete(privacyScore)}
                            >
                                COMPLETE PROTOCOL
                            </button>
                        ) : (
                            <span style={{ color: '#666' }}>Target Privacy Score: &gt;95% to finish</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvisibleYouSim;
