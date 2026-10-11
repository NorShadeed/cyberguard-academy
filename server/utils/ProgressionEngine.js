const { ACHIEVEMENTS, CERTIFICATES } = require('../data/progression');

// Helper to generate 10-character randomized unique IDs for certificates
// Format: Alphanumeric, uppercase (e.g., "A1B2C3D4E5")
const generateCertificateId = () => {
    // Generates a random alphanumeric string and slices 10 characters
    return Math.random().toString(36).substring(2, 12).toUpperCase();
};

/**
 * EVALUATE CONDITION
 * Checks a single condition object against the user state.
 */
const evaluateCondition = (condition, user) => {
    switch (condition.type) {
        case 'PHASE_COMPLETE':
            // Check legacy booleans
            if (user.certificationStatus) {
                if (condition.value === '1' && user.certificationStatus.phase1) return true;
                if (condition.value === '2' && user.certificationStatus.phase2) return true;
                if (condition.value === '3' && user.certificationStatus.phase3) return true;
                const legacyKey = `phase${condition.value}`;
                if (user.certificationStatus[legacyKey]) return true;
            }
            // Check completedScenarios array (New Standard)
            if (user.completedScenarios) {
                // Check if any completed scenario ID matches the condition value
                // Loose string comparison
                return user.completedScenarios.some(s => String(s.scenarioId) === String(condition.value));
            }
            return false;

        case 'SCENARIO_COMPLETE':
            if (user.completedScenarios) {
                return user.completedScenarios.some(s => String(s.scenarioId) === String(condition.value));
            }
            return false;

        case 'MIN_XP':
            return (user.xp || 0) >= condition.value;

        case 'MIN_LEVEL':
            return (user.level || 1) >= condition.value;

        case 'MIN_STREAK':
            return (user.loginStreak || 0) >= condition.value;

        case 'MIN_ARENA':
            // user.arena is usually 1-7
            return (user.arena || 1) >= condition.value;

        case 'PREFIX_COUNT':
            if (user.completedScenarios) {
                const count = user.completedScenarios.filter(s => String(s.scenarioId).startsWith(condition.prefix)).length;
                return count >= condition.value;
            }
            return false;

        case 'AND':
            // Recursive check for all requirements
            return condition.requirements.every(req => evaluateCondition(req, user));

        case 'OR':
            return condition.requirements.some(req => evaluateCondition(req, user));

        default:
            console.warn(`[ProgressionEngine] Unknown condition type: ${condition.type}`);
            return false;
    }
};

/**
 * CHECK PROGRESSION
 * Runs all rules against user.
 * Returns { newAchievements, newCertificates: [] }
 * Updates user object internally (caller must user.save())
 */
const checkProgression = (user) => {
    const newAchievements = [];
    const newCertificates = [];

    // 1. CHECK ACHIEVEMENTS
    ACHIEVEMENTS.forEach(ach => {
        // Check if already unlocked
        const alreadyHas = user.achievements && user.achievements.some(ua => ua.id === ach.id);
        if (alreadyHas) return;

        // Evaluate
        if (evaluateCondition(ach.condition, user)) {
            // Unlock!
            const newUnlock = {
                id: ach.id,
                name: ach.title, // Map title to name for DB schema match
                unlockedAt: new Date()
            };

            // Init array if needed
            if (!user.achievements) user.achievements = [];

            user.achievements.push(newUnlock);
            newAchievements.push(ach);

            // Award XP immediately?
            if (ach.xpReward) {
                user.xp = (user.xp || 0) + ach.xpReward;
                // Add note to return obj?
                console.log(`[Progression] Unlocked Achievement: ${ach.title} (+${ach.xpReward} XP)`);
            }
        }
    });

    // 2. CHECK CERTIFICATES
    CERTIFICATES.forEach(cert => {
        // Check if already has (by certId or title match)
        // Schema uses 'certId' but legacy might be tricky. 
        // We will store the RULE ID as the certId for uniqueness check unless we generate distinct ones.
        // Actually, schema says certId is 32-char ID. 
        // We should check if we have a certificate of this 'type' or title? 
        // User schema: certificates: [{ certId, title, phaseCompleted... }]

        // Let's rely on checking if we have a cert with this Title to avoid duplicates
        const alreadyHas = user.certificates && user.certificates.some(c => c.title === cert.title);
        if (alreadyHas) return;

        if (evaluateCondition(cert.condition, user)) {
            // Unlock!
            const newCert = {
                certId: generateCertificateId(), // 10-char randomized ID
                title: cert.title,
                firstName: user.firstName || user.username,
                lastName: user.lastName || '',
                earnedAt: new Date(),
                issuerSig: cert.issuer,
                type: cert.type
            };

            if (!user.certificates) user.certificates = [];
            user.certificates.push(newCert);
            newCertificates.push(newCert);
            console.log(`[Progression] Earned Certificate: ${cert.title}`);
        }
    });

    return { newAchievements, newCertificates };
};

module.exports = { checkProgression };
