const mongoose = require('mongoose');

const ScenarioSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    tagline: String,
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard', 'Insane'],
        default: 'Medium'
    },
    xp: {
        type: Number,
        default: 100
    },
    // Arena requirement (1-7, 1 = anyone can play)
    requiredArena: {
        type: Number,
        default: 1,
        min: 1,
        max: 7
    },
    time: String, // e.g. "30 Mins"
    thumbnail: String,
    description: String,
    learningObjectives: [String],
    totalSteps: Number,
    // The complex role/node structure
    roles: {
        type: Map,
        of: new mongoose.Schema({
            startNode: String,
            nodes: {
                type: Map,
                of: new mongoose.Schema({
                    type: String, // 'choice' or 'ending'
                    text: String,
                    success: Boolean, // for endings
                    options: [{
                        text: String,
                        points: Number,
                        next: String,
                        judge: String,
                        evidence: {
                            type: { type: String }, // e.g. 'Email', 'Log'
                            title: String,
                            content: String
                        }
                    }]
                }, { _id: false })
            }
        }, { _id: false })
    }
});

module.exports = mongoose.model('Scenario', ScenarioSchema);
