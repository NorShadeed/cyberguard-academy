const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: 'default-avatar.png' },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },

    // --- PERSONAL INFO (for certificates) ---
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },

    // --- PASSWORD RESET FIELDS ---
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    resetPasswordIP: { type: String },
    resetPasswordUserAgent: { type: String },
    passwordChangedAt: { type: Date },

    // --- ARENA SYSTEM (Clash Royale style) ---
    // Arena 1: Bronze Network (0 XP)
    // Arena 2: Silver Firewall (1000 XP)
    // Arena 3: Gold Encryption (3000 XP)
    // Arena 4: Platinum Protocol (6000 XP)
    // Arena 5: Diamond Core (10000 XP)
    // Arena 6: Quantum Guardian (15000 XP)
    // Arena 7: Cyber Legend (25000 XP)
    arena: { type: Number, default: 1, min: 1, max: 7 },

    // --- PROGRESSION FIELDS ---
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    completedScenarios: [{
        scenarioId: String,
        score: Number,
        completedAt: { type: Date, default: Date.now }
    }],
    achievements: [{
        id: String,
        name: String,
        unlockedAt: { type: Date, default: Date.now }
    }],

    // --- COMBAT EFFICIENCY STATS ---
    stats: {
        totalQuestionsAnswered: { type: Number, default: 0 },
        correctQuestionsAnswered: { type: Number, default: 0 },
        incidentsResolved: { type: Number, default: 0 }
    },

    // --- CERTIFICATION SYSTEM ---
    certificationStatus: {
        phase1: { type: Boolean, default: false },
        phase2: { type: Boolean, default: false },
        phase3: { type: Boolean, default: false },
        isCertified: { type: Boolean, default: false },
        certifiedAt: Date
    },

    // --- CERTIFICATES EARNED ---
    certificates: [{
        certId: { type: String, required: true },      // Unique 32-char ID
        title: { type: String, required: true },       // e.g., "CyberGuard Security Professional"
        firstName: String,                              // Snapshot at time of issue
        lastName: String,
        earnedAt: { type: Date, default: Date.now },
        issuerSig: { type: String, default: 'CyberGuard Academy' },
        phaseCompleted: Number,                         // Which training phase this cert is for
        type: { type: String, enum: ['training', 'scenario', 'special'], default: 'training' }
    }],

    // --- SECURITY: ADMIN ROLE ---
    isAdmin: { type: Boolean, default: false },

    // --- SECURITY: ACCOUNT STATUS ---
    isBanned: { type: Boolean, default: false },

    // --- ACTIVITY TRACKING ---
    lastLogin: { type: Date, default: Date.now },
    loginStreak: { type: Number, default: 1 }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Password hashing pre-save hook
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', UserSchema);
