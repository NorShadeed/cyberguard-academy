import React, { useState, useEffect, useRef } from 'react';
import './IllusionTrustSim.css';
import {
    FaShieldAlt, FaBug, FaSearch, FaExclamationTriangle,
    FaCheckCircle, FaTimesCircle, FaTerminal, FaCode, FaNetworkWired,
    FaReply, FaReplyAll, FaShare, FaTrash, FaStar, FaPrint, FaMoneyBillWave
} from 'react-icons/fa';

// --- DATA: EMAILS & THREATS ---
const EMAILS = [
    {
        id: 1,
        type: 'phishing',
        subject: "Urgent: Payment Authorization Required - INV#99283",
        sender_name: "Gregory House (CEO)",
        sender_email: "g.house@prince-ton.com", // Typo: prince-ton instead of princeton
        timestamp: "Today, 10:42 AM",
        body_content: (
            <>
                <p>Hi Team,</p>
                <p>I'm currently stuck in a conference and can't access the portal. We have a vendor waiting on a wire for <strong>$45,200</strong>.</p>
                <p>Please process the attached invoice immediately. I'll sign off on it when I get back to the office tomorrow.</p>
                <p>Do not delay, or we risk losing the shipment.</p>
                <br />
                <p style={{ color: '#666' }}>Sent from my iPhone</p>
            </>
        ),
        threats: [
            { id: 't1', target: 'sender_email', type: 'spoof', reason: "DOMAIN MISMATCH: 'prince-ton.com' is a registered typo-squatting domain." },
            { id: 't2', target: 'urgency', type: 'psychology', reason: "SOCIAL ENGINEERING: High urgency + Unavailability is a classic CEO Fraud tactic." }
        ],
        distractors: [
            { id: 'd1', target: 'invoice', label: 'attached invoice', reason: "FILE SAFE: The attachment is a standard PDF format. No malware detected." },
            { id: 'd2', target: 'amount', label: '$45,200', reason: "AMOUNT VERIFIED: This matches the vendor's standard billing range." }
        ]
    },
    {
        id: 2,
        type: 'safe',
        subject: "Q4 Marketing Strategy Review & Budget",
        sender_name: "Sarah Wilson",
        sender_email: "s.wilson@princeton.com",
        timestamp: "Yesterday, 4:15 PM",
        body_content: (
            <>
                <p>Good morning,</p>
                <p>Here is the slide deck for tomorrow's meeting. Please review slides 4-9 specifically, as they cover the new budget allocation.</p>
                <p>Let me know if you have any questions about the Q4 projections.</p>
                <br />
                <div style={{ borderLeft: '3px solid #ccc', paddingLeft: 10, color: '#666' }}>
                    CONFIDENTIALITY NOTICE: The contents of this email message and any attachments are intended solely for the addressee(s) and may contain confidential and/or privileged information and may be legally protected from disclosure.
                </div>
                <br />
                <p>Best,<br />Sarah</p>
            </>
        ),
        threats: [],
        distractors: [
            { id: 'd1', target: 'sender_email', label: 'sender_email', reason: "VALID SENDER: 'princeton.com' is the official company domain." },
            { id: 'd2', target: 'disclaimer', label: 'confidentiality notice', reason: "STANDARD DISCLAIMER: This is a standard corporate footer. Safe." }
        ]
    },
    {
        id: 3,
        type: 'phishing',
        subject: "Security Alert: Reset your password immediately",
        sender_name: "IT Support",
        sender_email: "support@princeton-auth.com",
        timestamp: "Today, 9:05 AM",
        body_content: (
            <>
                <p style={{ color: '#c0392b', fontWeight: 'bold' }}>Security Notice</p>
                <p>Your account password will expire in 2 hours.</p>
                <p>To keep your access, please click the link below:</p>
                <p>
                    <a href="#" className="email-cta-btn" style={{ pointerEvents: 'none' }}>Update Password Now</a>
                </p>
                <p style={{ fontSize: '0.8rem', color: '#999' }}>ID: 992-112-AB</p>
                <br />
                <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />
                <p style={{ fontSize: '0.8rem', color: '#aaa' }}>© 2077 Princeton Corp - IT Security Division</p>
            </>
        ),
        threats: [
            { id: 't3', target: 'sender_email', type: 'spoof', reason: "EXTERNAL SENDER: 'princeton-auth.com' is not an official company domain." },
            { id: 't4', target: 'cta', type: 'link', reason: "MALICIOUS LINK: Destination 'bit.ly/secure-login-22' is a known credential harvester." }
        ],
        distractors: [
            { id: 'd1', target: 'id_code', label: 'ID Code', reason: "FORMAT VALID: The Reference ID matches internal ticketing formats." },
            { id: 'd2', target: 'footer', label: 'footer', reason: "COPYRIGHT: Standard footer text. No malicious code found." }
        ]
    },
    // NEW EMAIL 4
    {
        id: 4,
        type: 'safe',
        subject: "Lunch?",
        sender_name: "David Chen",
        sender_email: "d.chen@princeton.com",
        timestamp: "Today, 11:30 AM",
        body_content: (
            <>
                <p>Hey,</p>
                <p>Are we still on for sushi at 12:30? I need to talk to you about the new project timeline.</p>
                <p>- Dave</p>
            </>
        ),
        threats: [],
        distractors: [
            { id: 'd1', target: 'sender_email', label: 'sender_email', reason: "VERIFIED INTERNAL SENDER." }
        ]
    },
    // NEW EMAIL 5
    {
        id: 5,
        type: 'phishing',
        subject: "New Voicemail from +1 (555) 019-2834",
        sender_name: "VoiceMail Service",
        sender_email: "noreply@vvoice-mail.net",
        timestamp: "Today, 11:45 AM",
        body_content: (
            <>
                <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8 }}>
                    <p style={{ fontWeight: 'bold', fontSize: '1.2rem', margin: 0 }}>You have a new voice message</p>
                    <p style={{ color: '#666' }}>Duration: 0:45</p>
                    <div style={{ background: '#333', color: '#fff', padding: '10px 20px', borderRadius: 20, display: 'inline-block', marginTop: 10 }}>
                        ▶ PLAY MESSAGE
                    </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#999', marginTop: 10 }}>
                    To listen to this message, please sign in to your voice portal.
                </p>
            </>
        ),
        threats: [
            { id: 't5', target: 'sender_email', type: 'spoof', reason: "FRAUDULENT DOMAIN: 'vvoice-mail.net' (double 'v') is fake." },
        ],
        distractors: []
    }
];

