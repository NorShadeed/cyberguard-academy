const User = require('../models/User');

/**
 * Admin Middleware
 * Checks if the authenticated user has admin privileges.
 * Must be used AFTER auth middleware.
 */
module.exports = async function (req, res, next) {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (!user.isAdmin) {
            return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
        }

        next();
    } catch (err) {
        console.error('Admin middleware error:', err.message);
        res.status(500).send('Server Error');
    }
};
