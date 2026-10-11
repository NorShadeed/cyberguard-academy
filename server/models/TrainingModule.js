const mongoose = require('mongoose');

const TrainingModuleSchema = new mongoose.Schema({
    phaseId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    content: String, // Markdown or HTML content for the lesson
    content: String, // Intro content before the "Game" starts

    // === NEW: CARD BATTLE ENGINE SUPPORT ===
    startNode: {
        type: String,
        default: 'start'
    },
    nodes: {
        type: Map,
        of: new mongoose.Schema({
            type: { type: String, default: 'choice' }, // 'choice' or 'ending'
            text: String, // The "Problem" or "Scenario" text
            options: [{
                text: String, // The text on the card
                points: Number, // Score for this choice
                next: String, // Key of the next node
                feedback: String // Immediate system feedback (instead of Judge)
            }]
        }, { _id: false })
    },

    passingScore: {
        type: Number,
        default: 70 // Percentage
    },
    xpReward: {
        type: Number,
        default: 500
    }
});

module.exports = mongoose.model('TrainingModule', TrainingModuleSchema);
