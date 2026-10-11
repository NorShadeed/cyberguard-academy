import React, { useState, useEffect, useRef } from 'react';
import './BypassShieldSim.css';
import {
    FaShieldAlt, FaNetworkWired, FaServer, FaUser, FaGlobe,
    FaBolt, FaCheckCircle, FaLock, FaExclamationTriangle, FaChartLine
} from 'react-icons/fa';

// --- ENTERPRISE DASHBOARD DATA ---
const ATTACK_STEPS = [
    {
        id: 0,
        title: "Infrastructure Deployment",
        desc: "Initialize the reverse proxy server (Evilginx2) to intercept traffic.",
        buttonText: "Deploy Proxy Service",
        logType: "INFO",
        logs: [
            "Initializing container orchestration...",
            "Service 'reverse-proxy-01' status: RUNNING",
            "SSL Certificate provisioned (Let's Encrypt Authority)",
            "Listener active on port 443 (HTTPS)"
        ],
        edu: {
            concept: "The Reverse Proxy",
            explanation: "Instead of a fake website, hackers deploy a 'middleman' server. This server forwards your traffic to the REAL website and forwards the real website's response back to you. To you, everything looks perfect.",
            defense: "Check the URL carefully. Even if the site looks 100% real, the domain (e.g., 'login-msoft.com') will inevitably be different from the official one."
        }
    },
    {
        id: 1,
        title: "Lure Distribution",
        desc: "Dispatch targeted email campaigns to high-value assets.",
        buttonText: "Execute Phishing Campaign",
        logType: "INFO",
        logs: [
            "Campaign 'Q4-Urgent' initialized...",
            "Target list loaded: 1 asset(s)",
            "Email dispatched to: ceo@target-corp.com",
            "Delivery Status: DELIVERED (250 OK)"
        ],
        edu: {
            concept: "Targeted Phishing (Spearphishing)",
            explanation: "Attackers don't spam everyone. They research High Value Targets (CEOs, Admins) and craft specific emails affecting their work (e.g., 'Urgent Invoice'). This increases the click rate significantly.",
            defense: "Be skeptical of 'Urgent' or 'Financial' requests, even from known contacts. Verify via a secondary channel (Slack, Phone) before clicking."
        }
    },
    {
        id: 2,
        title: "Credential Interception",
        desc: "Monitor traffic for successful clicking and credential entry.",
        buttonText: "Monitor Traffic",
        logType: "WARNING",
        logs: [
            "New Session detected from IP: 192.168.1.55",
            "Request intercepted: POST /login",
            "Credentials captured in transit",
            "Proxying request to Identity Provider..."
        ],
        edu: {
            concept: "Man-in-the-Middle (MitM)",
            explanation: "Because the traffic flows THROUGH the attacker's server, they can see everything you type—including your username and password—in plain text before sending it to the real bank/system.",
            defense: "Password Managers help here! They won't auto-fill your credentials if the domain doesn't match the official one exactly."
        }
    },
    {
        id: 3,
        title: "MFA Relay",
        desc: "Forward the MFA challenge to the victim and relay the token.",
        buttonText: "Relay Token",
        logType: "WARNING",
        logs: [
            "Identity Provider requested MFA Challenge (SMS)",
            "Challenge forwarded to client session",
            "Client response received: 899-221",
            "Token relayed to Upstream Provider"
        ],
        edu: {
            concept: "MFA Bypass",
            explanation: "This is the scary part. The attacker sees the real bank ask for a 2FA code. They show YOU that request. You type the code. They effectively 'copy-paste' that code to the real bank instantly.",
            defense: "Use FIDO2/WebAuthn Hardware Keys (like YubiKeys). They are mathematically bound to the domain and cannot be phished or relayed like SMS codes."
        }
    },
    {
        id: 4,
        title: "Session Extraction",
        desc: "Extract the authenticated session cookie to bypass future checks.",
        buttonText: "Extract Session Cookie",
        logType: "ALERT",
        logs: [
            "Upstream authentication: SUCCESS",
            "Session Token (ESTSAUTH) generated",
            "CRITICAL: Session Cookie extracted to persistence layer",
            "Attack Lifecycle Complete."
        ],
        edu: {
            concept: "Session Decomposition (The Checkmate)",
            explanation: "Once logged in, the server gives you a 'Session Cookie' so you don't have to login again. The hacker steals this COOKIE. Now they can open your account on THEIR browser without needing your password or 2FA ever again.",
            defense: "Admins can reduce token lifetimes (make cookies expire faster) or require compliant devices (Intune/MDM) so stolen cookies won't work on the hacker's laptop."
        }
    }
];

