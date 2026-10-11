const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { calculateArena, getArenaInfo, getNextArenaProgress, getAllArenas } = require('../utils/arenaUtils');

// Helper: Strong Password Validation (imported logic from auth.js)
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

// @route   GET /api/user/profile
// @desc    Get current user profile
// @access  Private
const { checkProgression } = require('../utils/ProgressionEngine');

// ...

// @route   GET /api/user/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Ensure arena is up-to-date with XP
        const calculatedArena = calculateArena(user.xp);
        if (user.arena !== calculatedArena) {
            user.arena = calculatedArena;
        }

        // RETROACTIVE SYNC: Check for missing achievements/certs
        // This ensures old users get their badges immediately on login/refresh
        const { newAchievements, newCertificates } = checkProgression(user);

        if (newAchievements.length > 0 || newCertificates.length > 0 || user.isModified('arena')) {
            user.markModified('achievements');
            user.markModified('certificates');
            await user.save();
            console.log(`[PROFILE SYNC] Awarded ${newAchievements.length} achievements & ${newCertificates.length} certs to ${user.username}`);
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/user/profile
// @desc    Update profile (firstName, lastName, email, avatar)
// @access  Private
router.put('/profile', auth, async (req, res) => {
    try {
        const { firstName, lastName, email, avatar } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Validate email if changing
        if (email && email !== user.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ msg: 'Invalid email format' });
            }
            // Check if email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ msg: 'Email already in use' });
            }
            user.email = email;
        }

        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (avatar !== undefined) user.avatar = avatar;

        await user.save();

        const updatedUser = await User.findById(req.user.id).select('-password');
        res.json({ msg: 'Profile updated successfully', user: updatedUser });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/user/password
// @desc    Change password
// @access  Private
router.put('/password', auth, async (req, res) => {
    try {
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ msg: 'Both current and new password are required' });
        }

        // Strong password validation (same as registration)
        const passwordCheck = validateStrongPassword(newPassword);
        if (!passwordCheck.valid) {
            return res.status(400).json({ msg: passwordCheck.msg });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Current password is incorrect' });
        }

        // Set new password (will be hashed by pre-save hook)
        user.password = newPassword;
        await user.save();

        res.json({ msg: 'Password changed successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/user/certificates
// @desc    Get all user certificates
// @access  Private
router.get('/certificates', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('certificates firstName lastName');
        if (!user) return res.status(404).json({ msg: 'User not found' });

        res.json(user.certificates || []);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/user/arena
// @desc    Get user's arena info and progress
// @access  Private
router.get('/arena', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('xp arena level');
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const currentArena = getArenaInfo(user.arena);
        const progress = getNextArenaProgress(user.xp, user.arena);
        const allArenas = getAllArenas();

        res.json({
            currentArena,
            xp: user.xp,
            level: user.level,
            progress,
            allArenas
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/user/reset-progress
// @desc    Reset all certification progress
// @access  Private
router.post('/reset-progress', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.certificationStatus = {
            phase1: false,
            phase2: false,
            phase3: false,
            isCertified: false,
            certifiedAt: null
        };

        user.markModified('certificationStatus');
        await user.save();

        res.json({ msg: 'Progress reset successfully', certificationStatus: user.certificationStatus });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