const IllusionTrustSim = ({ onComplete }) => {
    // Game State
    const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
    const [budget, setBudget] = useState(1000); // STARTING BUDGET
    const [combo, setCombo] = useState(0);
    const [flaggedThreats, setFlaggedThreats] = useState([]);

    // UI State
    const [showFeedback, setShowFeedback] = useState(null); // { title, msg, type }
    const [isScanning, setIsScanning] = useState(false);
    const [logs, setLogs] = useState([]);
    const [gameStatus, setGameStatus] = useState('playing'); // playing, won
    const [scanTarget, setScanTarget] = useState(null); // For visual effect

    const currentEmail = EMAILS[currentEmailIndex];
    const logEndRef = useRef(null);

    // Auto-scroll logs
    useEffect(() => {
        if (logEndRef.current) logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const addLog = (msg, type = 'info') => {
        setLogs(prev => [...prev, { id: Date.now(), msg, type }]);
    };

    const handleInspect = (target, isThreat, data) => {
        if (gameStatus !== 'playing' || isScanning) return;
        if (flaggedThreats.includes(target)) return;

        setIsScanning(true);
        setScanTarget(target);
        addLog(`> INITIATING DEEP SCAN: ${target.toUpperCase()}... ($50 COST)`);
        setBudget(prev => prev - 50); // COST TO SCAN

        // Simulate "Scanning" delay
        setTimeout(() => {
            setIsScanning(false);
            setScanTarget(null);

            if (isThreat) {
                // SUCCESS: BOUNTY
                setFlaggedThreats(prev => [...prev, target]);
                setBudget(prev => prev + 250); // BOUNTY REWARD
                setCombo(prev => prev + 1);
                addLog(`> THREAT CONFIRMED: ${data.reason.split(':')[0]}`, 'success');
                addLog(`> BOUNTY CLAIMED: +$250`, 'success');

                setShowFeedback({
                    title: "THREAT NEUTRALIZED",
                    msg: data.reason,
                    type: "success"
                });
            } else {
                // FAIL: FALSE POSITIVE
                setCombo(0);
                addLog(`> CLEAN. NO THREAT DETECTED.`, 'info');

                setShowFeedback({
                    title: "INTEGRITY VERIFIED",
                    msg: data ? data.reason : "Analysis complete. This element is safe.",
                    type: "info"
                });
            }
        }, 1200);
    };

    const handleNext = () => {
        if (isScanning) return;

        // Logic: Did they find ALL threats?
        const threatsFound = currentEmail.threats.every(t => flaggedThreats.includes(t.target));
        const totalThreats = currentEmail.threats.length;

        // If it's a phishing email and they missed threats
        if (currentEmail.type === 'phishing' && !threatsFound) {
            const missedCount = totalThreats - flaggedThreats.length;
            const penalty = missedCount * 300;

            setBudget(prev => prev - penalty);
            addLog(`CRITICAL ERROR: ${missedCount} THREATS MISSED. SYSTEM COMPROMISED.`, 'error');
            addLog(`INCIDENT RESPONSE COST: -$${penalty}`, 'error');

            setShowFeedback({
                title: "SECURITY INCIDENT",
                msg: `You allowed a phishing email through! We had to pay $${penalty} in incident response costs.`,
                type: "error"
            });

            // Force proceed anyway after acknowledging
            // But we wait for them to close the modal
            return;
        }

        // If they marked a safe email as safe (by clicking next with no flags)
        if (currentEmail.type === 'safe' && flaggedThreats.length === 0) {
            setBudget(prev => prev + 100); // EFFICIENCY BONUS
            addLog(`SAFE EMAIL PROCESSED CORRECTLY. +$100 EFFICIENCY BONUS.`, 'success');
        }

        if (currentEmailIndex < EMAILS.length - 1) {
            addLog(`> EMAIL ${currentEmailIndex + 1} CLOSED. LOADING NEXT...`);
            setFlaggedThreats([]);
            setShowFeedback(null);
            setCurrentEmailIndex(prev => prev + 1);
        } else {
            // End Game
            setGameStatus('won');
            addLog(`> SIMULATION COMPLETE. FINAL BUDGET: $${budget}`);
            setTimeout(() => onComplete && onComplete(Math.max(0, budget)), 2000);
        }
    };

    const getThreatInfo = (target) => currentEmail.threats.find(t => t.target === target);
    const getDistractorInfo = (target) => currentEmail.distractors ? currentEmail.distractors.find(d => d.target === target) : null;

    return (
        <div className="illusion-trust-container" style={{
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
            {/* OVERLAYS */}
            {isScanning && (
                <div className="analyzing-overlay">
                    <div className="scanning-reticle"></div>
                    <div className="scan-text">DEEP SCANNING SECTOR: {scanTarget}...</div>
                </div>
            )}

            {/* MAIN WINDOW */}
            <div className="it-os-window">
                {/* Visual Top Bar */}
                <div className="it-top-bar">
                    <div className="it-window-controls">
                        <div className="win-dot red"></div>
                        <div className="win-dot yellow"></div>
                        <div className="win-dot green"></div>
                    </div>
                    <div className="it-os-title">PhishDetect OS v3.1 [ENTERPRISE]</div>
                    <div style={{ width: 50 }}></div>
                </div>

                <div className="it-content-area">
                    {/* LEFT SIDEBAR */}
                    <div className="it-sidebar-tools">
                        <div>
                            <div className="tool-header">
                                <FaShieldAlt /> <h2>DEFENDER</h2>
                            </div>
                            <div className="scanner-status">
                                <div className="scanner-line"></div>
                                <div className="stat-row">
                                    <span>STATUS</span> <span style={{ color: '#00ff9d' }}>ONLINE</span>
                                </div>
                                <div className="stat-row">
                                    <span>BUDGET</span> <span style={{ color: budget < 0 ? 'red' : '#fff' }}>${budget}</span>
                                </div>
                                <div className="stat-row">
                                    <span>COMBO</span> <span style={{ color: combo > 1 ? '#ff0055' : '#fff' }}>x{combo}</span>
                                </div>
                            </div>
                        </div>

                        {/* LOGS */}
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                            <div style={{ color: '#888', marginBottom: 5, fontSize: '0.8rem' }}>SYSTEM LOGS:</div>
                            <div className="action-log">
                                {logs.map(log => (
                                    <div key={log.id} className={`log-entry ${log.type}`}>
                                        {log.msg}
                                    </div>
                                ))}
                                <div ref={logEndRef} />
                            </div>
                        </div>

                        <button className="next-btn" onClick={() => {
                            // If error modal is open, this button is underneath, but we want the 'CONTINUE' in modal to handle it.
                            // Actually, let's just use this primarily for 'safe' processing.
                            handleNext();
                        }}>
                            {currentEmailIndex === EMAILS.length - 1 ? 'FINALIZE REPORT' : 'PROCESS EMAIL >'}
                        </button>
                    </div>

                    {/* RIGHT: EMAIL VIEWPORT */}
                    <div className="it-email-viewport">
                        {/* Toolbar */}
                        <div className="email-toolbar">
                            <div className="toolbar-group">
                                <div className="toolbar-btn"><FaReply /> Reply</div>
                                <div className="toolbar-btn"><FaReplyAll /> Reply All</div>
                                <div className="toolbar-btn"><FaShare /> Forward</div>
                            </div>
                            <div className="toolbar-group right">
                                <div className="toolbar-btn active" style={{ color: '#00ff9d' }}><FaMoneyBillWave /> Budget: ${budget}</div>
                            </div>
                        </div>

                        {/* Email Paper */}
                        <div className="email-scroll-container">
                            <div className="email-paper">
                                <div className="email-header-grid">
                                    <div className="eh-label">FROM:</div>
                                    <div
                                        className={`eh-value highlight-zone ${flaggedThreats.includes('sender_email') ? 'flagged' : ''}`}
                                        onClick={() => {
                                            const threat = getThreatInfo('sender_email');
                                            const distractor = getDistractorInfo('sender_email');
                                            handleInspect('sender_email', !!threat, threat || distractor);
                                        }}
                                    >
                                        {currentEmail.sender_name} &lt;{currentEmail.sender_email}&gt;
                                    </div>

                                    <div className="eh-label">SUBJECT:</div>
                                    <div className="eh-value">{currentEmail.subject}</div>

                                    <div className="eh-label">DATE:</div>
                                    <div className="eh-value">{currentEmail.timestamp}</div>
                                </div>

                                <div className="email-body-content">
                                    {/* DYNAMIC BODY RENDERING */}
                                    {currentEmail.id === 1 && (
                                        <>
                                            <p>Hi Team,</p>
                                            <p>I'm currently <span
                                                className={`suspicious-element ${flaggedThreats.includes('urgency') ? 'flagged' : ''}`}
                                                onClick={() => handleInspect('urgency', true, getThreatInfo('urgency'))}
                                            >stuck in a conference and can't access the portal</span>. We have a vendor waiting on a wire for <span
                                                className="distractor-element"
                                                onClick={() => handleInspect('amount', false, getDistractorInfo('amount'))}
                                            ><strong>$45,200</strong></span>.</p>
                                            <p>Please process the <span
                                                className="distractor-element"
                                                onClick={() => handleInspect('invoice', false, getDistractorInfo('invoice'))}
                                                style={{ color: '#2563eb', textDecoration: 'underline', cursor: 'pointer' }}
                                            >attached invoice</span> immediately. I'll sign off on it when I get back to the office tomorrow.</p>
                                            <p><span
                                                className={`suspicious-element ${flaggedThreats.includes('urgency') ? 'flagged' : ''}`}
                                                onClick={() => handleInspect('urgency', true, getThreatInfo('urgency'))}
                                            >Do not delay</span>, or we risk losing the shipment.</p>
                                            <br />
                                            <p style={{ color: '#666' }}>Sent from my iPhone</p>
                                        </>
                                    )}

                                    {currentEmail.id === 2 && (
                                        <>
                                            <p>Good morning,</p>
                                            <p>Here is the slide deck for tomorrow's meeting. Please review slides 4-9 specifically, as they cover the new budget allocation.</p>
                                            <p>Let me know if you have any questions about the Q4 projections.</p>
                                            <br />
                                            <div
                                                className="distractor-element"
                                                onClick={() => handleInspect('disclaimer', false, getDistractorInfo('disclaimer'))}
                                                style={{ borderLeft: '3px solid #ccc', paddingLeft: 10, color: '#666', fontSize: '0.85rem', cursor: 'pointer' }}
                                            >
                                                CONFIDENTIALITY NOTICE: The contents of this email message and any attachments are intended solely for the addressee(s) and may contain confidential and/or privileged information and may be legally protected from disclosure.
                                            </div>
                                            <br />
                                            <p>Best,<br />Sarah</p>
                                        </>
                                    )}

                                    {currentEmail.id === 3 && (
                                        <>
                                            <p style={{ color: '#c0392b', fontWeight: 'bold' }}>Security Notice</p>
                                            <p>Your account password will expire in 2 hours.</p>
                                            <p>To keep your access, please click the link below:</p>
                                            <div
                                                className={`suspicious-element ${flaggedThreats.includes('cta') ? 'flagged' : ''}`}
                                                style={{ display: 'inline-block' }}
                                                onClick={() => handleInspect('cta', true, getThreatInfo('cta'))}
                                            >
                                                <span className="email-cta-btn" style={{ background: '#c0392b' }}>Update Password Now</span>
                                            </div>
                                            <p style={{ fontSize: '0.8rem', color: '#999', marginTop: 20 }}>
                                                Reference ID: <span className="distractor-element" onClick={() => handleInspect('id_code', false, getDistractorInfo('id_code'))}>992-112-AB</span>
                                            </p>
                                            <br />
                                            <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />
                                            <p
                                                className="distractor-element"
                                                onClick={() => handleInspect('footer', false, getDistractorInfo('footer'))}
                                                style={{ fontSize: '0.8rem', color: '#aaa' }}
                                            >
                                                © 2077 Princeton Corp - IT Security Division
                                            </p>
                                        </>
                                    )}

                                    {currentEmail.id === 4 && (
                                        currentEmail.body_content
                                    )}
                                    {currentEmail.id === 5 && (
                                        currentEmail.body_content
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FEEDBACK MODAL */}
                {showFeedback && (
                    <div className="feedback-modal">
                        <div className={`feedback-header ${showFeedback.type}`}>
                            {showFeedback.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
                            <span>{showFeedback.title}</span>
                        </div>
                        <div className="feedback-body">
                            {showFeedback.msg}
                        </div>
                        <div className="feedback-footer">
                            <button
                                className={`modal-btn ${showFeedback.type}`}
                                onClick={() => {
                                    setShowFeedback(null);
                                    if (showFeedback.title === "SECURITY INCIDENT" || showFeedback.title === "THREAT NEUTRALIZED") {
                                        // Auto proceed on incident? No, let them see it.
                                        // If it was an error (missed threat), we proceed to next email after acknowledgement
                                        if (showFeedback.type === 'error') {
                                            setFlaggedThreats([]);
                                            if (currentEmailIndex < EMAILS.length - 1) {
                                                setCurrentEmailIndex(prev => prev + 1);
                                            } else {
                                                setGameStatus('won');
                                                setTimeout(() => onComplete && onComplete(Math.max(0, budget)), 1000);
                                            }
                                        }
                                    }
                                }}
                            >
                                CONTINUE
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IllusionTrustSim;
