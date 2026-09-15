const authMiddleware = require('./auth');

const adminMiddleware = [
    authMiddleware,
    (req, res, next) => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    }
];

module.exports = adminMiddleware;
