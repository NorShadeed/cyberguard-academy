import React, { useState, useEffect } from 'react';
import './MissionStart.css';

// A premium, Apple-style cinematic intro
const MissionStart = ({ scenario, selectedRole, onAnimationComplete }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        const timings = [
            1800, // Step 0: Establishing Connection / Authenticating
            1500, // Step 1: Secure Link Established / Loading Data
            3500, // Step 2: The Reveal (Card)
            1000  // Step 3: Fade out
        ];

        if (step < timings.length) {
            const timer = setTimeout(() => {
                setStep(s => s + 1);
            }, timings[step]);
            return () => clearTimeout(timer);
        } else {
            onAnimationComplete();
        }
    }, [step, onAnimationComplete]);

    return (
        <div className={`ms-backdrop ${step >= 3 ? 'fade-out' : ''}`}>
            {/* Ambient Background Elements */}
            <div className="ms-ambient-glow glow-1"></div>
            <div className="ms-ambient-glow glow-2"></div>

            <div className="ms-center-stage">

                {/* PHASE 1: SYSTEM LOADER */}
                <div className={`ms-loader-container ${step >= 2 ? 'exit-up' : ''}`}>
                    {step < 2 && (
                        <>
                            <div className="ms-spinner-ring"></div>
                            <div className="ms-status-text">
                                {step === 0 ? "AUTHENTICATING GUARDIAN..." : "SECURE CONNECTION ESTABLISHED"}
                            </div>
                            <div className={`ms-progress-pill ${step === 1 ? 'complete' : ''}`}>
                                <div className="ms-progress-fill"></div>
                            </div>
                        </>
                    )}
                </div>

                {/* PHASE 2: THE CARD REVEAL */}
                <div className={`ms-briefing-card ${step >= 2 ? 'visible' : ''}`}>
                    <div className="ms-card-header">
                        <span className="ms-badge">CONFIDENTIAL</span>
                        <span className="ms-date">{new Date().toLocaleDateString()}</span>
                    </div>

                    <div className="ms-card-body">
                        <div className="ms-avatar-container">
                            {/* 
                                LOGIC UPDATE: 
                                - TTX (Tabletop) scenarios have > 1 role (e.g. Analyst & Manager). Use the specific role avatar.
                                - Training/Exam scenarios usually have 1 role. Force the "Sentinel" avatar.
                            */}
                            {(() => {
                                const isTTX = scenario.type === 'ttx' || (scenario.roles && Object.keys(scenario.roles).length > 1);
                                const avatarSrc = isTTX ? selectedRole.avatar : '/images/hero-sentinel.png';
                                return (
                                    <img
                                        src={avatarSrc}
                                        alt={selectedRole.name}
                                        className="ms-avatar"
                                        onError={(e) => { e.target.onerror = null; e.target.src = '/images/hero-sentinel.png'; }}
                                    />
                                );
                            })()}
                            <div className="ms-avatar-ring"></div>
                        </div>

                        <div className="ms-identity-block">
                            <h2 className="ms-role-name">{selectedRole.title || selectedRole.name}</h2>
                            <p className="ms-role-title">ACTIVE OPERATIVE</p>
                        </div>

                        <div className="ms-divider"></div>

                        <div className="ms-mission-info">
                            <p className="ms-label">CURRENT ASSIGNMENT</p>
                            <h1 className="ms-scenario-title">{scenario.title}</h1>
                        </div>
                    </div>

                    <div className="ms-card-footer">
                        <div className="ms-footer-status">
                            <span className="ms-dot"></span> SYSTEM READY
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MissionStart;
