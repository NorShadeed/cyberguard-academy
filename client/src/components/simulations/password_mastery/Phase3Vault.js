import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaKey, FaLock, FaExclamationTriangle, FaCheckCircle, FaFingerprint, FaSync, FaGlobe } from 'react-icons/fa';
import './Phase3Vault.css';

const Phase3Vault = ({ onComplete }) => {
    // Audit State: 'scanning', 'critical', 'secure'
    const [status, setStatus] = useState('scanning');
    const [score, setScore] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);

    // Fake Vault Items
    const [items, setItems] = useState([
        { id: 1, name: 'Personal Email', username: 'alex.doe@gmail.com', type: 'critical', issue: 'Pwned in Data Breach', solution: 'passkey' },
        { id: 2, name: 'National Bank', username: 'alex1990', type: 'warning', issue: 'Weak Password', solution: 'generate' },
        { id: 3, name: 'Netflix', username: 'alex.doe@gmail.com', type: 'warning', issue: 'Reused Password', solution: 'generate' },
        { id: 4, name: 'Twitter / X', username: '@alex_d', type: 'secure', issue: 'Secure', solution: null },
    ]);

    // Initial Scan Effect
    useEffect(() => {
        setTimeout(() => {
            setStatus('critical');
            setScore(45);
        }, 2000);
    }, []);

    // Check completion
    useEffect(() => {
        const unresolved = items.filter(i => i.type !== 'secure');
        if (unresolved.length === 0 && status !== 'scanning') {
            setStatus('secure');
            setScore(100);
            setTimeout(() => {
                if (onComplete) onComplete(true, 1000);
            }, 3000);
        } else if (status !== 'scanning') {
            const secureCount = items.filter(i => i.type === 'secure').length;
            const newScore = Math.floor((secureCount / items.length) * 100);
            setScore(newScore);
        }
    }, [items, status]);

    const handleFix = (item) => {
        setSelectedItem(item);
    };

    const applyFix = () => {
        if (!selectedItem) return;

        // Simulate processing
        const updatedItems = items.map(i => {
            if (i.id === selectedItem.id) {
                return { ...i, type: 'secure', issue: 'Secured via Vault', solution: null };
            }
            return i;
        });

        setItems(updatedItems);
        setSelectedItem(null);
    };

    return (
        <div className="p3-container" style={{
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
            <div className="p3-vault-app">

                {/* SIDEBAR */}
                <div className="p3-sidebar">
                    <div className="p3-app-brand">
                        <FaShieldAlt className="p3-brand-icon" />
                        <span>VaultID</span>
                    </div>

                    <div className="p3-nav-group">
                        <div className="p3-nav-item active"><FaLock /> All Items <span className="p3-badge">{items.length}</span></div>
                        <div className="p3-nav-item"><FaKey /> Passkeys</div>
                        <div className="p3-nav-item"><FaSync /> Generator</div>
                    </div>

                    <div className="p3-security-card">
                        <div className="p3-score-ring" style={{ borderColor: score === 100 ? '#10b981' : '#f43f5e' }}>
                            <span className="p3-score-num">{score}%</span>
                        </div>
                        <div className="p3-score-label">Vault Health</div>
                    </div>
                </div>

                {/* MAIN CONTENT */}
                <div className="p3-main-view">
                    <div className="p3-header">
                        <h1>My Vault</h1>
                        <div className="p3-search-bar">
                            <FaGlobe /> Search vault...
                        </div>
                    </div>

                    <div className="p3-item-list">
                        {status === 'scanning' ? (
                            <div className="p3-scanning-state">
                                <FaSync className="p3-spin" /> Scanning Dark Web...
                            </div>
                        ) : (
                            items.map(item => (
                                <div key={item.id} className={`p3-vault-item ${item.type}`} onClick={() => handleFix(item)}>
                                    <div className="p3-item-icon">
                                        {item.name[0]}
                                    </div>
                                    <div className="p3-item-details">
                                        <div className="p3-item-name">{item.name}</div>
                                        <div className="p3-item-user">{item.username}</div>
                                    </div>
                                    <div className="p3-item-status">
                                        {item.type === 'critical' && <span className="p3-tag critical"><FaExclamationTriangle /> Breached</span>}
                                        {item.type === 'warning' && <span className="p3-tag warning"><FaExclamationTriangle /> Weak</span>}
                                        {item.type === 'secure' && <span className="p3-tag secure"><FaCheckCircle /> Secure</span>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* RIGHT PANEL / DETAIL OVERLAY */}
                {selectedItem && (
                    <div className="p3-detail-panel">
                        <div className="p3-detail-header">
                            <h2>{selectedItem.name}</h2>
                            <button className="p3-close-btn" onClick={() => setSelectedItem(null)}>Close</button>
                        </div>

                        <div className="p3-detail-content">
                            <div className="p3-issue-box">
                                <h3>Security Risk Found</h3>
                                <p>{selectedItem.issue}</p>
                            </div>

                            {selectedItem.solution === 'passkey' && (
                                <div className="p3-action-area">
                                    <div className="p3-biometric-scan" onClick={applyFix}>
                                        <FaFingerprint className="p3-fingerprint" />
                                        <span>Click to Create Passkey</span>
                                    </div>
                                </div>
                            )}

                            {selectedItem.solution === 'generate' && (
                                <div className="p3-action-area">
                                    <button className="p3-generate-btn" onClick={applyFix}>
                                        <FaSync /> Generate Strong Password
                                    </button>
                                    <div className="p3-preview-pass">
                                        Xy9#mP2$kL!nQr5
                                    </div>
                                </div>
                            )}

                            {selectedItem.solution === null && (
                                <div className="p3-success-msg">
                                    <FaCheckCircle /> Item is secure.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* SUCCESS OVERLAY */}
                {score === 100 && (
                    <div className="p3-success-overlay">
                        <div className="p3-success-modal">
                            <FaShieldAlt className="p3-huge-icon" />
                            <h2>Vault Secure</h2>
                            <p>All credentials upgraded to maximum security.</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Phase3Vault;
