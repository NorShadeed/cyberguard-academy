import React, { useState, useEffect } from 'react';
import './DigitalNomadSim.css';
import {
    FaPlane, FaWifi, FaBatteryQuarter, FaBatteryFull, FaCoffee,
    FaLock, FaUserSecret, FaUsb, FaLaptop, FaShieldAlt, FaExclamationTriangle
} from 'react-icons/fa';

/**
 * Digital Nomad Simulation
 * Module 2: Remote Work & Travel Security
 *
 * Objective: Survive a layover at an international airport without getting hacked.
 * 3 Decisions:
 * 1. WiFi Connection (VPN vs Free)
 * 2. Charging (USB vs AC)
 * 3. Workspace (Open vs Private)
 */
const DigitalNomadSim = ({ onComplete }) => {
    const [step, setStep] = useState(0); // 0: Intro, 1: WiFi, 2: Power, 3: Workspace, 4: Result
    const [battery, setBattery] = useState(15);
    const [securityHealth, setSecurityHealth] = useState(100);
    const [decisions, setDecisions] = useState([]);
    const [feedback, setFeedback] = useState(null);

    // --- DECISION HANDLERS ---

    // STEP 1: WI-FI
    const handleWifiChoice = (choice) => {
        let health = securityHealth;
        let msg = "";

        if (choice === 'free') {
            health -= 40;
            msg = "Warning: 'Free_Airport_WiFi' was a honeypot! Credentials intercepted.";
        } else if (choice === 'vpn') {
            msg = "Success: VPN Tunnel established. Traffic encrypted.";
        } else {
            health -= 10;
            msg = "Using cellular data is safe, but you burned through your data cap.";
        }

        setDecisions([...decisions, { step: 'wifi', choice, msg }]);
        setSecurityHealth(health);
        setFeedback(msg);
        setStep(2); // Move to Power
    };

    // STEP 2: POWER
    const handlePowerChoice = (choice) => {
        let health = securityHealth;
        let msg = "";

        if (choice === 'usb') {
            health -= 50;
            msg = "CRITICAL: Juice Jacking detected! The kiosk installed a payload via USB data pins.";
        } else if (choice === 'ac') {
            msg = "Smart Move: AC outlets carry power only. No data risk.";
            setBattery(100);
        } else {
            msg = "Safe choice, but your battery is critically low now.";
        }

        setDecisions([...decisions, { step: 'power', choice, msg }]);
        setSecurityHealth(health);
        setFeedback(msg);
        setStep(3); // Move to Workspace
    };

    // STEP 3: WORKSPACE
    const handleWorkspaceChoice = (choice) => {
        let health = securityHealth;
        let msg = "";

        if (choice === 'open') {
            health -= 20;
            msg = "Caution: A stranger was shoulder-surfing your screen. Confidential data exposed.";
        } else if (choice === 'private') {
            msg = "Good Positioning: Back against the wall. No visual angles for attackers.";
        }

        setSecurityHealth(health);
        setFeedback(msg);
        setStep(4); // Finish
    };

    // --- RENDER HELPERS ---

    const renderDialog = () => {
        // SCENARIO 1: WI-FI
        if (step === 1) return (
            <div className="dialog-box">
                <div className="dialog-title">
                    <FaWifi /> Network Connection Required
                </div>
                <p>You need to send an urgent confidential email. The airport has several networks available.</p>
                <div className="dialog-options">
                    <button className="choice-btn" onClick={() => handleWifiChoice('free')}>
                        <strong>Connect to "Free_Airport_WiFi"</strong><br />
                        <small>Strong signal. No password required.</small>
                    </button>
                    <button className="choice-btn" onClick={() => handleWifiChoice('vpn')}>
                        <strong>Use "Lounge_Guest" + VPN</strong><br />
                        <small>Requires login. Encrypted tunnel enabled.</small>
                    </button>
                    <button className="choice-btn" onClick={() => handleWifiChoice('data')}>
                        <strong>Use Phone Hotspot</strong><br />
                        <small>Safe, but slow and expensive roaming.</small>
                    </button>
                </div>
            </div>
        );

        // SCENARIO 2: POWER
        if (step === 2) return (
            <div className="dialog-box">
                <div className="dialog-title">
                    <FaBatteryQuarter style={{ color: '#ef4444' }} /> Low Battery Warning (15%)
                </div>
                <p>Your laptop is dying. You see a convenient USB charging kiosk and a wall outlet near the floor.</p>
                <div className="dialog-options">
                    <button className="choice-btn" onClick={() => handlePowerChoice('usb')}>
                        <strong>Plug into USB Kiosk</strong><br />
                        <small>Fast charging cable provided. Convenient.</small>
                    </button>
                    <button className="choice-btn" onClick={() => handlePowerChoice('ac')}>
                        <strong>Use your own AC Brick</strong><br />
                        <small>Plug into the wall. Requires unpacking bag.</small>
                    </button>
                </div>
            </div>
        );

        // SCENARIO 3: WORKSPACE
        if (step === 3) return (
            <div className="dialog-box">
                <div className="dialog-title">
                    <FaUserSecret /> Physical Security
                </div>
                <p>You need to work on the spreadsheet. Where do you sit?</p>
                <div className="dialog-options">
                    <button className="choice-btn" onClick={() => handleWorkspaceChoice('open')}>
                        <strong>Center Table (High Traffic)</strong><br />
                        <small>Good lighting, but people walking behind you constantly.</small>
                    </button>
                    <button className="choice-btn" onClick={() => handleWorkspaceChoice('private')}>
                        <strong>Corner Booth (Wall Backing)</strong><br />
                        <small>Harder to find, but nobody can see your screen.</small>
                    </button>
                </div>
            </div>
        );

        // RESULT
        if (step === 4) return (
            <div className="dialog-box" style={{ textAlign: 'center' }}>
                <div className="dialog-title" style={{ justifyContent: 'center' }}>
                    <FaPlane /> Mission Debrief
                </div>

                <div style={{ fontSize: '40px', fontWeight: 'bold', color: securityHealth > 80 ? '#10b981' : '#ef4444', margin: '20px 0' }}>
                    {securityHealth}% SECURE
                </div>

                <p>{securityHealth > 80 ? "Excellent work, Agent. You maintained operational security in a hostile environment." : "Mission compromised. Operational security protocols were violated."}</p>

                <button
                    className="choice-btn"
                    style={{ background: '#3b82f6', textAlign: 'center', marginTop: '20px' }}
                    onClick={() => onComplete(securityHealth)}
                >
                    FINISH MODULE
                </button>
            </div>
        );

        return null;
    };

    return (
        <div className="nomad-container" style={{
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
            <div className="scan-line"></div>

            {/* HUD */}
            <div className="nomad-hud">
                <div className="hud-stat">
                    <FaPlane style={{ color: '#3b82f6' }} /> <strong>LHR &rarr; JFK</strong>
                </div>
                <div className="hud-stat">
                    <FaShieldAlt style={{ color: securityHealth > 50 ? '#10b981' : '#ef4444' }} />
                    OpSec: {securityHealth}%
                </div>
                <div className="hud-stat">
                    <div className="battery-level">
                        <div className={`battery-fill ${battery > 90 ? 'charging' : ''}`}></div>
                    </div>
                    {battery}%
                </div>
            </div>

            {/* SCENE */}
            <div className="scene-container">
                {/* Background Art Elements would go here */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.1 }}>
                    {/* Placeholder for map graphics */}
                </div>

                {/* OVERLAY DIALOGS */}
                <div className="dialog-overlay">
                    {step === 0 ? (
                        <div className="dialog-box">
                            <h2 style={{ color: '#3b82f6' }}>Mission: The Layover</h2>
                            <p>You are traveling with sensitive corporate data. Hackers know you are in transit and will attempt to intercept you.</p>
                            <p><strong>Objective:</strong> Survive the airport wait without compromising your device or data.</p>
                            <button className="choice-btn" style={{ marginTop: '20px', textAlign: 'center', background: '#10b981' }} onClick={() => setStep(1)}>
                                START MISSION
                            </button>
                        </div>
                    ) : renderDialog()}
                </div>
            </div>
        </div>
    );
};

export default DigitalNomadSim;