const BypassShieldSim = ({ onComplete }) => {
    // State
    const [currentStep, setCurrentStep] = useState(0);
    const [logs, setLogs] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [networkState, setNetworkState] = useState('IDLE'); // IDLE, ACTIVE, COMPLETE

    const logsEndRef = useRef(null);

    // Initial Logs
    useEffect(() => {
        addLog("SYSTEM", "Dashboard initialized. Waiting for admin action...", "INFO");
    }, []);

    // Auto-scroll logic
    useEffect(() => {
        if (logsEndRef.current) logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const addLog = (source, msg, type) => {
        setLogs(prev => [...prev, {
            id: Date.now() + Math.random(),
            time: new Date().toLocaleTimeString(),
            source,
            msg,
            type
        }]);
    };

    const handleAction = () => {
        if (isProcessing) return;
        setIsProcessing(true);
        setNetworkState('ACTIVE'); // Start animation

        const stepData = ATTACK_STEPS[currentStep];

        // 1. Log Action Start
        addLog("ADMIN", `Executing: ${stepData.title}...`, "INFO");

        // 2. Simulate Delay for "Enterprise" feel (smooth loaders)
        let delay = 0;
        stepData.logs.forEach((logMsg, i) => {
            delay += 800; // Slower, more deliberate pace
            setTimeout(() => {
                addLog("SYSTEM", logMsg, stepData.logType);
            }, delay);
        });

        // 3. Complete Step
        setTimeout(() => {
            setIsProcessing(false);
            setNetworkState('IDLE');

            if (currentStep < ATTACK_STEPS.length - 1) {
                setCurrentStep(prev => prev + 1);
            } else {
                setNetworkState('COMPLETE');
                addLog("SYSTEM", "OPERATION SUCCESSFUL. SESSION HIJACKED.", "SUCCESS");
                setTimeout(() => onComplete && onComplete(1000), 2000);
            }
        }, delay + 1000);
    };

    return (
        <div className="bypass-shield-container" style={{
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
            <div className="bs-dashboard">
                {/* HEADER */}
                <div className="bs-header">
                    <div className="bs-logo-area">
                        <FaShieldAlt style={{ color: '#2563eb' }} />
                        <span>CloudSec <span style={{ fontWeight: '400', color: '#64748b' }}>Monitor</span></span>
                    </div>
                    <div className="bs-status-badge">
                        <div className={`status-dot ${isProcessing ? 'active' : ''}`}></div>
                        STATUS: {isProcessing ? 'PROCESSING' : 'READY'}
                    </div>
                </div>

                <div className="bs-grid">
                    {/* LEFT PANEL: TIMELINE & CONTROLS */}
                    <div className="bs-sidebar">
                        <div>
                            <div className="bs-section-title">ATTACK LIFECYCLE</div>
                            <div className="step-indicator">
                                {ATTACK_STEPS.map((step, idx) => (
                                    <div key={step.id} className={`step-item ${currentStep === idx ? 'active' : ''} ${currentStep > idx ? 'completed' : ''}`}>
                                        <div className="step-icon">
                                            {currentStep > idx ? <FaCheckCircle /> : idx + 1}
                                        </div>
                                        <div className="step-content">
                                            <div className="step-title">{step.title}</div>
                                            <div className="step-desc">{step.desc}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="control-actions">
                            {networkState !== 'COMPLETE' && (
                                <button className="primary-btn" onClick={handleAction} disabled={isProcessing}>
                                    {isProcessing ? (
                                        <>
                                            <FaNetworkWired className="spin" /> Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FaBolt /> {ATTACK_STEPS[currentStep].buttonText}
                                        </>
                                    )}
                                </button>
                            )}
                            {networkState === 'COMPLETE' && (
                                <div style={{ textAlign: 'center', color: '#10b981', fontWeight: 'bold', border: '1px solid #10b981', padding: 12, borderRadius: 8, background: 'rgba(16, 185, 129, 0.1)' }}>
                                    MISSION COMPLETE
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL: TOP (MAP) & BOTTOM (LOGS) */}
                    <div className="bs-main-view">
                        {/* MAP AREA */}
                        <div className="bs-map-area">
                            <div className="bs-section-title">LIVE NETWORK TOPOLOGY</div>

                            <div className="bs-analysis-panel">
                                <div className="analysis-header">
                                    <FaChartLine className="analysis-icon" />
                                    <span>THREAT ANALYSIS: {ATTACK_STEPS[currentStep].edu.concept}</span>
                                </div>
                                <div className="analysis-content">
                                    <div className="edu-block">
                                        <h4><FaExclamationTriangle style={{ color: '#f59e0b' }} /> THE MECHANIC</h4>
                                        <p>{ATTACK_STEPS[currentStep].edu.explanation}</p>
                                    </div>
                                    <div className="edu-block">
                                        <h4><FaShieldAlt style={{ color: '#10b981' }} /> THE DEFENSE</h4>
                                        <p>{ATTACK_STEPS[currentStep].edu.defense}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bs-map-container">
                                {/* Connector Lines */}
                                <div className="connector-line"></div>

                                {/* Nodes */}
                                <div className={`map-node ${currentStep >= 0 ? 'active' : ''}`}>
                                    <div className="node-icon-wrapper"><FaUser /></div>
                                    <span className="node-label">Victim Client</span>
                                </div>

                                <div className={`map-node ${currentStep >= 0 ? 'active' : ''} ${currentStep === 0 ? 'hidden-node' : ''}`}>
                                    <div className="node-icon-wrapper"><FaNetworkWired /></div>
                                    <span className="node-label">AiTM Proxy</span>
                                    <div className={`node-badge ${currentStep >= 2 ? 'visible' : ''}`}>TRAFFIC INTERCEPTED</div>
                                </div>

                                <div className={`map-node ${currentStep >= 0 ? 'active' : ''}`}>
                                    <div className="node-icon-wrapper"><FaServer /></div>
                                    <span className="node-label">Identity Provider</span>
                                </div>

                                {/* Animated Packet */}
                                {isProcessing && (
                                    <div className="data-packet animate"></div>
                                )}
                            </div>
                        </div>

                        {/* LOGS PANEL */}
                        <div className="bs-logs-panel">
                            <div className="logs-header">
                                <div className="logs-title">
                                    <FaChartLine /> EVENT LOGS
                                </div>
                            </div>
                            <div className="logs-table">
                                {logs.map(log => (
                                    <div key={log.id} className="log-row">
                                        <span className="log-time">{log.time}</span>
                                        <span className={`log-type ${log.type}`}>{log.type}</span>
                                        <div className="log-msg" title={log.msg}>{log.msg}</div>
                                    </div>
                                ))}
                                <div ref={logsEndRef} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BypassShieldSim;
