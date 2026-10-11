import React, { useState, useEffect } from 'react';
import {
    FaUserSecret,
    FaSearch,
    FaExclamationTriangle,
    FaShieldAlt,
    FaBug,
    FaCheckCircle,
    FaWaveSquare,
    FaLock,
    FaSignal,
    FaTerminal
} from 'react-icons/fa';
import './CyberAwarenessSim.css';
import './ManipulatorSim.css';
import '../../../features/training/CareerPath.css';

const ManipulatorSim = ({ onComplete, phase }) => {
    // --- STATE ---
    const [scripts] = useState([
        {
            id: 1,
            scenario: "Operation: VOICEMAIL_INTERCEPT",
            targetName: "NOVA_BANK_FRAUD_UNIT",
            threatLevel: "CRITICAL",
            lines: [
                { id: 1, speaker: "Attacker", text: "Hello? Is this Alex? This is Sarah from the Fraud Prevention Unit at NovaBank.", duration: 3.2 },
                { id: 2, speaker: "You", text: "Uh, yes this is Alex. Is something wrong?", duration: 2.1 },
                { id: 3, speaker: "Attacker", text: "We've detected an unauthorized outflow of $4,500 to a crypto exchange in Malta. Did you authorize this?", duration: 4.5 },
                { id: 4, speaker: "You", text: "What? No! I definitely didn't do that!", duration: 1.8 },
                { id: 5, speaker: "Attacker", text: "Okay, listen closely. We need to freeze your accounts immediately before the remaining funds are drained.", duration: 4.2 },
                { id: 6, speaker: "Attacker", text: "I've sent a 6-digit verification code to your mobile. Read it to me NOW so I can override the transaction.", duration: 5.0 },
                { id: 7, speaker: "You", text: "Okay, I see it... it says 'Do not share'...", duration: 2.5 },
                { id: 8, speaker: "Attacker", text: "Disregard that, I am the bank. If you don't give me the code in the next 30 seconds, the money is gone forever.", duration: 4.8 }
            ],
            targets: [
                { lineId: 1, tactic: 'authority', found: false },
                { lineId: 3, tactic: 'fear', found: false },
                { lineId: 5, tactic: 'urgency', found: false },
                { lineId: 6, tactic: 'urgency', found: false },
                { lineId: 8, tactic: 'authority', found: false }
            ]
        }
    ]);

    const [currentScriptIndex] = useState(0);
    const [selectedLineId, setSelectedLineId] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // --- HANDLERS ---
    const handleLineClick = (lineId) => {
        if (isSubmitted) return;
        const currentScript = scripts[currentScriptIndex];
        const line = currentScript.lines.find(l => l.id === lineId);

        if (line && line.speaker === 'Attacker') {
            setSelectedLineId(lineId);
        }
    };

    const handleTacticGuess = (tactic) => {
        if (!selectedLineId) return;
        setUserAnswers(prev => ({ ...prev, [selectedLineId]: tactic }));
    };

    const handleSubmitAnalysis = () => {
        const currentScript = scripts[currentScriptIndex];
        let correctCount = 0;
        let totalTargets = currentScript.targets.length;

        currentScript.targets.forEach(target => {
            if (userAnswers[target.lineId] === target.tactic) {
                correctCount++;
            }
        });

        setIsSubmitted(true);
        setSelectedLineId(null);

        if (correctCount === totalTargets) {
            setTimeout(() => onComplete(true, 100), 1000);
        } else {
            onComplete(false, Math.round((correctCount / totalTargets) * 100));
        }
    };

    const script = scripts[currentScriptIndex];

    return (
        <div className="cr-module-desktop manipulator-scene" style={{
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
            <div className="manipulator-interface">

                {/* TOP BAR / HUD */}
                <div className="manipulator-hud">
                    <div className="hud-section left">
                        <div className="hud-label">OpCase_ID</div>
                        <div className="hud-value code-font">739-ALPHA-ZERO</div>
                    </div>
                    <div className="hud-section center">
                        <div className="live-indicator">
                            <span className="blink-dot"></span> LIVE INTERCEPT
                        </div>
                    </div>
                    <div className="hud-section right">
                        <div className="hud-label">System Time</div>
                        <div className="hud-value code-font">{currentTime.toLocaleTimeString()}</div>
                    </div>
                </div>

                {/* MAIN CONSOLE AREA */}
                <div className="console-wrapper">

                    {/* LEFT: VISUALIZER & TRANSCRIPT */}
                    <div className="console-main-feed">
                        <div className="waveform-display">
                            <div className="wave-glitch-layer"></div>
                            <div className="wave-bars">
                                {[...Array(40)].map((_, i) => (
                                    <div key={i} className="eq-bar" style={{
                                        animationDelay: `${i * 0.05}s`,
                                        height: `${Math.random() * 60 + 20}%`
                                    }} />
                                ))}
                            </div>
                            <div className="signal-meta">
                                <span><FaSignal /> SIGNAL: STRONG</span>
                                <span><FaLock /> ENCRYPTION: BYPASSED</span>
                            </div>
                        </div>

                        <div className="transcript-terminal">
                            <div className="terminal-header">
                                <FaTerminal /> <span>/var/logs/voice_packet_dump.log</span>
                            </div>
                            <div className="terminal-content custom-scrollbar">
                                {script.lines.map((line, index) => {
                                    const isSelected = selectedLineId === line.id;
                                    const isAttacker = line.speaker === 'Attacker';
                                    const hasAnswer = userAnswers[line.id];

                                    return (
                                        <div
                                            key={line.id}
                                            className={`chat-entry ${isAttacker ? 'attacker-entry' : 'victim-entry'} ${isSelected ? 'active-scan' : ''} ${hasAnswer ? 'analyzed' : ''}`}
                                            onClick={() => handleLineClick(line.id)}
                                        >
                                            <div className="entry-meta">
                                                <span className="time-code">00:0{index}:{(line.duration * 10).toFixed(0)}</span>
                                                <span className="speaker-id">{isAttacker ? 'UNKNOWN_ACTOR' : 'REDACTED_SUBJECT'}</span>
                                            </div>
                                            <div className="entry-text typing-effect">
                                                {line.text}
                                            </div>
                                            {hasAnswer && (
                                                <div className="analysis-tag">
                                                    TACTIC IDENTIFIED: {hasAnswer.toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: TACTICAL TOOLS */}
                    <div className="console-tools-sidebar">
                        <div className="tools-container">
                            <div className="tools-header">
                                <h3><FaExclamationTriangle /> THREAT ANALYSIS</h3>
                                <div className="progress-bar-container">
                                    <div className="p-bar-track">
                                        <div className="p-bar-fill" style={{ width: `${(Object.keys(userAnswers).length / script.targets.length) * 100}%` }}></div>
                                    </div>
                                    <span className="p-bar-text">{Object.keys(userAnswers).length}/{script.targets.length} THREATS LOGGED</span>
                                </div>
                            </div>

                            <div className="analysis-screen">
                                {!selectedLineId ? (
                                    <div className="idle-state-screen">
                                        <FaSearch className="pulse-icon" />
                                        <h4>AWAITING TARGET SELECTION</h4>
                                        <p>Select a suspicious line from the intercept log to begin threat classification.</p>
                                    </div>
                                ) : (
                                    <div className="active-analysis-screen">
                                        <div className="target-lock-header">
                                            <FaWaveSquare /> SPEECH PATTERN LOCKED
                                        </div>
                                        <div className="tactical-grid">
                                            <button
                                                className={`tactic-card urgency ${userAnswers[selectedLineId] === 'urgency' ? 'selected' : ''}`}
                                                onClick={() => handleTacticGuess('urgency')}
                                            >
                                                <div className="card-icon"><FaExclamationTriangle /></div>
                                                <div className="card-info">
                                                    <span className="card-title">Artificial Urgency</span>
                                                    <span className="card-desc">Demands immediate action to bypass logic</span>
                                                </div>
                                            </button>

                                            <button
                                                className={`tactic-card authority ${userAnswers[selectedLineId] === 'authority' ? 'selected' : ''}`}
                                                onClick={() => handleTacticGuess('authority')}
                                            >
                                                <div className="card-icon"><FaShieldAlt /></div>
                                                <div className="card-info">
                                                    <span className="card-title">Appeal to Authority</span>
                                                    <span className="card-desc">Impersonates officials/power figures</span>
                                                </div>
                                            </button>

                                            <button
                                                className={`tactic-card fear ${userAnswers[selectedLineId] === 'fear' ? 'selected' : ''}`}
                                                onClick={() => handleTacticGuess('fear')}
                                            >
                                                <div className="card-icon"><FaBug /></div>
                                                <div className="card-info">
                                                    <span className="card-title">Intimidation / Fear</span>
                                                    <span className="card-desc">Threatens negative consequences</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="submission-zone">
                                <button
                                    className={`submit-mission-btn ${Object.keys(userAnswers).length > 0 ? 'ready' : 'locked'}`}
                                    onClick={handleSubmitAnalysis}
                                    disabled={isSubmitted || Object.keys(userAnswers).length === 0}
                                >
                                    {isSubmitted ? 'REPORT TRANSMITTED' : 'FINALIZE REPORT'}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ManipulatorSim;
