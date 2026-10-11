/**
 * Arena System Configuration - Frontend
 * Clash Royale-style progression system
 */

export const ARENA_CONFIG = [
    {
        arena: 1,
        name: 'Bronze Network',
        minXP: 0,
        color: '#CD7F32',
        glowColor: 'rgba(205, 127, 50, 0.5)',
        icon: '🛡️',
        description: 'Welcome to the network. Your journey begins here.',
        gradient: 'linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)'
    },
    {
        arena: 2,
        name: 'Silver Firewall',
        minXP: 2000,
        color: '#C0C0C0',
        glowColor: 'rgba(192, 192, 192, 0.5)',
        icon: '🔥',
        description: 'You\'ve breached the first layer of defense.',
        gradient: 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)'
    },
    {
        arena: 3,
        name: 'Gold Encryption',
        minXP: 6000,
        color: '#FFD700',
        glowColor: 'rgba(255, 215, 0, 0.5)',
        icon: '🔐',
        description: 'Your skills are gaining recognition.',
        gradient: 'linear-gradient(135deg, #FFD700 0%, #B8860B 100%)'
    },
    {
        arena: 4,
        name: 'Platinum Protocol',
        minXP: 12000,
        color: '#E5E4E2',
        glowColor: 'rgba(229, 228, 226, 0.5)',
        icon: '⚡',
        description: 'Elite defender status achieved.',
        gradient: 'linear-gradient(135deg, #E5E4E2 0%, #9A9A9A 100%)'
    },
    {
        arena: 5,
        name: 'Diamond Core',
        minXP: 20000,
        color: '#B9F2FF',
        glowColor: 'rgba(185, 242, 255, 0.5)',
        icon: '💎',
        description: 'Access to classified scenarios unlocked.',
        gradient: 'linear-gradient(135deg, #B9F2FF 0%, #00CED1 100%)'
    },
    {
        arena: 6,
        name: 'Quantum Guardian',
        minXP: 30000,
        color: '#9A00FF',
        glowColor: 'rgba(154, 0, 255, 0.5)',
        icon: '🌌',
        description: 'Operating at quantum level security.',
        gradient: 'linear-gradient(135deg, #9A00FF 0%, #5B00A0 100%)'
    },
    {
        arena: 7,
        name: 'Cyber Legend',
        minXP: 50000,
        color: '#FF0080',
        glowColor: 'rgba(255, 0, 128, 0.5)',
        icon: '👑',
        description: 'Maximum clearance. You are the legend.',
        gradient: 'linear-gradient(135deg, #FF0080 0%, #FF00FF 50%, #00FFFF 100%)'
    }
];

/**
 * Get arena config by arena number
 */
export const getArenaInfo = (arenaNum) => {
    return ARENA_CONFIG.find(a => a.arena === arenaNum) || ARENA_CONFIG[0];
};

/**
 * Calculate arena from XP
 */
export const calculateArena = (xp) => {
    let arena = 1;
    for (const config of ARENA_CONFIG) {
        if (xp >= config.minXP) {
            arena = config.arena;
        }
    }
    return arena;
};

/**
 * Get progress to next arena
 */
export const getArenaProgress = (xp, currentArena) => {
    if (currentArena >= 7) {
        return { progress: 100, xpNeeded: 0, nextArena: null };
    }

    const current = ARENA_CONFIG.find(a => a.arena === currentArena);
    const next = ARENA_CONFIG.find(a => a.arena === currentArena + 1);

    const xpInCurrentArena = xp - current.minXP;
    const xpNeededForNext = next.minXP - current.minXP;
    const progress = Math.max(0, Math.min((xpInCurrentArena / xpNeededForNext) * 100, 100));

    return {
        progress,
        xpNeeded: next.minXP - xp,
        nextArena: next
    };
};

export default ARENA_CONFIG;
