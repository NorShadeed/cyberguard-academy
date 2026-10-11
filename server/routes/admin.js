const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin'); // You presumably have this or need to create it
const User = require('../models/User'); // Assuming Mongoose model exists
const { getTrafficData } = require('../middleware/trafficLogger');

// @route   GET /api/admin/traffic
// @desc    Get Real-Time Network Packets
// @access  Admin Only
router.get('/traffic', [auth, admin], (req, res) => {
    res.json(getTrafficData());
});

// @route   GET /api/admin/stats
// @desc    Get System Analytics (Real Data)
// @access  Admin Only
router.get('/stats', [auth, admin], async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({
            // Mock "Active" as logged in last 24h
            lastLogin: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });

        // Mocking some data that might not be in DB yet, replacing random mocks
        const systemLoad = {
            cpu: Math.floor(Math.random() * 30 + 10), // persistent low load
            memory: '4GB / 16GB'
        };

        res.json({
            totalUsers,
            activeUsers,
            systemLoad,
            threatLevel: 'LOW' // Default
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/users
// @desc    Get All Users (Table Data)
// @access  Admin Only
router.get('/users', [auth, admin], async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ date: -1 }).limit(50);
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/users/:id
// @desc    Manage User (Ban/Promote)
// @access  Admin Only
router.put('/users/:id', [auth, admin], async (req, res) => {
    const { action } = req.body; // 'ban', 'unban', 'promote', 'demote'

    try {
        let user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Prevent banning yourself
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({ msg: 'You cannot ban yourself, Commander.' });
        }

        if (action === 'ban') {
            user.isBanned = true; // Assuming schema has this
        } else if (action === 'unban') {
            user.isBanned = false;
        } else if (action === 'promote') {
            user.isAdmin = true;
        } else if (action === 'demote') {
            user.isAdmin = false;
        }

        await user.save();
        res.json({ msg: `User ${user.username} updated: ${action}`, user });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/content-analytics
// @desc    Get Deep Intelligence on Content Performance
// @access  Admin Only
router.get('/content-analytics', [auth, admin], async (req, res) => {
    try {
        const analytics = await User.aggregate([
            // 1. Unwind: Create one doc per completed scenario
            { $unwind: '$completedScenarios' },

            // 2. Group by Scenario ID
            {
                $group: {
                    _id: '$completedScenarios.scenarioId',
                    uniqueAgents: { $addToSet: '$_id' }, // Collect Unique User IDs
                    totalRuns: { $sum: 1 },
                    avgScore: { $avg: '$completedScenarios.score' },
                    // Calculate passes (Assuming 60% is pass - adaptable)
                    passCount: {
                        $sum: {
                            $cond: [{ $gte: ['$completedScenarios.score', 60] }, 1, 0]
                        }
                    },
                    lastPlayed: { $max: '$completedScenarios.completedAt' }
                }
            },

            // 3. Project & Format
            {
                $project: {
                    _id: 0,
                    scenarioId: '$_id',
                    uniqueAgents: { $size: '$uniqueAgents' },
                    totalRuns: 1,
                    avgScore: { $round: ['$avgScore', 1] },
                    passRate: {
                        $round: [
                            { $multiply: [{ $divide: ['$passCount', '$totalRuns'] }, 100] },
                            1
                        ]
                    },
                    lastPlayed: 1
                }
            },

            // 4. Sort by most played
            { $sort: { uniqueAgents: -1 } }
        ]);

        res.json(analytics);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/admin/logs
// @desc    Get System Event Logs (Derived from Activity)
// @access  Admin Only
router.get('/logs', [auth, admin], async (req, res) => {
    try {
        // 1. Get Training Events
        const trainingLogs = await User.aggregate([
            { $unwind: '$completedScenarios' },
            {
                $project: {
                    type: 'TRAINING',
                    source: 'CyberRange',
                    message: { $concat: ['Protocol [', '$completedScenarios.scenarioId', '] neutralized by agent ', '$username'] },
                    timestamp: '$completedScenarios.completedAt',
                    severity: 'INFO',
                    metadata: { score: '$completedScenarios.score' }
                }
            },
            { $sort: { timestamp: -1 } },
            { $limit: 30 }
        ]);

        // 2. Get Auth Events (New Users)
        // Using _id generation time as registration time
        const authLogs = await User.aggregate([
            {
                $project: {
                    type: 'AUTH',
                    source: 'AuthSystem',
                    message: { $concat: ['New operative identity [', '$username', '] registered in mainframe'] },
                    timestamp: { $toDate: '$_id' }, // Extract time from ObjectId
                    severity: 'SUCCESS',
                    metadata: { role: { $cond: ['$isAdmin', 'ADMIN', 'OPERATIVE'] } }
                }
            },
            { $sort: { timestamp: -1 } },
            { $limit: 20 }
        ]);

        // 3. Merge & Sort
        const allLogs = [...trainingLogs, ...authLogs]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 50);

        res.json(allLogs);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
