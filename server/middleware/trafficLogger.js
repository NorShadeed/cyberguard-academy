const trafficBuffer = [];
const BUFFER_SIZE = 100;

// Middleware Function
const trafficLogger = (req, res, next) => {
    // Skip logging for the traffic endpoint itself to avoid infinite loop/spam
    if (req.originalUrl.includes('/api/admin/traffic')) {
        return next();
    }

    const start = Date.now();

    // Capture response finish
    res.on('finish', () => {
        const duration = Date.now() - start;

        // Push to circular buffer
        trafficBuffer.unshift({
            id: Date.now() + Math.random().toString(36).substr(2, 5),
            method: req.method,
            path: req.originalUrl || req.url,
            status: res.statusCode,
            duration: duration + 'ms',
            timestamp: new Date(),
            ip: req.ip || req.connection.remoteAddress
        });

        // Trim buffer
        if (trafficBuffer.length > BUFFER_SIZE) {
            trafficBuffer.pop();
        }
    });

    next();
};

// Accessor for the route handler
const getTrafficData = () => trafficBuffer;

module.exports = { trafficLogger, getTrafficData };
