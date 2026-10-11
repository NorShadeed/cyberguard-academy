import React, { useState, useEffect, useRef } from 'react';
import './PersuasionSim.css';
import { FaPhone, FaUserSecret, FaSignal, FaMicrophone, FaSkull, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const DIALOGUE_TREE = {
    start: {
        text: "CyberCorp Reception, Sarah speaking. How can I direct your call?",
        options: [
            { text: "Use Aggressive Authority", type: 'aggressive', next: 'auth_fail_1', impact: { trust: -10, susp: 30 } },
            { text: "Casual Employee Schmooze", type: 'friendly', next: 'casual_1', impact: { trust: 20, susp: 0 } },
            { text: "Urgent IT Request", type: 'neutral', next: 'it_1', impact: { trust: 10, susp: 10 } }
        ]
    },
    casual_1: {
        text: "Oh, hi! I don't recognize your voice. Are you new here?",
        options: [
            { text: "Yeah, just started in Marketing. Trying to reach the CEO.", type: 'neutral', next: 'marketing_fail', impact: { trust: 0, susp: 40 } },
            { text: "Technically yes, I'm a consultant working with Dave in Ops.", type: 'friendly', next: 'consultant_1', impact: { trust: 20, susp: 5 } },
            { text: "Does it matter? Put me through.", type: 'aggressive', next: 'hangup', impact: { trust: -50, susp: 100 } }
        ]
    },
    it_1: {
        text: "IT? Is this about the printer outage on floor 4? Everyone has been calling about that.",
        options: [
            { text: "Yes exactly! I need the CEO's authorization code to fix it.", type: 'neutral', next: 'printer_fail', impact: { trust: 0, susp: 50 } },
            { text: "No, this is security. We detected a breach on the CEO's line.", type: 'aggressive', next: 'security_1', impact: { trust: 10, susp: 20 } },
            { text: "Actually, yes. I have the CEO on the other line waiting for a patch.", type: 'neutral', next: 'patch_1', impact: { trust: 15, susp: 10 } }
        ]
    },
    consultant_1: {
        text: "Oh, Dave! He's great. So you need Mr. Sterling's office?",
        options: [
            { text: "Yes, we have a lunch meeting. I'm running late!", type: 'friendly', next: 'lunch_win', impact: { trust: 40, susp: 0 } },
            { text: "Yeah, transfer me now.", type: 'neutral', next: 'rude_fail', impact: { trust: -10, susp: 20 } },
            { text: "Actually, I just need his direct cell number.", type: 'aggressive', next: 'cell_fail', impact: { trust: -20, susp: 60 } }
        ]
    },
    security_1: {
        text: "A breach?! Oh my god. Should I call 911?",
        options: [
            { text: "No! Just transfer me to him so I can secure the line.", type: 'aggressive', next: 'sec_win', impact: { trust: 30, susp: 10 } },
            { text: "Stay calm. I need you to give me his password.", type: 'neutral', next: 'pass_fail', impact: { trust: -50, susp: 80 } },
            { text: "Yes, call 911 immediately.", type: 'friendly', next: '911_fail', impact: { trust: 10, susp: 50 } } // Fail because mission abort
        ]
    },
    patch_1: {
        text: "Okay... but his assistant usually handles patch calls. Should I connect you to her first?",
        options: [
            { text: "That works better, thanks Sarah!", type: 'friendly', next: 'assist_win', impact: { trust: 30, susp: -10 } },
            { text: "No, direct line only. Security protocol.", type: 'aggressive', next: 'proto_win', impact: { trust: 20, susp: 20 } },
            { text: "Ugh, fine. Whatever.", type: 'neutral', next: 'rude_fail', impact: { trust: -20, susp: 10 } }
        ]
    },
    // --- END STATES ---
    hangup: { type: 'end', win: false, msg: "CALL TERMINATED: Aggression detected." },
    marketing_fail: { type: 'end', win: false, msg: "BLOCKED: New hires don't get direct CEO access." },
    printer_fail: { type: 'end', win: false, msg: "BUSTED: CEO doesn't handle printer codes." },
    auth_fail_1: { type: 'end', win: false, msg: "REJECTED: Authority approach failed without context." },
    cell_fail: { type: 'end', win: false, msg: "FLAGGED: Asking for personal data triggered alert." },
    pass_fail: { type: 'end', win: false, msg: "REPORTED: Never ask for passwords directly." },
    '911_fail': { type: 'end', win: false, msg: "MISSION ABORT: Police summoned." },
    rude_fail: { type: 'end', win: false, msg: "DISCONNECTED: Target hung up due to rudeness." },

    lunch_win: { type: 'end', win: true, msg: "TRANSFERRING... (Social Validation Success)" },
    sec_win: { type: 'end', win: true, msg: "TRANSFERRING... (Urgency/Fear Success)" },
    assist_win: { type: 'end', win: true, msg: "CONNECTED TO ASSISTANT (Pivot Success)" },
    proto_win: { type: 'end', win: true, msg: "TRANSFERRING... (Authority Compliance)" }
};

const PersuasionSim = ({ onComplete }) => {
    const [currentNode, setCurrentNode] = useState('start');
    const [trust, setTrust] = useState(30); // Start suspicious
    const [suspicion, setSuspicion] = useState(10);
    const [gameState, setGameState] = useState('playing'); // playing, won, lost
    const [transcript, setTranscript] = useState("Connecting...");
    const [isTalking, setIsTalking] = useState(false);

    const node = DIALOGUE_TREE[currentNode];

    useEffect(() => {
        if (!node) return;

        // Simulate "Thinking/Talking" delay
        setIsTalking(true);
        setTranscript("...");

        const delay = node.type === 'end' ? 500 : 1500;

        const timer = setTimeout(() => {
            setIsTalking(false);
            if (node.type === 'end') {
                setTranscript(node.msg);
                setGameState(node.win ? 'won' : 'lost');
                if (node.win && onComplete) onComplete(1000);
            } else {
                setTranscript(node.text);
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [currentNode]);

    const handleChoice = (option) => {
        // Apply Impact
        let newTrust = Math.min(100, Math.max(0, trust + option.impact.trust));
        let newSusp = Math.min(100, Math.max(0, suspicion + option.impact.susp));

        // Random jitter
        newSusp += Math.floor(Math.random() * 5);

        setTrust(newTrust);
        setSuspicion(newSusp);

        // Check Thresholds
        if (newSusp >= 90) {
            setGameState('lost');
            setTranscript("TRANSCRIPT TERMINATED: Suspicion threshold exceeded.");
            return;
        }

        // Move to next node
        setCurrentNode(option.next);
    };

    const getMeterColor = (val, type) => {
        if (type === 'trust') return val > 70 ? '#10b981' : val > 40 ? '#f59e0b' : '#ef4444';
        if (type === 'susp') return val > 80 ? '#ef4444' : val > 50 ? '#f59e0b' : '#10b981';
        return '#fff';
    };

    return (
        <div className="ps-container" style={{
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
            {/* HEADS UP DISPLAY */}
            <div className="ps-hud-header">
                <div className="ps-hud-title">
                    <FaSignal style={{ color: '#10b981' }} />
                    VOICEOPS: LIVE CHANNEL
                </div>
                <div className="ps-rec-dot"></div>
            </div>

            {/* MAIN AREA */}
            <div className="ps-main-grid">

                {/* VISUALIZER & METERS */}
                <div className="ps-visualizer">
                    <div className="ps-meters-overlay">
                        {/* TRUST METER */}
                        <div className="ps-meter-box">
                            <div className="ps-meter-label">
                                <span>TRUST</span>
                                <span style={{ color: getMeterColor(trust, 'trust') }}>{trust}%</span>
                            </div>
                            <div className="ps-meter-bar-bg">
                                <div className="ps-meter-fill" style={{ width: `${trust}%`, backgroundColor: getMeterColor(trust, 'trust') }}></div>
                            </div>
                        </div>

                        {/* SUSPICION METER */}
                        <div className="ps-meter-box">
                            <div className="ps-meter-label">
                                <span>SUSPICION</span>
                                <span style={{ color: getMeterColor(suspicion, 'susp') }}>{suspicion}%</span>
                            </div>
                            <div className="ps-meter-bar-bg">
                                <div className="ps-meter-fill" style={{ width: `${suspicion}%`, backgroundColor: getMeterColor(suspicion, 'susp') }}></div>
                            </div>
                        </div>
                    </div>

                    <div className={`ps-target-avatar ${isTalking ? 'talking' : ''}`}>
                        <FaUserSecret />
                    </div>

                    <div className="ps-wave-container">
                        {[...Array(20)].map((_, i) => (
                            <div
                                key={i}
                                className="ps-wave-bar"
                                style={{
                                    height: isTalking ? `${Math.random() * 40 + 10}px` : '5px',
                                    animationDuration: `${Math.random() * 0.5 + 0.2}s`
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* CONTROLS */}
                <div className="ps-controls">
                    <div className="ps-transcript-box">
                        <span style={{ color: '#666', marginRight: 10 }}>[TARGET]:</span>
                        {transcript}
                    </div>

                    {gameState === 'playing' && !isTalking && node?.options && (
                        <div className="ps-options-grid">
                            {node.options.map((opt, i) => (
                                <button key={i} className={`ps-dialogue-btn ${opt.type}`} onClick={() => handleChoice(opt)}>
                                    <div style={{ fontWeight: 'bold', marginBottom: 5, color: '#fff' }}>
                                        {opt.type.toUpperCase()}
                                    </div>
                                    {opt.text}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* END SCREENS */}
            {gameState !== 'playing' && (
                <div className="ps-end-screen">
                    {gameState === 'won' ? (
                        <>
                            <FaCheckCircle size={60} color="#10b981" style={{ marginBottom: 20 }} />
                            <h2 className="ps-end-title" style={{ color: '#10b981' }}>ACCESS GRANTED</h2>
                            <p style={{ color: '#888' }}>Objective Complete. Target Compromised.</p>
                        </>
                    ) : (
                        <>
                            <FaSkull size={60} color="#ef4444" style={{ marginBottom: 20 }} />
                            <h2 className="ps-end-title" style={{ color: '#ef4444' }}>CONNECTION LOST</h2>
                            <p style={{ color: '#888' }}>The target terminated the call.</p>
                        </>
                    )}

                    <div className="ps-stat-grid">
                        <div className="ps-stat">
                            <div className="ps-stat-val" style={{ color: '#10b981' }}>{trust}%</div>
                            <div className="ps-stat-label">Trust</div>
                        </div>
                        <div className="ps-stat">
                            <div className="ps-stat-val" style={{ color: '#ef4444' }}>{suspicion}%</div>
                            <div className="ps-stat-label">Suspicion</div>
                        </div>
                    </div>

                    <button className="ps-btn-primary" onClick={() => window.location.reload()}>
                        Retry Operation
                    </button>
                </div>
            )}
        </div>
    );
};

export default PersuasionSim;
