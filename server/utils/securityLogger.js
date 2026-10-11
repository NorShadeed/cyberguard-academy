const SecurityLog = require('../models/SecurityLog');

/**
 * Logs a security event to the database.
 * @param {string} eventType - Type of event (e.g., 'LOGIN_FAILURE')
 * @param {Object} req - The Express request object (to extract IP/UserAgent)
 * @param {string} details - Human readable description
 * @param {Object} options - Optional: { userId, severity, metadata }
 */
const logSecurityEvent = async (eventType, req, details, options = {}) => {
    try {
        const { userId, severity = 'low', metadata = {} } = options;

        // Robust IP extraction
        let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
        if (ipAddress && ipAddress.includes(',')) {
            ipAddress = ipAddress.split(',')[0].trim();
        }

        const log = new SecurityLog({
            eventType,
            userId: userId || (req.user ? req.user.id : null),
            ipAddress,
            userAgent: req.headers['user-agent'],
            details,
            severity,
            metadata
        });

        await log.save();

        // Console alert for high severity
        if (severity === 'high' || severity === 'critical') {
            console.warn(`[SECURITY ALERT] ${eventType}: ${details} (IP: ${ipAddress})`);
        }

    } catch (err) {
        console.error('Failed to write security log:', err.message);
        // Don't crash the app if logging fails
    }
};

module.exports = { logSecurityEvent };
