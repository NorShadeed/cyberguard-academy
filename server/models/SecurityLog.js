const mongoose = require('mongoose');

const SecurityLogSchema = new mongoose.Schema({
    eventType: {
        type: String,
        required: true,
        enum: ['LOGIN_SUCCESS', 'LOGIN_FAILURE', 'REGISTER_SUCCESS', 'REGISTER_FAILURE', 'PASSWORD_RESET', 'ADMIN_ACTION', 'SUSPICIOUS_ACTIVITY', 'SYSTEM_ERROR']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    ipAddress: {
        type: String,
        default: 'Unknown'
    },
    userAgent: {
        type: String,
        default: 'Unknown'
    },
    details: {
        type: String,
        default: ''
    },
    metadata: {
        type: Object,
        default: {}
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'low'
    }
}, {
    timestamps: true
});

// Index for fast querying by date and event type
SecurityLogSchema.index({ createdAt: -1 });
SecurityLogSchema.index({ eventType: 1 });
SecurityLogSchema.index({ ipAddress: 1 });

module.exports = mongoose.model('SecurityLog', SecurityLogSchema);
