import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaLock, FaCheck, FaShieldAlt, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import './ForgotPassword.css';
import { validatePasswordStrength, meetsPasswordPolicy, getStrengthInfo } from '../../utils/passwordValidator';

import logoPremium from '../../assets/logo-premium.png';

const ForgotPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    // State management
    const [step, setStep] = useState(token ? 'reset' : 'request'); // 'request', 'sent', 'reset'
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [notification, setNotification] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [showPasswordReqs, setShowPasswordReqs] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Password strength
    const passwordStrength = validatePasswordStrength(newPassword);
    const strengthInfo = getStrengthInfo(passwordStrength);

    // Helper: Show Notification
    const showNotify = (type, msg) => {
        setNotification({ type, message: msg });
        setIsLoading(false);
    };

    // Handler: Request Password Reset
    const handleRequestReset = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.post('/api/auth/forgot-password', { email });
            showNotify('success', 'RESET LINK TRANSMITTED TO SECURE CHANNEL');
            setStep('sent');
        } catch (err) {
            // Always show success to prevent email enumeration
            showNotify('success', 'IF EMAIL EXISTS, RESET LINK HAS BEEN SENT');
            setStep('sent');
        }
    };

    // Handler: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();

        // Validation
        if (!meetsPasswordPolicy(newPassword)) {
            showNotify('error', 'Password does not meet security requirements');
            return;
        }

        if (newPassword !== confirmPassword) {
            showNotify('error', 'Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            await axios.post(`/api/auth/reset-password/${token}`, {
                password: newPassword
            });
            showNotify('success', 'PASSWORD RESET SUCCESSFUL. REDIRECTING...');
            setTimeout(() => navigate('/auth'), 2000);
        } catch (err) {
            showNotify('error', err.response?.data?.msg || 'Reset failed. Token may be invalid or expired.');
        }
    };

    return (
        <div className="auth-megacontainer">
            <div className="auth-card">

                {/* NOTIFICATIONS */}
                {notification.message && (
                    <div className={`auth-notification ${notification.type}`}>
                        {notification.type === 'success' ? <FaCheck /> : <FaShieldAlt />}
                        <span>{notification.message}</span>
                    </div>
                )}

                {/* LEFT PANEL: BRANDING */}
                <div className="auth-panel left-panel">
                    <div className="panel-content">
                        <div className="visual-hero">
                            <div className="hero-glitch" data-text="RECOVER">RECOVER</div>
                            <p className="hero-sub">ACCESS RESTORATION</p>
                            <div className="hero-decoration">
                                <div className="circle-anim"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL: FORMS */}
                <div className="auth-panel right-panel">
                    <div className="form-container">

                        {/* STEP 1: EMAIL REQUEST */}
                        {step === 'request' && (
                            <form className="animate-fade-in" onSubmit={handleRequestReset}>
                                <div className="form-header">
                                    <h3>FORGOT PASSWORD?</h3>
                                    <p>Enter your email to receive a reset link.</p>
                                </div>

                                <div className="input-field">
                                    <FaEnvelope className="input-icon" />
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email Address"
                                        required
                                    />
                                    <div className="input-highlight"></div>
                                </div>

                                <button type="submit" className="cyber-btn primary" disabled={isLoading}>
                                    {isLoading ? 'TRANSMITTING...' : 'SEND RESET LINK'}
                                </button>

                                <div className="auth-footer">
                                    <Link to="/auth" className="back-link">
                                        <FaArrowLeft /> Back to Login
                                    </Link>
                                </div>
                            </form>
                        )}

                        {/* STEP 2: EMAIL SENT CONFIRMATION */}
                        {step === 'sent' && (
                            <div className="animate-fade-in">
                                <div className="form-header">
                                    <h3>CHECK YOUR EMAIL</h3>
                                    <p>We've sent a password reset link to your email address.</p>
                                </div>

                                <div className="info-box">
                                    <FaShieldAlt className="info-icon" />
                                    <div>
                                        <p><strong>Didn't receive the email?</strong></p>
                                        <ul>
                                            <li>Check your spam folder</li>
                                            <li>Verify you entered the correct email</li>
                                            <li>Wait a few minutes and try again</li>
                                        </ul>
                                    </div>
                                </div>

                                <button
                                    className="cyber-btn secondary"
                                    onClick={() => setStep('request')}
                                >
                                    Try Another Email
                                </button>

                                <div className="auth-footer">
                                    <Link to="/auth" className="back-link">
                                        <FaArrowLeft /> Back to Login
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: RESET PASSWORD FORM */}
                        {step === 'reset' && (
                            <form className="animate-fade-in" onSubmit={handleResetPassword}>
                                <div className="form-header">
                                    <h3>RESET PASSWORD</h3>
                                    <p>Enter your new password below.</p>
                                </div>

                                <div className="input-field password-field">
                                    <FaLock className="input-icon" />
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        onFocus={() => setShowPasswordReqs(true)}
                                        placeholder="New Password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                    <div className="input-highlight"></div>
                                </div>

                                {/* Password Strength Indicator */}
                                {newPassword && (
                                    <div className="password-strength-bar">
                                        <div
                                            className={`strength-fill ${strengthInfo.class}`}
                                            style={{ width: `${(passwordStrength / 4) * 100}%` }}
                                        ></div>
                                        <span className="strength-label" style={{ color: strengthInfo.color }}>
                                            {strengthInfo.label}
                                        </span>
                                    </div>
                                )}

                                <div className="input-field password-field">
                                    <FaLock className="input-icon" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm New Password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                    <div className="input-highlight"></div>
                                </div>

                                {/* Password Requirements */}
                                {showPasswordReqs && (
                                    <div className="password-requirements">
                                        <p className="req-title">Password must contain:</p>
                                        <ul>
                                            <li className={newPassword.length >= 12 ? 'met' : ''}>
                                                At least 12 characters
                                            </li>
                                            <li className={/[A-Z]/.test(newPassword) ? 'met' : ''}>
                                                One uppercase letter
                                            </li>
                                            <li className={/[a-z]/.test(newPassword) ? 'met' : ''}>
                                                One lowercase letter
                                            </li>
                                            <li className={/[0-9]/.test(newPassword) ? 'met' : ''}>
                                                One number
                                            </li>
                                            <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) ? 'met' : ''}>
                                                One special character
                                            </li>
                                        </ul>
                                    </div>
                                )}

                                <button type="submit" className="cyber-btn primary" disabled={isLoading}>
                                    {isLoading ? 'RESETTING...' : 'RESET PASSWORD'}
                                </button>

                                <div className="auth-footer">
                                    <Link to="/auth" className="back-link">
                                        <FaArrowLeft /> Back to Login
                                    </Link>
                                </div>
                            </form>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
