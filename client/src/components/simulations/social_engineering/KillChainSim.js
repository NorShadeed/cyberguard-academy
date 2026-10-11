import React, { useState, useEffect, useRef } from 'react';
import './KillChainSim.css';
import { FaLaptopCode, FaBinoculars, FaUserSecret, FaBug, FaNetworkWired, FaServer, FaSkull, FaCheckCircle, FaLock, FaExclamationTriangle } from 'react-icons/fa';

const KillChainSim = ({ onComplete }) => {
    // --- STATE ---
    const [phase, setPhase] = useState(0);
    const [logs, setLogs] = useState([]);
    const [intel, setIntel] = useState({}); // Collected info
    const [isScanning, setIsScanning] = useState(false);

    // NEW MECHANICS
    const [stealth, setStealth] = useState(100); // 0-100%
    const [gameOver, setGameOver] = useState(null); // 'win', 'burned', 'detected'

    const terminalRef = useRef(null);
    const initRef = useRef(false);

    // --- GAME CONTENT ---
    const PHASES = [
        { id: 'recon', title: 'Reconnaissance', icon: <FaBinoculars /> },
        { id: 'weapon', title: 'Weaponization', icon: <FaBug /> },
        { id: 'delivery', title: 'Delivery', icon: <FaUserSecret /> },
        { id: 'exploit', title: 'Exploitation', icon: <FaLaptopCode /> },
        { id: 'install', title: 'Installation', icon: <FaServer /> },
        { id: 'c2', title: 'Command & Control', icon: <FaNetworkWired /> },
        { id: 'complete', title: 'Mission Complete', icon: <FaSkull /> }
    ];

    const PHASE_DESCRIPTIONS = {
        0: "Identify a high-value target. 'Passive' scans are slow but safe. 'Active' scans are fast but noisy (-20% Stealth).",
        1: "Create a payload. Choose the file type that matches the target's role. Wrong choice increases detection chance.",
        2: "Send the payload. Ensure your email headers (SPF/DKIM) match the spoofed domain to avoid filters.",
        3: "Execute the exploit. Heap Spraying is aggressive. ROP Chains are stealthy. Choose wisely.",
        4: "Establish persistence. Registry keys are common but watched. Scheduled tasks are subtler.",
        5: "Exfiltrate data. Do not max out the bandwidth or the IDS will trigger."
    };

    // --- ACTIONS ---
    const addLog = (msg, type = 'info') => {
        setLogs(prev => [...prev, { id: Math.random(), text: msg, type }]);
    };

    useEffect(() => {
        if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }, [logs]);

    // Check Game Over
    useEffect(() => {
        if (stealth <= 0 && !gameOver) {
            setGameOver('burned');
            addLog("CRITICAL ALERT: IP TRACED BY BLUE TEAM. CONNECTION TERMINATED.", 'error');
        }
    }, [stealth, gameOver]);

    // Initial Boot
    useEffect(() => {
        if (initRef.current) return;
        initRef.current = true;

        if (logs.length === 0) {
            setTimeout(() => addLog("INITIALIZING RED TEAM CONSOLE v3.0 [STEALTH MODE]...", 'system'), 500);
            setTimeout(() => addLog("CONNECTING TO C2 SERVER...", 'info'), 1200);
            setTimeout(() => addLog("LINK ESTABLISHED. TARGET: CORPO_FINANCE.", 'success'), 2000);
            setTimeout(() => addLog("NOTE: MAINTAIN OPSEC. DO NOT LET STEALTH DROP TO 0%.", 'warning'), 2800);
        }
    }, []);

    // --- PHASE 1: RECON LOGIC ---
    const handleReconChoice = (targetId, mode = 'passive') => {
        if (isScanning || gameOver) return;
        setIsScanning(true);

        const cost = mode === 'active' ? 20 : 5;
        const duration = mode === 'active' ? 1000 : 3000;

        addLog(`INITIATING ${mode.toUpperCase()} SCAN: TARGET ${targetId}...`, 'cmd');
        setStealth(prev => Math.max(0, prev - cost));

        setTimeout(() => {
            setIsScanning(false);
            if (targetId === 'B') {
                addLog("SUCCESS: VULNERABLE TARGET IDENTIFIED.", 'success');
                addLog("INTEL ACQUIRED: Sarah Jenkins (Exec Assistant).", 'success');
                setIntel({ ...intel, name: 'Sarah Jenkins', role: 'Exec Assistant', email: 's.jenkins@corp.com' });
                setPhase(1);
            } else {
                addLog("SCAN COMPLETE: TARGET HARDENED. NO VULNERABILITIES.", 'error');
                addLog("ADVICE: Try a softer target.", 'info');
            }
        }, duration);
    };

    // --- PHASE 2: WEAPONIZATION LOGIC ---
    const handleToolChoice = (toolId) => {
        if (isScanning || gameOver) return;
        addLog(`CONFIGURING PAYLOAD: ${toolId}...`, 'cmd');

        if (toolId === 'pdf') {
            addLog("PAYLOAD GENERATED: Malicious_Invoice.pdf", 'success');
            setIntel({ ...intel, payload: 'PDF Exploit' });
            setTimeout(() => setPhase(2), 1500);
        } else {
            addLog("ERROR: TARGET OS MISMATCH. PAYLOAD FAILED.", 'error');
            setStealth(prev => Math.max(0, prev - 30)); // Penalty
        }
    };

    // --- PHASE SCRIPTS (Narrative Expansion) ---
    const PHASE_SCRIPTS = {
        2: [ // DELIVERY
            { text: "INITIATING SMTP RELAY via external proxy...", type: 'cmd', delay: 1500 },
            { text: "SPOOFING HEADER: FROM IT-Support <support@corp-internal.com>", type: 'info', delay: 3000 },
            { text: "BYPASSING SENDER POLICY FRAMEWORK (SPF)... SUCCESS.", type: 'success', delay: 6500 },
            { text: "SENDING TO: s.jenkins@corp.com...", type: 'cmd', delay: 9500 },
            { text: "STATUS: DELIVERED (250 OK).", type: 'success', delay: 11500 }
        ],
        3: [ // EXPLOITATION
            { text: "DETECTED PDF LAUNCH. INJECTING SHELLCODE...", type: 'cmd', delay: 1500 },
            { text: "HEAP SPRAYING ALLOCATIONS... 80%...", type: 'info', delay: 3000 },
            { text: "ROP CHAIN CONSTRUCTED. BYPASSING DEP.", type: 'success', delay: 5000 },
            { text: "REVERSE SHELL ESTABLISHED (PID: 4922).", type: 'success', delay: 7000 }
        ],
        4: [ // INSTALLATION
            { text: "MIGRATING PROCESS TO explorer.exe...", type: 'cmd', delay: 1500 },
            { text: "CREATING SCHEDULED TASK: 'SystemUpdater_KB2931'", type: 'info', delay: 3500 },
            { text: "ROOT/SYSTEM ACCESS GRANTED.", type: 'success', delay: 5000 }
        ],
        5: [ // C2
            { text: "INITIATING ENCRYPTED BEACON (AES-256)...", type: 'cmd', delay: 1500 },
            { text: "HANDSHAKE COMPLETE. CHANNEL SECURE.", type: 'success', delay: 3500 },
            { text: "EXFILTRATING SAM DATABASE...", type: 'warning', delay: 5000 },
            { text: "MISSION COMPLETE. NETWORK COMPROMISED.", type: 'success', delay: 7000 }
        ],
        6: [ // MISSION WRAP-UP
            { text: "SAVING LOOT TO DISK...", type: 'cmd', delay: 800 },
            { text: "DISCONNECTING FROM C2 NODE...", type: 'info', delay: 2400 },
            { text: "OPERATION SUCCESSFUL.", type: 'success', delay: 3000 }
        ]
    };

    const runDetailedPhase = (nextPhase) => {
        if (isScanning || gameOver) return;
        setIsScanning(true);
        const script = PHASE_SCRIPTS[nextPhase];

        if (!script) {
            setIsScanning(false);
            return;
        }

        addLog(`--- STARTING PHASE ${nextPhase + 1} ---`, 'system');

        let maxDelay = 0;
        script.forEach(entry => {
            maxDelay = Math.max(maxDelay, entry.delay);
            setTimeout(() => {
                addLog(entry.text, entry.type);
            }, entry.delay);
        });

        // Finish phase after all scripts run
        setTimeout(() => {
            setIsScanning(false);
            setPhase(nextPhase);
            if (nextPhase === 6) {
                setGameOver('win');
                onComplete && onComplete(1000);
            } else {
                addLog(`PHASE ${nextPhase + 1} COMPLETE. READY FOR NEXT STAGE.`, 'success');
            }
        }, maxDelay + 1000);
    };

    // --- RENDERERS ---
    const renderRecon = () => (
        <div className="kc-main-view">
            <h3 style={{ marginBottom: 20 }}>SELECT RECON STRATEGY</h3>
            <div className="kc-grid-3">
                <div className="kc-target-card">
                    <div className="kc-avatar"><FaUserSecret /></div>
                    <h4>David Ross (CISO)</h4>
                    <div className="kc-btn-group">
                        <button className="kc-btn-small" onClick={() => handleReconChoice('A', 'passive')}>Passive (-5%)</button>
                        <button className="kc-btn-small danger" onClick={() => handleReconChoice('A', 'active')}>Active (-20%)</button>
                    </div>
                </div>
                <div className="kc-target-card" style={{ borderColor: '#ff4757' }}>
                    <div className="kc-avatar" style={{ borderColor: '#ff4757' }}><FaUserSecret /></div>
                    <h4>Sarah Jenkins (EA)</h4>
                    <div className="kc-btn-group">
                        <button className="kc-btn-small" onClick={() => handleReconChoice('B', 'passive')}>Passive (-5%)</button>
                        <button className="kc-btn-small danger" onClick={() => handleReconChoice('B', 'active')}>Active (-20%)</button>
                    </div>
                </div>
                <div className="kc-target-card">
                    <div className="kc-avatar"><FaNetworkWired /></div>
                    <h4>IT Admin</h4>
                    <div className="kc-btn-group">
                        <button className="kc-btn-small" onClick={() => handleReconChoice('C', 'passive')}>Passive (-5%)</button>
                        <button className="kc-btn-small danger" onClick={() => handleReconChoice('C', 'active')}>Active (-20%)</button>
                    </div>
                </div>
            </div>
            {isScanning && <div className="loading-bar"><div className="loading-fill" style={{ width: '100%', animation: 'width 2s' }} /></div>}
        </div>
    );

    const renderWeaponization = () => (
        <div className="kc-main-view">
            <h3 style={{ marginBottom: 20 }}>SELECT ATTACK VECTOR</h3>
            <div className="kc-tool-row">
                <div onClick={() => handleToolChoice('exe')} className="kc-tool-card">
                    <FaBug className="kc-tool-icon" />
                    <div>
                        <h4>Game_Crack.exe</h4>
                        <small>Detection: HIGH</small>
                    </div>
                </div>
                <div onClick={() => handleToolChoice('pdf')} className="kc-tool-card" style={{ borderColor: '#2ecc71' }}>
                    <FaExclamationTriangle className="kc-tool-icon" style={{ color: '#2ecc71' }} />
                    <div>
                        <h4>Urgent_Invoice.pdf</h4>
                        <small>Context: MATCH</small>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderActionCenter = () => {
        if (gameOver === 'burned') {
            return (
                <div className="kc-main-view" style={{ textAlign: 'center', borderColor: 'red' }}>
                    <FaExclamationTriangle size={60} color="red" style={{ marginBottom: 20 }} />
                    <h2 style={{ color: 'red', marginBottom: 10 }}>MISSION FAILED</h2>
                    <p style={{ color: '#fff' }}>
                        Your Stealth dropped to 0%. The Blue Team identified your IP and blocked the attack.
                    </p>
                    <button className="kc-btn-action" style={{ background: '#d32f2f', marginTop: 20 }} onClick={() => window.location.reload()}>RETRY MISSION</button>
                </div>
            );
        }

        if (gameOver === 'win') {
            return (
                <div className="kc-main-view" style={{ textAlign: 'center' }}>
                    <FaCheckCircle size={60} color="#2ecc71" style={{ marginBottom: 20 }} />
                    <h2 style={{ color: '#2ecc71', marginBottom: 10 }}>MISSION ACCOMPLISHED</h2>
                    <p style={{ color: '#fff' }}>
                        Threat neutralized. You successfully identified the attack vector.
                    </p>
                    <div style={{ marginTop: 30, display: 'flex', gap: '15px', justifyContent: 'center' }}>
                        <button className="kc-btn-action" style={{ background: '#2ecc71' }} onClick={() => window.location.reload()}>START NEXT MISSION</button>
                    </div>
                </div>
            );
        }

        if (phase === 0) return renderRecon();
        if (phase === 1) return renderWeaponization();

        let btnText = "EXECUTE NEXT STEP";
        if (phase === 1) btnText = "LAUNCH PHISHING CAMPAIGN";
        if (phase === 2) btnText = "TRIGGER EXPLOIT CHAIN";
        if (phase === 3) btnText = "INSTALL PERSISTENCE";
        if (phase === 4) btnText = "ESTABLISH CMD & CONTROL";
        if (phase === 5) btnText = "FINISH MISSION";

        return (
            <div className="kc-main-view">
                <h3>PHASE {phase + 1}: {PHASES[phase]?.title.toUpperCase()}</h3>

                {isScanning ? (
                    <div className="terminal-monitor">
                        <FaLaptopCode className="pulse-icon" size={40} color="#ff4757" />
                        <p style={{ marginTop: 20, color: '#ff4757' }}>EXECUTING OPERATION...</p>
                        <div className="loading-bar"><div className="loading-fill" style={{ width: '100%', animation: 'width 3s infinite' }} /></div>
                    </div>
                ) : (
                    <>
                        <p style={{ color: '#ddd', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '5px', marginBottom: 20, textAlign: 'left', maxWidth: '85%', fontSize: '14px', lineHeight: '1.5', borderLeft: '3px solid #ff4757' }}>
                            {PHASE_DESCRIPTIONS[phase]}
                        </p>
                        <button
                            className="kc-btn-action"
                            disabled={phase === 6}
                            onClick={() => runDetailedPhase(phase + 1)}
                        >
                            {btnText}
                        </button>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="kill-chain-container" style={{
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
            {/* Header */}
            <div className="kc-header">
                <div className="kc-title-block">
                    <h2>OP: RED_STORM</h2>
                    <span className="kc-subtitle">APT SIMULATION FRAMEWORK v3.0</span>
                </div>
                <div className="kc-status-group">
                    <div style={{ marginRight: 15, color: stealth < 30 ? 'red' : '#00ff9d' }}>
                        STEALTH: {stealth}%
                    </div>
                    <div className="kc-status-badge">connection: {gameOver === 'burned' ? 'LOCKED' : 'SECURE'}</div>
                </div>
            </div>

            <div className="kc-layout-grid">
                {/* 1. TERMINAL */}
                <div className="kc-panel-terminal">
                    <div className="kc-term-header">
                        <div className="dot red" /> <div className="dot yellow" /> <div className="dot green" />
                    </div>
                    <div className="kc-term-body" ref={terminalRef}>
                        {logs.map(log => (
                            <div key={log.id} className={`log-entry ${log.type}`}>
                                <span style={{ marginRight: 8 }}>{'>'}</span>{log.text}
                            </div>
                        ))}
                        <div className="cursor-blink">_</div>
                    </div>
                </div>

                {/* 2. MAIN ACTION */}
                <div className="kc-panel-main">
                    <div className="kc-phase-indicator">
                        {PHASES.map((p, i) => (
                            <div key={p.id} className={`kc-step-dot ${i === phase ? 'active' : ''} ${i < phase ? 'done' : ''}`}>
                                {i < phase ? <FaCheckCircle /> : i + 1}
                            </div>
                        ))}
                    </div>
                    {renderActionCenter()}
                </div>

                {/* 3. INTEL */}
                <div className="kc-panel-intel">
                    <div className="kc-intel-header">Target Intel</div>

                    <div className="kc-data-row">
                        <span className="kc-data-label">TARGET:</span>
                        <span className={`kc-data-value ${!intel.name ? 'redacted' : ''}`}>
                            {intel.name || 'UNKNOWN'}
                        </span>
                    </div>
                    <div className="kc-data-row">
                        <span className="kc-data-label">ROLE:</span>
                        <span className={`kc-data-value ${!intel.role ? 'redacted' : ''}`}>
                            {intel.role || 'UNKNOWN'}
                        </span>
                    </div>
                    <div className="kc-data-row">
                        <span className="kc-data-label">VECTOR:</span>
                        <span className={`kc-data-value ${!intel.payload ? 'redacted' : ''}`}>
                            {intel.payload || 'PENDING'}
                        </span>
                    </div>

                    <div className="kc-stealth-meter-container">
                        <div className="kc-intel-header" style={{ marginTop: 20 }}>OPSEC LEVEL</div>
                        <div style={{ height: 10, background: '#333', borderRadius: 5, marginTop: 10, overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                width: `${stealth}%`,
                                background: stealth < 30 ? 'red' : '#00ff9d',
                                transition: 'width 0.5s'
                            }} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default KillChainSim;
