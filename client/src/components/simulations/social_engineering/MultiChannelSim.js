import React, { useState, useEffect, useRef } from 'react';
import './MultiChannelSim.css';
import {
    FaEnvelope, FaMobileAlt, FaMicrophone, FaCheckCircle,
    FaNetworkWired, FaSkull, FaLockOpen
} from 'react-icons/fa';

const MultiChannelSim = ({ onComplete }) => {
    // Phase 0: Email | Phase 1: SMS | Phase 2: Voice | Phase 3: Complete
    const [phase, setPhase] = useState(0);
    const [isActivating, setIsActivating] = useState(false);

    // Logs State
    const [emailLogs, setEmailLogs] = useState([">_ MAIL_DAEMON READY"]);
    const [smsLogs, setSMSLogs] = useState([]);
    const [voiceLogs, setVoiceLogs] = useState([]);

    const terminalEndRef = useRef(null);

    // Auto-scroll logic
    useEffect(() => {
        if (terminalEndRef.current) terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [emailLogs, smsLogs, voiceLogs]);

    const runPhase = (currentPhase) => {
        if (isActivating) return;
        setIsActivating(true);

        // --- PHASE 0: EMAIL ATTACK ---
        if (currentPhase === 0) {
            const sequence = [
                { delay: 500, log: "> GENERATING LURE: 'Urgent_Wire.pdf'" },
                { delay: 1500, log: "> SPOOFING HEADER: ceo@corp-global.com" },
                { delay: 2500, log: "> BYPASSING SEG (Heuristic Analysis)... OK" },
                { delay: 3500, log: "> STATUS: DELIVERED to Inbox." },
                { delay: 4500, log: "> WAITING FOR CLICK..." },
                { delay: 6000, log: "> CLICK REGISTERED. DEVICE FINGERPRINTED." },
            ];
            runSequence(sequence, setEmailLogs, 1);
        }

        // --- PHASE 1: SMS INTERCEPT ---
        if (currentPhase === 1) {
            setSMSLogs([{ sender: 'system', text: 'Intercepting 2FA...' }]);
            const sequence = [
                { delay: 1000, sender: 'victim', text: 'Where is the code?' },
                { delay: 2500, sender: 'attacker', text: 'CorpSecurity: We detected a login. Reply with code to verify.' },
                { delay: 5000, sender: 'victim', text: 'Is this real?' },
                { delay: 6500, sender: 'attacker', text: 'Urgent: Account will be locked in 60s.' },
                { delay: 9000, sender: 'victim', text: 'Code is 892-114' },
                { delay: 10000, sender: 'system', text: 'TOKEN CAPTURED: 892-114' },
            ];

            // Custom runner for chat object structure
            let totalDelay = 0;
            sequence.forEach(item => {
                totalDelay += item.delay;
                setTimeout(() => {
                    setSMSLogs(prev => [...prev, item]);
                }, totalDelay); // Cumulative delay
            });

            setTimeout(() => {
                setIsActivating(false);
                setPhase(2);
            }, totalDelay + 1000);
        }

        // --- PHASE 2: VOICE DEEPFAKE ---
        if (currentPhase === 2) {
            const sequence = [
                { delay: 500, log: "Synthesizing Audio Model: 'CEO_ Voice_v4'" },
                { delay: 2000, log: "Injecting into Call Stream..." },
                { delay: 3500, log: "ANALYSIS: Target stress levels rising." },
                { delay: 5000, log: "Voice Authentication: BYPASSED." },
                { delay: 6500, log: "Transaction Authorized." },
            ];
            runSequence(sequence, setVoiceLogs, 3);
        }
    };

    const runSequence = (steps, setter, nextPhase) => {
        let maxDelay = 0;
        steps.forEach(step => {
            maxDelay = Math.max(maxDelay, step.delay);
            setTimeout(() => {
                setter(prev => [...prev, step.log]);
            }, step.delay);
        });

        setTimeout(() => {
            setIsActivating(false);
            setPhase(nextPhase);
            if (nextPhase === 3 && onComplete) {
                onComplete(1000); // Auto-save on completion
            }
        }, maxDelay + 1500);
    };

    const renderWaveform = (isActive) => (
        <div className="mc-waveform-view">
            {[...Array(15)].map((_, i) => (
                <div
                    key={i}
                    className="waveform-bar"
                    style={{
                        height: isActive ? `${Math.random() * 80 + 10}%` : '5px',
                        animationDuration: `${Math.random() * 0.5 + 0.5}s`,
                        animationPlayState: isActive ? 'running' : 'paused'
                    }}
                />
            ))}
        </div>
    );

    return (
        <div className="mc-container" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            zIndex: 50,
            overflowY: 'auto',
            paddingTop: '70px',
            background: 'var(--simulation-bg)',
            backgroundRepeat: 'repeat',
            backgroundSize: '512px 512px',
            backgroundAttachment: 'fixed',
        }}>
            <div className="mc-header">
                <div className="mc-title">
                    <h2>TRIAD CONSOLE <span style={{ fontSize: '12px', opacity: 0.5 }}>v0.9.2</span></h2>
                </div>
                <div className="mc-status">
                    CONNECTION: {phase === 3 ? 'TERMINATED' : 'SECURE'}
                </div>
            </div>

            <div className="mc-grid">
                {/* COL 1: EMAIL */}
                <div className={`mc-column ${phase > 0 ? 'completed' : ''} ${phase === 0 ? 'active' : ''}`}>
                    <div className="mc-col-header"><FaEnvelope /> Phishing Vector</div>
                    <div className="mc-terminal-view">
                        {emailLogs.map((log, i) => <div key={i}>{log}</div>)}
                        <div ref={terminalEndRef} />
                    </div>
                    {phase === 0 && (
                        <button className="mc-action-btn" onClick={() => runPhase(0)} disabled={isActivating}>
                            {isActivating ? 'Deploying...' : 'Launch Campaign'}
                        </button>
                    )}
                </div>

                {/* COL 2: SMS */}
                <div className={`mc-column ${phase > 1 ? 'completed' : ''} ${phase === 1 ? 'active' : ''}`}>
                    <div className="mc-col-header"><FaMobileAlt /> SMS Intercept</div>
                    <div className="mc-chat-view">
                        {smsLogs.length === 0 && <div style={{ opacity: 0.5, textAlign: 'center', marginTop: 20 }}>Waiting for trigger...</div>}
                        {smsLogs.map((msg, i) => (
                            <div key={i} className={`chat-bubble ${msg.sender === 'attacker' ? 'sent' : msg.sender === 'system' ? 'system' : 'received'}`}
                                style={msg.sender === 'system' ? { background: '#333', color: '#0f0', width: '100%', textAlign: 'center' } : {}}>
                                {msg.text}
                            </div>
                        ))}
                    </div>
                    {phase === 1 && (
                        <button className="mc-action-btn" onClick={() => runPhase(1)} disabled={isActivating}>
                            {isActivating ? 'Intercepting...' : 'Start Intercept'}
                        </button>
                    )}
                </div>

                {/* COL 3: VOICE */}
                <div className={`mc-column ${phase > 2 ? 'completed' : ''} ${phase === 2 ? 'active' : ''}`}>
                    <div className="mc-col-header"><FaMicrophone /> Voice Clone</div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {renderWaveform(isActivating && phase === 2)}
                        <div className="mc-terminal-view" style={{ height: '100px', flex: 'none', marginTop: 10 }}>
                            {voiceLogs.map((log, i) => <div key={i}>{log}</div>)}
                        </div>
                    </div>
                    {phase === 2 && (
                        <button className="mc-action-btn" onClick={() => runPhase(2)} disabled={isActivating}>
                            {isActivating ? 'Synthesizing...' : 'Execute Vishing'}
                        </button>
                    )}
                </div>
            </div>

            {/* COMPLETION OVERLAY */}
            {phase === 3 && (
                <div className="mc-success-overlay">
                    <FaSkull size={60} color="#d946ef" style={{ marginBottom: 20, filter: 'drop-shadow(0 0 10px #d946ef)' }} />
                    <h1 style={{ fontFamily: 'Orbitron', color: '#d946ef', letterSpacing: '2px' }}>MULTI-CHANNEL COMPROMISE</h1>
                    <p style={{ color: '#94a3b8', marginTop: 10 }}>Target fully subverted across 3 vectors.</p>

                    <div className="mc-stat-row">
                        <div className="mc-stat-item">
                            <div className="mc-stat-val">100%</div>
                            <div className="mc-stat-label">Success Rate</div>
                        </div>
                        <div className="mc-stat-item">
                            <div className="mc-stat-val">3</div>
                            <div className="mc-stat-label">Channels</div>
                        </div>
                        <div className="mc-stat-item">
                            <div className="mc-stat-val">0</div>
                            <div className="mc-stat-label">Detection</div>
                        </div>
                    </div>

                    <div style={{ marginTop: 40, display: 'flex', gap: 20 }}>
                        <button className="mc-action-btn" style={{ background: '#d946ef', border: 'none' }} onClick={() => window.location.reload()}>Replay Simulation</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiChannelSim;
