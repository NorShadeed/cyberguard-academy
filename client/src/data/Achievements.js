export const ACHIEVEMENT_CATEGORIES = {
    TRAINING: 'TRAINING',
    SCENARIOS: 'SCENARIOS',
    ARENA: 'ARENA',
    SPECIAL: 'SPECIAL'
};

export const ACHIEVEMENT_RARITY = {
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare',
    EPIC: 'epic',
    LEGENDARY: 'legendary'
};

/**
 * CLIENT SIDE REGISTRY
 * Used for Visuals (Icons, Titles) only.
 * Logic is handled by Server ProgressionEngine.
 */
export const ACHIEVEMENTS = [
    // --- 1. FIRST BLOOD ---
    {
        id: 'first_blood_training',
        name: 'Bootcamp Graduate',
        description: 'Complete your first Training Module Phase',
        category: ACHIEVEMENT_CATEGORIES.TRAINING,
        rarity: ACHIEVEMENT_RARITY.COMMON,
        iconName: 'FaUserGraduate',
        xpReward: 250
    },
    {
        id: 'first_blood_ttx',
        name: 'Field Operative',
        description: 'Complete your first Table Top Exercise (Scenario)',
        category: ACHIEVEMENT_CATEGORIES.SCENARIOS,
        rarity: ACHIEVEMENT_RARITY.UNCOMMON,
        iconName: 'FaChessKnight',
        xpReward: 500
    },

    // --- 2. COURSE COMPLETION ---
    {
        id: 'course_complete_awareness',
        name: 'Human Firewall',
        description: 'Complete the Cyber Awareness Fundamentals Course',
        category: ACHIEVEMENT_CATEGORIES.SPECIAL,
        rarity: ACHIEVEMENT_RARITY.LEGENDARY,
        iconName: 'FaShieldAlt',
        xpReward: 1000
    },
    {
        id: 'course_complete_password',
        name: 'Guardian of the Gate',
        description: 'Complete the Password Mastery Course',
        category: ACHIEVEMENT_CATEGORIES.SPECIAL,
        rarity: ACHIEVEMENT_RARITY.LEGENDARY,
        iconName: 'FaKey',
        xpReward: 1000
    },

    // --- 3. ARENA RANKS (Silver -> Legend) ---
    { id: 'arena_silver', name: 'Silver Firewall', description: 'Reach Arena 2', category: ACHIEVEMENT_CATEGORIES.ARENA, rarity: ACHIEVEMENT_RARITY.UNCOMMON, iconName: 'FaFire', xpReward: 200 },
    { id: 'arena_gold', name: 'Gold Encryption', description: 'Reach Arena 3', category: ACHIEVEMENT_CATEGORIES.ARENA, rarity: ACHIEVEMENT_RARITY.RARE, iconName: 'FaLock', xpReward: 500 },
    { id: 'arena_platinum', name: 'Platinum Protocol', description: 'Reach Arena 4', category: ACHIEVEMENT_CATEGORIES.ARENA, rarity: ACHIEVEMENT_RARITY.EPIC, iconName: 'FaBolt', xpReward: 1000 },
    { id: 'arena_diamond', name: 'Diamond Core', description: 'Reach Arena 5', category: ACHIEVEMENT_CATEGORIES.ARENA, rarity: ACHIEVEMENT_RARITY.EPIC, iconName: 'FaGem', xpReward: 2000 },
    { id: 'arena_quantum', name: 'Quantum Guardian', description: 'Reach Arena 6', category: ACHIEVEMENT_CATEGORIES.ARENA, rarity: ACHIEVEMENT_RARITY.LEGENDARY, iconName: 'FaAtom', xpReward: 5000 },
    { id: 'arena_legend', name: 'Cyber Legend', description: 'Reach Arena 7', category: ACHIEVEMENT_CATEGORIES.ARENA, rarity: ACHIEVEMENT_RARITY.LEGENDARY, iconName: 'FaCrown', xpReward: 10000 },

    // --- 4. LEVEL MILESTONES (10 - 100) ---
    { id: 'level_10', name: 'Level 10', description: 'Reach Level 10', category: ACHIEVEMENT_CATEGORIES.ARENA, rarity: ACHIEVEMENT_RARITY.COMMON, iconName: 'FaStar', xpReward: 1000 },
    { id: 'level_20', name: 'Level 20', description: 'Reach Level 20', category: ACHIEVEMENT_CATEGORIES.ARENA, rarity: ACHIEVEMENT_RARITY.COMMON, iconName: 'FaStar', xpReward: 2000 },
    { id: 'level_30', name: 'Level 30', description: 'Reach Level 30', category: ACHIEVEMENT_CATEGORIES.ARENA, rarity: ACHIEVEMENT_RARITY.UNCOMMON, iconName: 'FaStar', xpReward: 3000 },
    { id: 'level_40', name: 'Level 40', description: 'Reach Level 40', category: ACHIEVEMENT_CATEGORIES.ARENA, rarity: ACHIEVEMENT_RARITY.UNCOMMON, iconName: 'FaStar', xpReward: 4000 },
    { id: 'level_50', name: 'Level 50', description: 'Reach Level 50', category: ACHIEVEMENT_CATEGORIES.ARENA, rarity: ACHIEVEMENT_RARITY.RARE, iconName: 'FaStar', xpReward: 5000 },
    { id: 'level_60', name: 'Level 60', description: 'Reach Level 60', category: ACHIEVEMENT_CATEGORIES.ARENA, rarity: ACHIEVEMENT_RARITY.RARE, iconName: 'FaStar', xpReward: 6000 },
    { id: 'level_70', name: 'Level 70', description: 'Reach Level 70', category: ACHIEVEMENT_CATEGORIES.ARENA, rarity: ACHIEVEMENT_RARITY.EPIC, iconName: 'FaStar', xpReward: 7000 },
    { id: 'level_80', name: 'Level 80', description: 'Reach Level 80', category: ACHIEVEMENT_CATEGORIES.ARENA, rarity: ACHIEVEMENT_RARITY.EPIC, iconName: 'FaStar', xpReward: 8000 },
    { id: 'level_90', name: 'Level 90', description: 'Reach Level 90', category: ACHIEVEMENT_CATEGORIES.ARENA, rarity: ACHIEVEMENT_RARITY.LEGENDARY, iconName: 'FaStar', xpReward: 9000 },
    { id: 'level_100', name: 'Level 100', description: 'Reach Level 100', category: ACHIEVEMENT_CATEGORIES.ARENA, rarity: ACHIEVEMENT_RARITY.LEGENDARY, iconName: 'FaStar', xpReward: 10000 }
];
