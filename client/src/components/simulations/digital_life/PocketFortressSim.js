import React, { useState, useEffect } from 'react';
import './PocketFortressSim.css';
import {
    FaSignal, FaWifi, FaBatteryFull, FaCog, FaShieldAlt,
    FaLock, FaMapMarkerAlt, FaMicrophone, FaChevronLeft,
    FaBug, FaCheckCircle, FaExclamationTriangle, FaBluetooth, FaUserSecret, FaSync, FaTrash
} from 'react-icons/fa';

const PocketFortressSim = ({ onComplete }) => {
    // --- STATE ---
    const [view, setView] = useState('home'); // home, settings, antivirus, authenticator
    const [battery, setBattery] = useState(100);
    const [securityScore, setSecurityScore] = useState(20);
    const [gameOver, setGameOver] = useState(null);

    // Game Progression State
    const [scanStatus, setScanStatus] = useState('idle'); // idle, scanning, danger, safe
    const [malwareRemoved, setMalwareRemoved] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    // Dynamic Events
    const [activeThreat, setActiveThreat] = useState(null);

    // Settings State
    const [settings, setSettings] = useState({
        location: true,
        microphone: true,
        bluetooth: true,
        wifi_auto: true,
        lock_screen: false,
        encryption: false
    });

    // --- GAME LOOP ---
    useEffect(() => {
        if (gameOver) return;

        const interval = setInterval(() => {
            // Drain Battery based on active features
            let drain = 0.05;
            if (settings.location) drain += 0.02;
            if (settings.bluetooth) drain += 0.02;
            if (settings.wifi_auto) drain += 0.02;
            if (settings.encryption) drain += 0.05;

            // Security Score calculation
            // Base Score from Settings (Max 60)
            let score = 0;
            if (!settings.location) score += 10;
            if (!settings.microphone) score += 10;
            if (!settings.bluetooth) score += 10;
            if (!settings.wifi_auto) score += 10;
            if (settings.lock_screen) score += 10;
            if (settings.encryption) score += 10;

            // Gameplay Actions (Max 40)
            // Antivirus: Cleaning threats is crucial
            if (malwareRemoved) score += 20;

            // Auth: Enabling 2FA is crucial
            if (twoFactorEnabled) score += 20;

            setSecurityScore(score);
            setBattery(prev => Math.max(0, prev - drain));

            // Check Loss
            if (battery <= 0) setGameOver('dead_battery');

        }, 100);

        return () => clearInterval(interval);
    }, [settings, gameOver, battery, malwareRemoved, twoFactorEnabled]);

    // Random Threats (Reduced frequency)
    useEffect(() => {
        if (gameOver || activeThreat) return;

        const randomCheck = setInterval(() => {
            if (Math.random() < 0.002) { // Very low chance
                spawnThreat();
            }
        }, 1000);

        return () => clearInterval(randomCheck);
    }, [activeThreat, gameOver]);

    const spawnThreat = () => {
        setActiveThreat({
            id: Date.now(),
            text: "SYSTEM CLEANER",
            subtext: "Your device is running slow! Click INSTALL to free up RAM.",
            type: 'malware'
        });
    };

    const handleThreatResp = (accept) => {
        if (accept) {
            setGameOver('infected');
        } else {
            setActiveThreat(null);
        }
    };

    const toggleSetting = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const runScan = () => {
        setScanStatus('scanning');
        setTimeout(() => {
            if (!malwareRemoved) {
                setScanStatus('danger');
            } else {
                setScanStatus('safe');
            }
        }, 2000);
    };

    const removeMalware = () => {
        setScanStatus('safe');
        setMalwareRemoved(true);
    };

    const setupTwoFactor = () => {
        setIsAuthenticating(true);
        setTimeout(() => {
            setIsAuthenticating(false);
            setTwoFactorEnabled(true);
        }, 1500);
    };

    // --- RENDERERS ---

    const renderHeader = () => (
        <div className="pf-status-bar">
            <div className="pf-time">12:42 PM</div>
            <div className="pf-status-icons">
                <FaSignal />
                <FaWifi style={{ opacity: settings.wifi_auto ? 1 : 0.5 }} />
                <FaBluetooth style={{ opacity: settings.bluetooth ? 1 : 0.5, fontSize: '0.9em' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: battery < 20 ? '#ef4444' : 'inherit' }}>
                    <span>{Math.floor(battery)}%</span>
                    <FaBatteryFull />
                </div>
            </div>
        </div>
    );

    const renderOverlay = () => {
        if (gameOver) {
            return (
                <div className="pf-overlay">
                    <div className="pf-result-card">
                        {gameOver === 'dead_battery' && (
                            <>
                                <FaBatteryFull size={60} color="#64748b" style={{ marginBottom: 20 }} />
                                <h2 style={{ color: '#fff', marginBottom: 10 }}>BATTERY DEPLETED</h2>
                                <p style={{ color: '#94a3b8', marginBottom: 30 }}>
                                    You ran out of power. Disable unused radios (Bluetooth, GPS) to save battery.
                                </p>
                                <button className="pf-finish-btn" onClick={() => {
                                    setBattery(100);
                                    setGameOver(null);
                                }}>RECHARGE & RETRY</button>
                            </>
                        )}
                        {gameOver === 'infected' && (
                            <>
                                <FaExclamationTriangle size={60} color="#ef4444" style={{ marginBottom: 20 }} />
                                <h2 style={{ color: '#ef4444', marginBottom: 10 }}>SYSTEM COMPROMISED</h2>
                                <p style={{ color: '#cbd5e1', marginBottom: 30 }}>
                                    You installed a malicious application.
                                    Never install "RAM Cleaners" or unknown APKs.
                                </p>
                                <button className="pf-finish-btn" onClick={() => {
                                    setBattery(100);
                                    setGameOver(null);
                                    setActiveThreat(null);
                                }}>FACTORY RESET</button>
                            </>
                        )}
                        {gameOver === 'win' && (
                            <>
                                <FaCheckCircle size={60} color="#10b981" style={{ marginBottom: 20 }} />
                                <h2 style={{ color: '#10b981', marginBottom: 10 }}>HARDENING COMPLETE</h2>
                                <p style={{ color: '#e2e8f0', marginBottom: 30 }}>
                                    Device Security Score: {securityScore}%
                                </p>
                                <button className="pf-finish-btn" onClick={() => onComplete && onComplete(1000)}>
                                    FINISH MISSION
                                </button>
                            </>
                        )}
                    </div>
                </div>
            );
        }

        if (activeThreat) {
            return (
                <div className="pf-alert-overlay">
                    <div className="pf-alert-box">
                        <FaBug size={40} color="#ef4444" style={{ marginBottom: 15 }} />
                        <h3 style={{ color: '#1e293b', marginBottom: 10 }}>{activeThreat.text}</h3>
                        <p style={{ color: '#64748b', marginBottom: 20 }}>{activeThreat.subtext}</p>
                        <div className="pf-alert-actions">
                            <button className="pf-alert-btn deny" onClick={() => handleThreatResp(false)}>IGNORE</button>
                            <button className="pf-alert-btn accept" onClick={() => handleThreatResp(true)}>INSTALL</button>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    const renderHome = () => (
        <div className="pf-home-grid">
            <div className="pf-app-icon" onClick={() => setView('settings')}>
                <div className="icon-bg gray"><FaCog /></div>
                <span>Settings</span>
            </div>

            <div className="pf-app-icon" onClick={() => setView('antivirus')}>
                <div className={`icon-bg blue ${scanStatus === 'danger' ? 'danger-pulse' : ''}`}>
                    <FaShieldAlt />
                </div>
                <span>Defender</span>
                {scanStatus === 'danger' && <div className="badge">!</div>}
            </div>

            <div className="pf-app-icon" onClick={() => setView('auth')}>
                <div className="icon-bg green"><FaLock /></div>
                <span>Auth</span>
                {!twoFactorEnabled && <div className="badge">1</div>}
            </div>

            <div className="pf-app-icon danger" onClick={() => spawnThreat()}>
                <div className="icon-bg red"><FaBug /></div>
                <span>Booster</span>
            </div>

            <div className="pf-security-widget">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>SECURITY SCORE</h4>
                    <span style={{ fontWeight: 'bold', color: securityScore >= 95 ? '#10b981' : '#f59e0b' }}>{securityScore}/100</span>
                </div>
                <div className="sec-bar-track">
                    <div className="sec-bar-fill" style={{
                        width: `${securityScore}%`,
                        background: securityScore >= 95 ? '#10b981' : (securityScore > 60 ? '#f59e0b' : '#ef4444'),
                        height: '100%',
                        borderRadius: 5,
                        transition: 'all 0.5s ease'
                    }} />
                </div>
                <small style={{ color: '#64748b', display: 'block', marginTop: 8 }}>
                    Actions Required:
                    {!malwareRemoved && <span style={{ display: 'block', color: '#ef4444' }}>• Scan for Malware</span>}
                    {!twoFactorEnabled && <span style={{ display: 'block', color: '#f59e0b' }}>• Enable 2FA</span>}
                    {settings.location && <span style={{ display: 'block', color: '#64748b' }}>• Settings Optimization</span>}
                </small>
            </div>

            <button className="pf-finish-btn" onClick={() => {
                if (securityScore >= 95) setGameOver('win');
                else alert(`Security Grade: ${securityScore}%. You must Scan for Malware, Enable 2FA, and Optimize Settings.`);
            }}>
                submit compliance
            </button>
        </div>
    );

    const renderSettings = () => (
        <div className="pf-app-view">
            <div className="pf-app-header" onClick={() => setView('home')}>
                <FaChevronLeft />
                <span>Settings</span>
            </div>
            <div className="pf-settings-list">
                <div className="pf-setting-item">
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><FaMapMarkerAlt color="#60a5fa" /> Location</div>
                    <div className={`toggle ${settings.location ? 'on' : 'off'}`} onClick={() => toggleSetting('location')}>
                        <div className="knob" />
                    </div>
                </div>
                <div className="pf-setting-item">
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><FaBluetooth color="#60a5fa" /> Bluetooth</div>
                    <div className={`toggle ${settings.bluetooth ? 'on' : 'off'}`} onClick={() => toggleSetting('bluetooth')}>
                        <div className="knob" />
                    </div>
                </div>
                <div className="pf-setting-item">
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><FaMicrophone color="#f472b6" /> Mic Access</div>
                    <div className={`toggle ${settings.microphone ? 'on' : 'off'}`} onClick={() => toggleSetting('microphone')}>
                        <div className="knob" />
                    </div>
                </div>
                <div className="pf-setting-item">
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><FaWifi color="#60a5fa" /> Wi-Fi Auto-Join</div>
                    <div className={`toggle ${settings.wifi_auto ? 'on' : 'off'}`} onClick={() => toggleSetting('wifi_auto')}>
                        <div className="knob" />
                    </div>
                </div>
                <div className="pf-setting-item">
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><FaLock color="#34d399" /> Screen Lock</div>
                    <div className={`toggle ${settings.lock_screen ? 'on' : 'off'}`} onClick={() => toggleSetting('lock_screen')}>
                        <div className="knob" />
                    </div>
                </div>
                <div className="pf-setting-item">
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}><FaUserSecret color="#818cf8" /> Encryption</div>
                    <div className={`toggle ${settings.encryption ? 'on' : 'off'}`} onClick={() => toggleSetting('encryption')}>
                        <div className="knob" />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAntivirus = () => (
        <div className="pf-app-view" style={{ height: '100%' }}>
            <div className="pf-app-header" onClick={() => setView('home')}>
                <FaChevronLeft />
                <span>Defender</span>
            </div>
            <div className="pf-antivirus-view">
                <div className={`pf-scan-circle ${scanStatus}`}>
                    {scanStatus === 'idle' && <FaShieldAlt className="pf-scan-icon" />}
                    {scanStatus === 'scanning' && <FaSync className="pf-scan-icon" style={{ animation: 'spin 1s linear infinite' }} />}
                    {scanStatus === 'safe' && <FaCheckCircle className="pf-scan-icon" style={{ color: '#10b981' }} />}
                    {scanStatus === 'danger' && <FaBug className="pf-scan-icon" style={{ color: '#ef4444' }} />}
                </div>

                {scanStatus === 'idle' && (
                    <button className="pf-scan-btn" onClick={runScan}>
                        START SCAN
                    </button>
                )}
                {scanStatus === 'scanning' && <p>Scanning filesystem...</p>}

                {scanStatus === 'danger' && (
                    <div style={{ width: '100%' }}>
                        <h3 style={{ color: '#ef4444', marginBottom: 15 }}>2 THREATS DETECTED</h3>
                        <div className="pf-threat-list">
                            <div className="pf-threat-item">
                                <div>
                                    <FaBug style={{ marginRight: 8 }} />
                                    <span>Trojan.Win32.Spy</span>
                                </div>
                                <small>Detailed Analysis...</small>
                            </div>
                            <div className="pf-threat-item">
                                <div>
                                    <FaExclamationTriangle style={{ marginRight: 8 }} />
                                    <span>Adware.Tracker</span>
                                </div>
                                <small>Detailed Analysis...</small>
                            </div>
                        </div>
                        <button className="pf-fix-btn" onClick={removeMalware}>
                            DELETE ALL THREATS
                        </button>
                    </div>
                )}

                {scanStatus === 'safe' && (
                    <div>
                        <h3 style={{ color: '#10b981' }}>SYSTEM SECURE</h3>
                        <p style={{ color: '#94a3b8', marginBottom: 20 }}>No threats found.</p>
                        <button className="pf-scan-btn" onClick={() => setView('home')} style={{ background: '#334155' }}>
                            CLOSE
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    const renderAuth = () => (
        <div className="pf-app-view">
            <div className="pf-app-header" onClick={() => setView('home')}>
                <FaChevronLeft />
                <span>Authenticator</span>
            </div>

            {!twoFactorEnabled ? (
                <div className="pf-setup-card">
                    <FaLock size={50} color="#3b82f6" style={{ marginBottom: 20 }} />
                    <h3>2FA Not Configured</h3>
                    <p style={{ color: '#94a3b8', margin: '15px 0' }}>
                        Protect your accounts by enabling Two-Factor Authentication.
                        This adds an extra layer of security.
                    </p>
                    {isAuthenticating ? (
                        <button className="pf-setup-btn" disabled>
                            <FaSync style={{ animation: 'spin 1s linear infinite', marginRight: 10 }} />
                            Enabling...
                        </button>
                    ) : (
                        <button className="pf-setup-btn" onClick={setupTwoFactor}>
                            Enable 2FA
                        </button>
                    )}
                </div>
            ) : (
                <div className="pf-auth-list">
                    <div className="pf-auth-item">
                        <div>
                            <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>CYBER-CORP VPN</div>
                            <div className="pf-code">884 921</div>
                        </div>
                        <div className="pf-timer-pie" style={{ '--p': '#3b82f6 75%' }}></div>
                    </div>
                    <div className="pf-auth-item">
                        <div>
                            <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>EMAIL ACCESS</div>
                            <div className="pf-code">192 485</div>
                        </div>
                        <div className="pf-timer-pie" style={{ '--p': '#3b82f6 30%' }}></div>
                    </div>
                    <p style={{ textAlign: 'center', color: '#10b981', marginTop: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FaCheckCircle style={{ marginRight: 5 }} /> 2FA Active & Secure
                    </p>
                </div>
            )}
        </div>
    );

    return (
        <div className="pocket-fortress-container">
            <div className="pf-phone-frame">
                <div className="pf-notch"></div>
                <div className="pf-screen">
                    {renderHeader()}
                    {renderOverlay()}

                    {view === 'home' && renderHome()}
                    {view === 'settings' && renderSettings()}
                    {view === 'antivirus' && renderAntivirus()}
                    {view === 'auth' && renderAuth()}
                </div>
            </div>
        </div>
    );
};

export default PocketFortressSim;
