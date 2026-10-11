/**
 * CENTRALIZED PROGRESSION REGISTRY
 * 
 * Define all Achievements and Certificates here.
 * The ProgressionEngine will check these rules against the user state.
 */

const ACHIEVEMENTS = [
    // --- 1. FIRST BLOOD (First Completions) ---
    {
        id: 'first_blood_training',
        title: 'Bootcamp Graduate',
        description: 'Complete your first Training Module Phase',
        category: 'TRAINING',
        icon: 'FaUserGraduate',
        xpReward: 250,
        condition: { type: 'PREFIX_COUNT', prefix: 'p', value: 1 }
    },
    {
        id: 'first_blood_ttx',
        title: 'Field Operative',
        description: 'Complete your first Table Top Exercise (Scenario)',
        category: 'SCENARIOS',
        icon: 'FaChessKnight',
        xpReward: 500,
        condition: { type: 'PREFIX_COUNT', prefix: 'sc_', value: 1 }
    },

    // --- 2. COURSE COMPLETION ---
    {
        id: 'course_complete_awareness',
        title: 'Human Firewall',
        description: 'Complete the Cyber Awareness Fundamentals Course',
        category: 'SPECIAL',
        icon: 'FaShieldAlt',
        xpReward: 1000,
        condition: { type: 'SCENARIO_COMPLETE', value: 'p4_social_exam' }
    },
    {
        id: 'course_complete_password',
        title: 'Guardian of the Gate',
        description: 'Complete the Password Mastery Course',
        category: 'SPECIAL',
        icon: 'FaKey',
        xpReward: 1000,
        condition: { type: 'SCENARIO_COMPLETE', value: 'pm_p3_exam' }
    },

    // --- 3. ARENA RANKS (Silver -> Legend) ---
    // Bronze is default (1)
    { id: 'arena_silver', title: 'Silver Firewall', description: 'Reach Arena 2: Silver Firewall', category: 'ARENA', icon: 'FaFire', xpReward: 200, condition: { type: 'MIN_ARENA', value: 2 } },
    { id: 'arena_gold', title: 'Gold Encryption', description: 'Reach Arena 3: Gold Encryption', category: 'ARENA', icon: 'FaLock', xpReward: 500, condition: { type: 'MIN_ARENA', value: 3 } },
    { id: 'arena_platinum', title: 'Platinum Protocol', description: 'Reach Arena 4: Platinum Protocol', category: 'ARENA', icon: 'FaBolt', xpReward: 1000, condition: { type: 'MIN_ARENA', value: 4 } },
    { id: 'arena_diamond', title: 'Diamond Core', description: 'Reach Arena 5: Diamond Core', category: 'ARENA', icon: 'FaGem', xpReward: 2000, condition: { type: 'MIN_ARENA', value: 5 } },
    { id: 'arena_quantum', title: 'Quantum Guardian', description: 'Reach Arena 6: Quantum Guardian', category: 'ARENA', icon: 'FaAtom', xpReward: 5000, condition: { type: 'MIN_ARENA', value: 6 } },
    { id: 'arena_legend', title: 'Cyber Legend', description: 'Reach Arena 7: Cyber Legend', category: 'ARENA', icon: 'FaCrown', xpReward: 10000, condition: { type: 'MIN_ARENA', value: 7 } },

    // --- 4. LEVEL MILESTONES (10 - 100) ---
    { id: 'level_10', title: 'Level 10', description: 'Reach Experience Level 10', category: 'ARENA', icon: 'FaStar', xpReward: 1000, condition: { type: 'MIN_LEVEL', value: 10 } },
    { id: 'level_20', title: 'Level 20', description: 'Reach Experience Level 20', category: 'ARENA', icon: 'FaStar', xpReward: 2000, condition: { type: 'MIN_LEVEL', value: 20 } },
    { id: 'level_30', title: 'Level 30', description: 'Reach Experience Level 30', category: 'ARENA', icon: 'FaStar', xpReward: 3000, condition: { type: 'MIN_LEVEL', value: 30 } },
    { id: 'level_40', title: 'Level 40', description: 'Reach Experience Level 40', category: 'ARENA', icon: 'FaStar', xpReward: 4000, condition: { type: 'MIN_LEVEL', value: 40 } },
    { id: 'level_50', title: 'Level 50', description: 'Reach Experience Level 50', category: 'ARENA', icon: 'FaStar', xpReward: 5000, condition: { type: 'MIN_LEVEL', value: 50 } },
    { id: 'level_60', title: 'Level 60', description: 'Reach Experience Level 60', category: 'ARENA', icon: 'FaStar', xpReward: 6000, condition: { type: 'MIN_LEVEL', value: 60 } },
    { id: 'level_70', title: 'Level 70', description: 'Reach Experience Level 70', category: 'ARENA', icon: 'FaStar', xpReward: 7000, condition: { type: 'MIN_LEVEL', value: 70 } },
    { id: 'level_80', title: 'Level 80', description: 'Reach Experience Level 80', category: 'ARENA', icon: 'FaStar', xpReward: 8000, condition: { type: 'MIN_LEVEL', value: 80 } },
    { id: 'level_90', title: 'Level 90', description: 'Reach Experience Level 90', category: 'ARENA', icon: 'FaStar', xpReward: 9000, condition: { type: 'MIN_LEVEL', value: 90 } },
    { id: 'level_100', title: 'Level 100', description: 'Reach Experience Level 100', category: 'ARENA', icon: 'FaStar', xpReward: 10000, condition: { type: 'MIN_LEVEL', value: 100 } }
];

const CERTIFICATES = [
    {
        id: 'cyber_awareness_fundamentals',
        title: 'Cyber Awareness Fundamentals',
        description: 'Demonstrating proficiency in Policy, Social Engineering defense, and Incident Response.',
        type: 'special',
        issuer: 'CyberGuard Academy',
        condition: { type: 'SCENARIO_COMPLETE', value: 'p4_social_exam' }
    },
    {
        id: 'password_mastery_cert',
        title: 'Guardian of the Gate',
        description: 'Certified Master of Password Security, MFA, and Credential Defense.',
        type: 'special',
        issuer: 'CyberGuard Academy',
        condition: { type: 'SCENARIO_COMPLETE', value: 'pm_p3_exam' }
    },
    {
        id: 'certified_phishing_hunter',
        title: 'Certified Phishing Hunter',
        description: 'Advanced proficiency in detecting AiTM, Deepfakes, and Homograph attacks.',
        type: 'special',
        issuer: 'CyberGuard Academy',
        condition: { type: 'SCENARIO_COMPLETE', value: 'sc_phishing_gauntlet' }
    }
];

module.exports = { ACHIEVEMENTS, CERTIFICATES };
