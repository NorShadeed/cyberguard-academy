const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const rateLimit = require('../middleware/rateLimit');
const { logSecurityEvent } = require('../utils/securityLogger');

// Rate limiters. Development keeps a higher ceiling for local exercises.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' ? 10 : 1000,
    message: 'Too many login attempts, please try again after 15 minutes.'
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: 'Too many registration attempts, please try again after 1 hour.'
});

const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3,
    message: 'Too many password reset attempts, please try again after 15 minutes.'
});

// --- NODEMAILER SETUP ---
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});

// Helper: Strong Password Validation
const validateStrongPassword = (password) => {
    if (password.length < 12) {
        return { valid: false, msg: 'Password must be at least 12 characters' };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, msg: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, msg: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, msg: 'Password must contain at least one number' };
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return { valid: false, msg: 'Password must contain at least one special character' };
    }
    return { valid: true };
};

// Health check endpoint
router.get('/test', (req, res) => {
    res.json({ msg: 'Auth service is running!' });
});

// === 1. SIGN-UP STEP 1: REGISTER & SEND OTP ===
router.post('/register', registerLimiter, async (req, res) => {
    const { username, email, password, firstName, lastName, avatar } = req.body;

    // Input validation
    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    // Strong password validation
    const passwordCheck = validateStrongPassword(password);
    if (!passwordCheck.valid) {
        // Log weak password attempt (could be a bot list)
        logSecurityEvent('REGISTER_FAILURE', req, `Weak password attempt for ${email}`, { severity: 'low' });
        return res.status(400).json({ msg: passwordCheck.msg });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ msg: 'Invalid email format' });
    }
    // Username validation (alphanumeric, 3-20 chars)
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).json({ msg: 'Username must be 3-20 alphanumeric characters' });
    }

    try {
        // Check if user already exists
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            logSecurityEvent('REGISTER_FAILURE', req, `Duplicate registration attempted for ${email} or ${username}`, { severity: 'low' });
            return res.status(400).json({ msg: 'User with this email or username already exists' });
        }

        // Create new user with optional fields
        user = new User({
            username,
            email,
            password,
            firstName: firstName || '',
            lastName: lastName || '',
            avatar: avatar || 'sentinel'
        });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;

        await user.save();

        // Send OTP email
        await transporter.sendMail({
            from: `"CyberGuard Protocol" <${process.env.MAIL_USERNAME}>`,
            to: user.email,
            subject: 'Your Verification Code',
            text: `Your CyberGuard verification code is: ${otp}`,
            html: `<b>Your CyberGuard verification code is: ${otp}</b><p>This code will expire in 10 minutes.</p>`,
        });

        logSecurityEvent('REGISTER_SUCCESS', req, `New user registered: ${username} (${email})`, { userId: user.id });
        res.status(201).json({ msg: 'Registration successful. Please check your email for OTP.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// === 2. VERIFY OTP ===
router.post('/verify', authLimiter, async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ msg: 'Email and OTP are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'User not found.' });
        }
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            logSecurityEvent('LOGIN_FAILURE', req, `Invalid OTP for ${email}`, { severity: 'medium' });
            return res.status(400).json({ msg: 'OTP is invalid or has expired.' });
        }

        // Verification successful
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Create JWT
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });

        logSecurityEvent('LOGIN_SUCCESS', req, `Account verified and logged in: ${user.username}`, { userId: user.id });
        res.json({ token, msg: 'Account verified successfully. You are now logged in.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Helper to update streak
const updateStreak = async (user) => {
    const now = new Date();
    const lastLogin = user.lastLogin ? new Date(user.lastLogin) : new Date(0);

    // Reset hours to compare dates only
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastDate = new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate());

    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        // Consecutive day
        user.loginStreak = (user.loginStreak || 0) + 1;
    } else if (diffDays > 1) {
        // Broken streak
        user.loginStreak = 1;
    }
    // If diffDays === 0 (same day), do nothing

    user.lastLogin = now;
    await user.save();
};

// === 3. LOGIN ===
router.post('/login', authLimiter, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            // Generic message to prevent user enumeration
            logSecurityEvent('LOGIN_FAILURE', req, `Login attempt for non-existent user: ${email}`, { severity: 'medium' });
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logSecurityEvent('LOGIN_FAILURE', req, `Wrong password for user: ${email}`, { userId: user.id, severity: 'medium' });
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            logSecurityEvent('LOGIN_FAILURE', req, `Unverified login attempt: ${email}`, { userId: user.id });
            return res.status(400).json({ msg: 'Account not verified. Please check your email for OTP.' });
        }

        // Update Streak
        await updateStreak(user);

        // Create JWT
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' });

        logSecurityEvent('LOGIN_SUCCESS', req, `Successful login: ${user.username}`, { userId: user.id });
        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// === 4. FORGOT PASSWORD - REQUEST RESET ===
router.post('/forgot-password', passwordResetLimiter, async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ msg: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });

        // Always return success to prevent email enumeration
        if (!user) {
            logSecurityEvent('PASSWORD_RESET', req, `Reset requested for unknown email: ${email}`, { severity: 'low' });
            return res.json({ msg: 'If your email exists in our system, you will receive a password reset link.' });
        }

        // Generate secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token before saving to database
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Save hashed token and metadata
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        user.resetPasswordIP = req.ip;
        user.resetPasswordUserAgent = req.headers['user-agent'];

        await user.save();

        // Create reset URL with unhashed token
        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

        // Send email with reset link
        await transporter.sendMail({
            from: `"CyberGuard Security" <${process.env.MAIL_USERNAME}>`,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <h2>Password Reset Request</h2>
                <p>You requested a password reset for your CyberGuard account.</p>
                <p>Click the link below to reset your password:</p>
                <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#00d4ff;color:#000;text-decoration:none;border-radius:5px;font-weight:bold;">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <p><small>For security, this request came from IP: ${req.ip}</small></p>
            `
        });

        logSecurityEvent('PASSWORD_RESET', req, `Password reset email sent to: ${email}`, { userId: user.id });
        res.json({ msg: 'If your email exists in our system, you will receive a password reset link.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// === 5. RESET PASSWORD ===
router.post('/reset-password/:token', async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    if (!password) {
        return res.status(400).json({ msg: 'Password is required' });
    }

    // Validate strong password
    const passwordCheck = validateStrongPassword(password);
    if (!passwordCheck.valid) {
        return res.status(400).json({ msg: passwordCheck.msg });
    }

    try {
        // Hash the token from URL to compare with database
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            logSecurityEvent('PASSWORD_RESET', req, `Invalid/Expired token used from IP`, { severity: 'medium' });
            return res.status(400).json({ msg: 'Invalid or expired reset token' });
        }

        // Update password (will be hashed by pre-save hook)
        user.password = password;
        user.passwordChangedAt = Date.now();

        // Invalidate reset token
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.resetPasswordIP = undefined;
        user.resetPasswordUserAgent = undefined;

        await user.save();

        // Send confirmation email
        await transporter.sendMail({
            from: `"CyberGuard Security" <${process.env.MAIL_USERNAME}>`,
            to: user.email,
            subject: 'Password Successfully Reset',
            html: `
                <h2>Password Reset Successful</h2>
                <p>Your CyberGuard password has been successfully reset.</p>
                <p>If you didn't make this change, please contact support immediately.</p>
                <p><small>Reset completed at: ${new Date().toLocaleString()}</small></p>
            `
        });

        logSecurityEvent('PASSWORD_RESET', req, `Password reset successful for user: ${user.username}`, { userId: user.id, severity: 'high' });
        res.json({ msg: 'Password reset successful. You can now login with your new password.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
