const express = require('express');
const router = express.Router();
const TrainingModule = require('../models/TrainingModule');
const User = require('../models/User');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { calculateArena, generateCertId } = require('../utils/arenaUtils');

// Program name - can be extended for multiple programs in future
const PROGRAM_NAME = 'CyberGuard Employee Security Training';

// ONLY ONE certificate - issued after ALL 3 phases complete
const FULL_CERTIFICATE_TITLE = 'CyberGuard Security Professional';

// GET /api/training - Get all modules (public)
router.get('/', async (req, res) => {
    try {
        const modules = await TrainingModule.find().sort({ phaseId: 1 });
        res.json(modules);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET /api/training/phase/:phaseId - Get specific phase (with prerequisite check)
router.get('/phase/:phaseId', auth, async (req, res) => {
    try {
        const phaseId = parseInt(req.params.phaseId);
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        // SECURITY: Phase prerequisite check
        if (phaseId === 2 && !user.certificationStatus.phase1) {
            return res.status(403).json({ msg: 'Complete Phase 1 first' });
        }
        if (phaseId === 3 && !user.certificationStatus.phase2) {
            return res.status(403).json({ msg: 'Complete Phase 2 first' });
        }

        const module = await TrainingModule.findOne({ phaseId });
        if (!module) return res.status(404).json({ msg: 'Module not found' });

        res.json(module);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

const { checkProgression } = require('../utils/ProgressionEngine');

// ...

// POST /api/training/verify - Verify quiz answers OR Game Engine results
router.post('/verify', auth, async (req, res) => {
    try {
        const { phaseId, answers, score, passed } = req.body;
        const phaseIdStr = String(phaseId); // Ensure string

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('[TRAINING-VERIFY] Request received');
        console.log('├─ User ID:', req.user.id);
        console.log('├─ Phase ID:', phaseIdStr);
        console.log('├─ Score:', score);
        console.log('├─ Passed:', passed);
        console.log('└─ Timestamp:', new Date().toISOString());

        // Get user from auth token
        const user = await User.findById(req.user.id);
        if (!user) {
            console.error('[TRAINING-VERIFY] ❌ User not found:', req.user.id);
            return res.status(404).json({ msg: 'User not found' });
        }

        console.log('[TRAINING-VERIFY] ✅ User found:', user.username);

        // Logic to authorize "Unlock" based on previous phases could go here.
        // For dynamic IDs, we rely on the frontend or a robust dependency graph.
        // Current implementation trusts the user reached this endpoint via valid UI flow for now.

        // Check if already completed
        const alreadyCompleted = user.completedScenarios.some(s => s.scenarioId === phaseIdStr);
        let xpAwarded = 0;

        if (passed) {
            // Update Legacy Status for backward compatibility (if ID is 1, 2, 3)
            if (phaseIdStr === '1' || phaseIdStr.startsWith('p1')) user.certificationStatus.phase1 = true;
            if (phaseIdStr === '2' || phaseIdStr.startsWith('p2')) user.certificationStatus.phase2 = true;
            if (phaseIdStr === '3' || phaseIdStr.startsWith('p3')) user.certificationStatus.phase3 = true;

            // Save to completedScenarios (The new source of truth)
            if (!alreadyCompleted) {
                user.completedScenarios.push({
                    scenarioId: phaseIdStr,
                    score: score || 0,
                    completedAt: new Date()
                });

                // Award XP
                const module = await TrainingModule.findOne({ phaseId: phaseIdStr });
                const reward = module ? module.xpReward : 500;

                xpAwarded = reward;
                user.xp += xpAwarded;

                // Level Up Logic
                const newLevel = Math.floor(user.xp / 1000) + 1;
                if (newLevel > user.level) user.level = newLevel;

                // Arena Logic
                const newArena = calculateArena(user.xp);
                if (newArena > user.arena) user.arena = newArena;
            } else {
                // Update score if better?
                const existing = user.completedScenarios.find(s => s.scenarioId === phaseIdStr);
                if (existing && score > existing.score) {
                    existing.score = score;
                    existing.completedAt = new Date(); // Update date?
                }
            }

            // RUN PROGRESSION ENGINE
            // This checks strictly against the updated user state object *before* save (mostly)
            // But achievements might push to user.achievements, needing a save.
            // The function modifies 'user' in place.
            const { newAchievements, newCertificates } = checkProgression(user);

            user.markModified('certificationStatus');
            user.markModified('achievements'); // Ensure triggered
            user.markModified('certificates');

            await user.save();
            console.log(`[VERIFY] ✅ Saved progress for User ${user.username}: Phase ${phaseIdStr} complete.`);
            console.log('[VERIFY] Updated State:');
            console.log('├─ XP:', user.xp);
            console.log('├─ Level:', user.level);
            console.log('├─ Arena:', user.arena);
            console.log('├─ Completed Scenarios:', user.completedScenarios.length);
            console.log('├─ New Achievements:', newAchievements.length);
            console.log('└─ New Certificates:', newCertificates.length);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

            // Append unlocks to response
            return res.json({
                passed,
                score,
                xpAwarded,
                xp: user.xp,
                level: user.level,
                arena: user.arena,
                certificationStatus: user.certificationStatus,
                completedScenarios: user.completedScenarios,
                isReplay: alreadyCompleted,
                newAchievements,
                newCertificates
            });
        }

        return res.json({
            passed: false,
            msg: 'Did not pass'
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// POST /api/training - Create new module (Admin Only)
router.post('/', auth, admin, async (req, res) => {
    try {
        const newModule = new TrainingModule(req.body);
        const module = await newModule.save();
        res.json(module);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE /api/training/:id - Delete module (Admin Only)
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        await TrainingModule.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Module deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
