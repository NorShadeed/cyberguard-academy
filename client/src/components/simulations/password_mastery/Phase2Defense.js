import React, { useState, useEffect } from 'react';
import { FaShieldAlt, FaKey, FaMobileAlt, FaCheck, FaExclamationCircle, FaArrowRight, FaLock, FaTimes, FaQrcode } from 'react-icons/fa';
import './Phase2Defense.css';

const Phase2Defense = ({ onComplete }) => {
    // Steps: 1 (Overview), 2 (Password), 3 (MFA), 4 (Complete)
    const [step, setStep] = useState(1);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [mfaCode, setMfaCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');

    // Initial Issues
    const [issues, setIssues] = useState([
        { id: 'pwd', label: 'Weak Password', desc: 'Current password is leaked.', status: 'critical' },
        { id: 'mfa', label: 'MFA Disabled', desc: 'No second layer of protection.', status: 'critical' }
    ]);

    // Password strength logic
    useEffect(() => {
        const checkStrength = (pwd) => {
            // Strict Policy: >8 chars, Upper, Number, Special, No Repeating Digits
            let score = 0;
            const hasLength = pwd.length > 8;
            const hasUpper = /[A-Z]/.test(pwd);
            const hasNumber = /[0-9]/.test(pwd);
            const hasSpecial = /[^A-Za-z0-9]/.test(pwd);
            const hasNoRepeatingDigits = !/(\d)\1/.test(pwd); // e.g. 11, 22 fails

            if (hasLength) score++;
            if (hasUpper) score++;
            if (hasNumber) score++;
            if (hasSpecial) score++;
            if (hasNoRepeatingDigits) score++;

            // Require ALL conditions for max score (which is now effectively boolean pass/fail for 'Strong')
            // Mapping to 0-4 scale:
            // 5 points = 4 (Excellent)
            // 4 points = 3 (Good)
            // 3 points = 2 (Fair)
            // <3 = 1 (Weak)

            if (score === 5) return 4;
            if (score === 4) return 3;
            if (score === 3) return 2;
            return 1;
        };
        setPasswordStrength(checkStrength(passwordInput));
    }, [passwordInput]);

    // MFA Code Generator
    useEffect(() => {
        if (step === 3) {
            const generate = () => Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedCode(generate());
            const interval = setInterval(() => setGeneratedCode(generate()), 30000);
            return () => clearInterval(interval);
        }
    }, [step]);

    const handlePasswordSubmit = () => {
        if (passwordStrength >= 3) {
            setIssues(prev => prev.map(i => i.id === 'pwd' ? { ...i, label: 'Password Secure', desc: 'High entropy passphrase set.', status: 'resolved' } : i));
            setStep(3);
        }
    };

    const handleMfaSubmit = () => {
        if (mfaCode === generatedCode) {
            setIssues(prev => prev.map(i => i.id === 'mfa' ? { ...i, label: 'MFA Enabled', desc: 'Two-factor auth active.', status: 'resolved' } : i));
            setStep(4);
            setTimeout(() => {
                if (onComplete) onComplete(true, 1000);
            }, 2500);
        }
    };

    return (
        <div className="p2-container-unified" style={{
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
            {/* UNIFIED DASHBOARD CARD */}
            <div className="p2-dashboard-card">

                {/* SIDEBAR (Integrated) */}
                <div className="p2-sidebar-col">
                    <div className="p2-logo-area">
                        <div className="p2-logo-icon"><FaShieldAlt /></div>
                        <span>SecureID</span>
                    </div>

                    <div className="p2-checklist-area">
                        <h4 className="p2-sub-header">SECURITY AUDIT</h4>
                        {issues.map(issue => (
                            <div key={issue.id} className={`p2-nav-item ${issue.status}`}>
                                <div className="p2-nav-icon">
                                    {issue.status === 'resolved' ? <FaCheck /> : <FaExclamationCircle />}
                                </div>
                                <div className="p2-nav-text">
                                    <div className="p2-nav-label">{issue.label}</div>
                                    <div className="p2-nav-desc">{issue.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p2-health-area">
                        <div className="p2-health-label">Health Score</div>
                        <div className="p2-health-number">
                            {issues.filter(i => i.status === 'resolved').length === 0 ? '24%' :
                                issues.filter(i => i.status === 'resolved').length === 1 ? '65%' : '100%'}
                        </div>
                        <div className="p2-health-track">
                            <div className="p2-health-fill" style={{
                                width: issues.filter(i => i.status === 'resolved').length === 0 ? '24%' :
                                    issues.filter(i => i.status === 'resolved').length === 1 ? '65%' : '100%'
                            }}></div>
                        </div>
                    </div>
                </div>

                {/* CONTENT AREA (Integrated) */}
                <div className="p2-content-col">
                    <div className="p2-top-bar">
                        <div className="p2-breadcrumbs">Settings / Security / <strong>Audit</strong></div>
                        <div className="p2-user-badge">Training Account</div>
                    </div>

                    <div className="p2-action-canvas">
                        {step === 1 && (
                            <div className="p2-view-fade">
                                <h2>Security Action Required</h2>
                                <p className="p2-lead-text">We found critical vulnerabilities in your account configuration.</p>
                                <div className="p2-alert-banner">
                                    <FaExclamationCircle />
                                    <span>Your password was found in a known data breach.</span>
                                </div>
                                <div className="p2-btn-row">
                                    <button className="p2-btn-primary" onClick={() => setStep(2)}>
                                        Start Security Fix <FaArrowRight />
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="p2-view-fade">
                                <h2>Change Password</h2>
                                <p className="p2-lead-text">
                                    Create a secure password:<br />
                                    <strong>&gt; 8 Chars, Uppercase, Number, Special Char, No Repeating Numbers.</strong>
                                </p>

                                <div className="p2-input-block">
                                    <label>New Password</label>
                                    <div className="p2-input-w-icon">
                                        <FaKey />
                                        <input
                                            type="text"
                                            placeholder="correct-horse-battery-staple"
                                            value={passwordInput}
                                            onChange={(e) => setPasswordInput(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="p2-strength-meter-unified">
                                        <div className={`p2-strength-dot level-${Math.floor(passwordStrength)}`}></div>
                                        <span>Strength: {['Weak', 'Fair', 'Good', 'Strong', 'Excellent'][Math.floor(passwordStrength)]}</span>
                                    </div>
                                </div>

                                <div className="p2-btn-row">
                                    <button
                                        className="p2-btn-primary"
                                        onClick={handlePasswordSubmit}
                                        disabled={passwordStrength < 3}
                                    >
                                        Update Password
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="p2-view-fade">
                                <h2>Enable High-Assurance MFA</h2>
                                <p className="p2-lead-text">Link your authenticator app for 2-step verification.</p>

                                <div className="p2-mfa-grid">
                                    <div className="p2-qr-box">
                                        <FaQrcode />
                                        <span>Scan Code</span>
                                    </div>
                                    <div className="p2-mfa-inputs">
                                        <div className="p2-phone-mock">
                                            <div className="p2-notif-header">
                                                <div className="p2-notif-icon"><FaShieldAlt /></div>
                                                <span className="p2-notif-title">SecureID</span>
                                                <span className="p2-notif-time">now</span>
                                            </div>
                                            <div className="p2-notif-body">
                                                Your verification code is: <strong className="p2-code-highlight">{generatedCode}</strong>
                                            </div>
                                        </div>
                                        <label>Enter 6-digit code</label>
                                        <input
                                            type="text"
                                            className="p2-input-code"
                                            placeholder="000 000"
                                            maxLength={6}
                                            value={mfaCode}
                                            onChange={(e) => setMfaCode(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <div className="p2-btn-row">
                                    <button
                                        className="p2-btn-primary"
                                        onClick={handleMfaSubmit}
                                        disabled={mfaCode.length !== 6}
                                    >
                                        Verify & Enable
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="p2-view-fade center-view">
                                <div className="p2-success-ring">
                                    <FaCheck />
                                </div>
                                <h2>You're All Set!</h2>
                                <p className="p2-lead-text">Your account is now secured with industry-standard defenses.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Phase2Defense;
