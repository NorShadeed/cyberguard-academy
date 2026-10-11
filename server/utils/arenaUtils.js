/**
 * Arena System Configuration & Utilities
 * Clash Royale-style progression system
 */

const ARENA_CONFIG = [
    { arena: 1, name: 'Bronze Network', minXP: 0, color: '#CD7F32', icon: '🛡️' },
    { arena: 2, name: 'Silver Firewall', minXP: 2000, color: '#C0C0C0', icon: '🔥' },
    { arena: 3, name: 'Gold Encryption', minXP: 6000, color: '#FFD700', icon: '🔐' },
    { arena: 4, name: 'Platinum Protocol', minXP: 12000, color: '#E5E4E2', icon: '⚡' },
    { arena: 5, name: 'Diamond Core', minXP: 20000, color: '#B9F2FF', icon: '💎' },
    { arena: 6, name: 'Quantum Guardian', minXP: 30000, color: '#9A00FF', icon: '🌌' },
    { arena: 7, name: 'Cyber Legend', minXP: 50000, color: '#FF0080', icon: '👑' }
];

/**
 * Calculate arena tier based on XP
 * @param {number} xp - User's total XP
 * @returns {number} Arena tier (1-7)
 */
function calculateArena(xp) {
    let arena = 1;
    for (const config of ARENA_CONFIG) {
        if (xp >= config.minXP) {
            arena = config.arena;
        }
    }
    return arena;
}

/**
 * Get arena info by tier number
 * @param {number} arenaNum - Arena number (1-7)
 * @returns {Object} Arena configuration
 */
function getArenaInfo(arenaNum) {
    return ARENA_CONFIG.find(a => a.arena === arenaNum) || ARENA_CONFIG[0];
}

/**
 * Get XP needed for next arena
 * @param {number} currentXP - User's current XP
 * @param {number} currentArena - User's current arena
 * @returns {Object} { xpNeeded, nextArena, isMaxArena }
 */
function getNextArenaProgress(currentXP, currentArena) {
    if (currentArena >= 7) {
        return { xpNeeded: 0, nextArena: null, isMaxArena: true };
    }

    const nextArenaConfig = ARENA_CONFIG.find(a => a.arena === currentArena + 1);
    return {
        xpNeeded: nextArenaConfig.minXP - currentXP,
        nextArena: nextArenaConfig,
        isMaxArena: false
    };
}

/**
 * Generate unique certificate ID
 * Format: CG-XXXXXXXX-XXXXXXXX-XXXX (24 chars after prefix)
 * @returns {string} Unique certificate ID
 */
function generateCertId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = [8, 8, 4];
    const parts = segments.map(len => {
        let result = '';
        for (let i = 0; i < len; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    });
    return `CG-${parts.join('-')}`;
}

/**
 * Get all arena configurations
 * @returns {Array} All arena configs
 */
function getAllArenas() {
    return ARENA_CONFIG;
}

module.exports = {
    ARENA_CONFIG,
    calculateArena,
    getArenaInfo,
    getNextArenaProgress,
    generateCertId,
    getAllArenas
};
