const express = require('express');
const router = express.Router();
const Scenario = require('../models/Scenario');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { calculateArena, getArenaInfo } = require('../utils/arenaUtils');

// GET /api/scenarios - Get all scenarios (public but include arena info)
router.get('/', async (req, res) => {
    try {
        const scenarios = await Scenario.find().select('-roles');
        res.json(scenarios);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET /api/scenarios/:id - Get specific scenario details (with arena check)
router.get('/:id', auth, async (req, res) => {
    try {
        const scenario = await Scenario.findOne({ id: req.params.id });
        if (!scenario) {
            return res.status(404).json({ msg: 'Scenario not found' });
        }

        // Check arena requirement
        const user = await User.findById(req.user.id).select('arena xp');
        if (!user) {
            return res.status(401).json({ msg: 'User not found' });
        }

        // Ensure arena is up-to-date
        const currentArena = calculateArena(user.xp);

        if (scenario.requiredArena > currentArena) {
            const requiredArenaInfo = getArenaInfo(scenario.requiredArena);
            return res.status(403).json({
                msg: `This scenario requires Arena ${scenario.requiredArena}: ${requiredArenaInfo.name}`,
                requiredArena: scenario.requiredArena,
                currentArena: currentArena,
                locked: true
            });
        }

        res.json(scenario);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const { checkProgression } = require('../utils/ProgressionEngine');
// ...

// Fallback for client-side scenarios not yet seeded in DB
const FALLBACK_SCENARIOS = {
    'sc_phishing_gauntlet': {
        id: 'sc_phishing_gauntlet',
        xp: 800,
        requiredArena: 0,
        difficulty: 'Medium'
    }
};

// POST /api/scenarios/complete - Handle scenario completion (Authenticated)
// SECURITY FIX: Uses token for userId, NOT body (prevents IDOR)
router.post('/complete', auth, async (req, res) => {
    const userId = req.user.id; // SECURE: From token, NOT body
    const { scenarioId, score, questionsCount, correctCount } = req.body;

    // Input validation
    if (!scenarioId) {
        return res.status(400).json({ msg: 'scenarioId is required' });
    }
    if (score !== undefined && (typeof score !== 'number' || score < 0 || score > 5000)) {
        return res.status(400).json({ msg: 'Invalid score value (0-5000 allowed)' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // --- UPDATE COMBAT STATS (ALWAYS) ---
        // This runs even if scenario is already completed (Retries count!)
        if (questionsCount && typeof questionsCount === 'number') {
            user.stats = user.stats || {}; // Ensure object exists
            user.stats.totalQuestionsAnswered = (user.stats.totalQuestionsAnswered || 0) + questionsCount;
            user.stats.correctQuestionsAnswered = (user.stats.correctQuestionsAnswered || 0) + (correctCount || 0);

            // "Incidents Resolved" creates a cooler metric for correct answers
            user.stats.incidentsResolved = user.stats.correctQuestionsAnswered;
        }

        let scenario = await Scenario.findOne({ id: scenarioId });

        // FALLBACK: If not in DB, check hardcoded list
        if (!scenario && FALLBACK_SCENARIOS[scenarioId]) {
            console.log(`[SCENARIO] Using Fallback for: ${scenarioId}`);
            scenario = FALLBACK_SCENARIOS[scenarioId];
        }

        if (!scenario) {
            console.log(`[SCENARIO] Warning: Scenario ${scenarioId} not found in DB or Fallback. Allowing completion as 'Unregistered Scenario'.`);
            // Create a temporary object so we can still save progress
            scenario = {
                id: scenarioId,
                xp: 1000, // Default generous XP for new scenarios
                requiredArena: 0, // No requirement
                difficulty: 'Unknown'
            };
        }

        // Check arena requirement (Safe check)
        if ((scenario.requiredArena || 0) > user.arena) {
            return res.status(403).json({
                msg: `Cannot complete: requires Arena ${scenario.requiredArena}`
            });
        }

        // Check if already completed
        const alreadyCompleted = user.completedScenarios.some(s => s.scenarioId === scenarioId);

        if (!alreadyCompleted) {
            user.completedScenarios.push({ scenarioId, score: score || 0 });
            user.xp += scenario.xp || 0;

            // Update level
            const newLevel = Math.floor(user.xp / 1000) + 1;
            if (newLevel > user.level) {
                user.level = newLevel;
            }

            // Update arena
            const newArena = calculateArena(user.xp);
            if (newArena > user.arena) {
                user.arena = newArena;
                console.log(`[ARENA] ${user.username} promoted to Arena ${newArena}!`);
            }
        }

        // RUN PROGRESSION ENGINE
        const { newAchievements, newCertificates } = checkProgression(user);

        user.markModified('achievements');
        user.markModified('certificates');

        await user.save();

        res.json({
            msg: 'Scenario completed',
            xp: user.xp,
            level: user.level,
            arena: user.arena,
            newAchievements,
            newCertificates
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST /api/scenarios - Create new scenario (Admin Only)
router.post('/', auth, admin, async (req, res) => {
    try {
        const newScenario = new Scenario(req.body);
        const scenario = await newScenario.save();
        res.json(scenario);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE /api/scenarios/:id - Delete scenario (Admin Only)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        await Scenario.findOneAndDelete({ id: req.params.id });
        res.json({ msg: 'Scenario deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
