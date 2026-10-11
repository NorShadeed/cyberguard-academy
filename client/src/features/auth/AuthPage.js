import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock, FaEnvelope, FaShieldAlt, FaArrowRight, FaArrowLeft, FaCheck, FaMagic, FaEye, FaEyeSlash } from 'react-icons/fa';
import './AuthPage.css';

import { AuthContext } from './AuthContext';
import { validatePasswordStrength, meetsPasswordPolicy, generateStrongPassword, getStrengthInfo } from '../../utils/passwordValidator';

const AVATAR_OPTIONS = [
    { id: 'sentinel', src: '/images/hero-sentinel.png', name: 'The Sentinel' },
    { id: 'strategist', src: '/images/hero-strategist.png', name: 'The Strategist' },
    { id: 'arbiter', src: '/images/hero-arbiter.png', name: 'The Arbiter' }
];

const AuthPage = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isLoginView, setIsLoginView] = useState(true);
    const [signupStep, setSignupStep] = useState(1);

    // Form States
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        avatar: 'sentinel'
    });

    // Password states
    const [showPasswordReqs, setShowPasswordReqs] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    // OTP State for 6-digit grid
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const otpRefs = useRef([]);

    const [notification, setNotification] = useState({ type: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    const { username, email, password, confirmPassword, firstName, lastName, avatar } = formData;

    // Password strength
    const passwordStrength = validatePasswordStrength(password);
    const strengthInfo = getStrengthInfo(passwordStrength);

    // Helper: Update Form
    const onChange = e => setFormData({ ...formData, [e.target.id]: e.target.value });

    // Helper: Toggle View
    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setNotification({ type: '', message: '' });
        setSignupStep(1);
        setOtp(new Array(6).fill(""));
    };

    // Helper: Notification
    const showNotify = (type, msg) => {
        setNotification({ type, message: msg });
        setIsLoading(false);
    };

    // --- OTP LOGIC ---
    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;

        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);

        // Focus next input
        if (element.value && index < 5) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                otpRefs.current[index - 1].focus();
            }
        }
    };

    // --- FLOW HANDLERS ---

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            showNotify('success', 'ACCESS GRANTED. DECRYPTING PROFILE...');
            login(res.data.token);
            setTimeout(() => navigate('/profile'), 1500);
        } catch (err) {
            showNotify('error', err.response?.data?.msg || 'Authentication Failed');
        }
    };

    const goToAvatarStep = (e) => {
        e.preventDefault();
        if (!username || !email || !password || !confirmPassword) {
            showNotify('error', 'Required fields missing.');
            return;
        }
        if (!meetsPasswordPolicy(password)) {
            showNotify('error', 'Password does not meet security requirements.');
            return;
        }
        if (password !== confirmPassword) {
            showNotify('error', 'Passwords do not match.');
            return;
        }
        setSignupStep(2);
        setNotification({ type: '', message: '' });
    };

    // Generate Strong Password
    const handleGeneratePassword = () => {
        const generated = generateStrongPassword();
        setFormData({ ...formData, password: generated, confirmPassword: generated });
        setShowPasswordReqs(true);
    };

    const handleRegister = async () => {
        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/register', {
                username, email, password, firstName, lastName, avatar
            });
            showNotify('success', 'PROTOCOL INITIALIZED. CHECK SECURE COMM CHANNEL (EMAIL).');
            setSignupStep(3);
        } catch (err) {
            showNotify('error', err.response?.data?.msg || 'Registration Failed');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const otpCode = otp.join("");
        if (otpCode.length !== 6) {
            showNotify('error', 'Please enter full 6-digit code.');
            return;
        }

        setIsLoading(true);
        try {
            const res = await axios.post('/api/auth/verify', { email, otp: otpCode });
            showNotify('success', 'IDENTITY CONFIRMED. WELCOME, GUARDIAN.');
            login(res.data.token);
            setTimeout(() => navigate('/profile'), 1500);
        } catch (err) {
            showNotify('error', err.response?.data?.msg || 'Verification Failed');
        }
    };

    return (
        <div className="auth-megacontainer">
            <div className={`auth-card ${!isLoginView ? 'show-signup-mode' : ''}`}>

                {/* NOTIFICATIONS */}
                {notification.message && (
                    <div className={`auth-notification ${notification.type}`}>
                        {notification.type === 'success' ? <FaCheck /> : <FaShieldAlt />}
                        <span>{notification.message}</span>
                    </div>
                )}

                {/* LEFT SIDE: VISUALS (For Login) / FORM (For Signup) */}
                <div className="auth-panel left-panel">
                    <div className="panel-content">
                        {isLoginView ? (
                            <div className="visual-hero">
                                <div className="hero-glitch" data-text="CYBERGUARD">CYBERGUARD</div>
                                <p className="hero-sub">ELITE SECURITY SIMULATION</p>
                                <div className="hero-decoration">
                                    <div className="circle-anim"></div>
                                </div>
                            </div>
                        ) : (
                            /* SIGNUP FORM LOGIC GOES HERE IN LEFT PANEL WHEN FLIPPED? 
                               Actually, to keep it simple with 'slide', we usually have:
                               Panel 1: Login Form
                               Panel 2: Signup Form
                               With an overlay sliding over them. 
                               
                               Let's stick to the Classic "Split" where:
                               Left: Image/Brand
                               Right: Form
                               But the User wants "Insane".
                               
                               Let's do: Static Left (Brand), Dynamic Right (Forms).
                               Much cleaner and more professional.
                            */
                            <div className="visual-hero signup-hero">
                                <div className="hero-glitch" data-text="INITIATE">INITIATE</div>
                                <p className="hero-sub">JOIN THE RANKS</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT SIDE: INTERACTIVE FORM */}
                <div className="auth-panel right-panel">
                    <div className="form-container">

                        {/* LOGIN VIEW */}
                        {isLoginView && (
                            <form className="animate-fade-in" onSubmit={handleLogin}>
                                <div className="form-header">
                                    <h3>IDENTIFY YOURSELF</h3>
                                    <p>Enter credentials to access the grid.</p>
                                </div>

                                <div className="input-field">
                                    <FaEnvelope className="input-icon" />
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={onChange}
                                        placeholder="Email Address"
                                        required
                                    />
                                    <div className="input-highlight"></div>
                                </div>

                                <div className="input-field password-field">
                                    <FaLock className="input-icon" />
                                    <input
                                        type={showLoginPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={onChange}
                                        placeholder="Password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                                    >
                                        {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                    <div className="input-highlight"></div>
                                </div>

                                <button type="submit" className="cyber-btn primary" disabled={isLoading}>
                                    {isLoading ? 'DECRYPTING...' : 'ACCESS SYSTEM'}
                                    <FaArrowRight />
                                </button>

                                <Link to="/forgot-password" className="forgot-password-link">
                                    Forgot Password?
                                </Link>

                                <div className="auth-footer">
                                    <span>New Agent?</span>
                                    <a href="#" onClick={toggleView}>Initialize Protocol</a>
                                </div>
                            </form>
                        )}

                        {/* SIGNUP VIEW */}
                        {!isLoginView && (
                            <div className="signup-flow animate-fade-in">

                                {/* STEP 1: CREDENTIALS */}
                                {signupStep === 1 && (
                                    <form onSubmit={goToAvatarStep}>
                                        <div className="form-header">
                                            <h3>CREATE PROTOCOL</h3>
                                            <p>Step 1: Establishment</p>
                                        </div>

                                        <div className="row-inputs">
                                            <div className="input-field">
                                                <input type="text" id="firstName" value={firstName} onChange={onChange} placeholder="First Name" />
                                            </div>
                                            <div className="input-field">
                                                <input type="text" id="lastName" value={lastName} onChange={onChange} placeholder="Last Name" />
                                            </div>
                                        </div>

                                        <div className="input-field">
                                            <FaUser className="input-icon" />
                                            <input type="text" id="username" value={username} onChange={onChange} placeholder="Username" required />
                                        </div>

                                        <div className="input-field">
                                            <FaEnvelope className="input-icon" />
                                            <input type="email" id="email" value={email} onChange={onChange} placeholder="Email" required />
                                        </div>

                                        <div className="input-field password-field">
                                            <FaLock className="input-icon" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                value={password}
                                                onChange={onChange}
                                                onFocus={() => setShowPasswordReqs(true)}
                                                placeholder="Password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>

                                        {/* Password Strength Indicator */}
                                        {password && (
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
                                                id="confirmPassword"
                                                value={confirmPassword}
                                                onChange={onChange}
                                                placeholder="Confirm Password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="password-toggle"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>

                                        {/* Generate Password Button */}
                                        <button
                                            type="button"
                                            className="cyber-btn secondary generate-password-btn"
                                            onClick={handleGeneratePassword}
                                            style={{ width: 'auto', marginBottom: '15px' }}
                                        >
                                            <FaMagic /> Generate Strong Password
                                        </button>

                                        {/* Password Requirements */}
                                        {showPasswordReqs && (
                                            <div className="password-requirements">
                                                <p className="req-title">Password must contain:</p>
                                                <ul>
                                                    <li className={password.length >= 12 ? 'met' : ''}>
                                                        At least 12 characters
                                                    </li>
                                                    <li className={/[A-Z]/.test(password) ? 'met' : ''}>
                                                        One uppercase letter
                                                    </li>
                                                    <li className={/[a-z]/.test(password) ? 'met' : ''}>
                                                        One lowercase letter
                                                    </li>
                                                    <li className={/[0-9]/.test(password) ? 'met' : ''}>
                                                        One number
                                                    </li>
                                                    <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'met' : ''}>
                                                        One special character
                                                    </li>
                                                </ul>
                                            </div>
                                        )}

                                        <button type="submit" className="cyber-btn primary">
                                            SELECT AVATAR
                                            <FaArrowRight />
                                        </button>

                                        <div className="auth-footer">
                                            <span>Already verified?</span>
                                            <a href="#" onClick={toggleView}>Login</a>
                                        </div>
                                    </form>
                                )}

                                {/* STEP 2: AVATAR */}
                                {signupStep === 2 && (
                                    <div className="step-container animate-slide-in">
                                        <div className="form-header">
                                            <h3>CHOOSE GUARDIAN</h3>
                                            <p>Step 2: Visual Identity</p>
                                        </div>

                                        <div className="avatar-grid-select">
                                            {AVATAR_OPTIONS.map(opt => (
                                                <div
                                                    key={opt.id}
                                                    className={`avatar-option ${avatar === opt.id ? 'active' : ''}`}
                                                    onClick={() => setFormData({ ...formData, avatar: opt.id })}
                                                >
                                                    <img src={opt.src} alt={opt.name} />
                                                    <span>{opt.name}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="btn-group">
                                            <button className="cyber-btn secondary" onClick={() => setSignupStep(1)}>
                                                <FaArrowLeft /> BACK
                                            </button>
                                            <button className="cyber-btn primary" onClick={handleRegister} disabled={isLoading}>
                                                {isLoading ? 'PROCESSING...' : 'CONFIRM IDENTITY'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* STEP 3: OTP */}
                                {signupStep === 3 && (
                                    <form onSubmit={handleVerifyOtp} className="animate-slide-in">
                                        <div className="form-header">
                                            <h3>VERIFICATION</h3>
                                            <p>Step 3: Secure Channel Check</p>
                                            <small>Sent code to {email}</small>
                                        </div>

                                        <div className="otp-grid">
                                            {otp.map((data, index) => (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    maxLength="1"
                                                    className="otp-box"
                                                    value={data}
                                                    onChange={e => handleOtpChange(e.target, index)}
                                                    onKeyDown={e => handleOtpKeyDown(e, index)}
                                                    ref={el => otpRefs.current[index] = el}
                                                />
                                            ))}
                                        </div>

                                        <button type="submit" className="cyber-btn primary full-width" disabled={isLoading}>
                                            {isLoading ? 'VERIFYING...' : 'AUTHORIZE LOGIN'}
                                        </button>
                                    </form>
                                )}

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;