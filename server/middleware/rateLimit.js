/**
 * Simple In-Memory Rate Limiter
 * No external dependencies required.
 */
const rateLimitStore = new Map();

const rateLimit = (options = {}) => {
    const { windowMs = 15 * 60 * 1000, max = 10, message = 'Too many requests, please try again later.' } = options;

    return (req, res, next) => {
        // Use IP address as identifier
        const ip = req.ip || req.connection.remoteAddress || 'unknown';
        const key = `${ip}:${req.path}`;
        const now = Date.now();

        if (!rateLimitStore.has(key)) {
            rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
            return next();
        }

        const record = rateLimitStore.get(key);

        // Reset if window expired
        if (now > record.resetTime) {
            rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
            return next();
        }

        // Check limit
        if (record.count >= max) {
            return res.status(429).json({ msg: message });
        }

        // Increment count
        record.count++;
        next();
    };
};

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
        if (now > value.resetTime) {
            rateLimitStore.delete(key);
        }
    }
}, 5 * 60 * 1000);

module.exports = rateLimit;
