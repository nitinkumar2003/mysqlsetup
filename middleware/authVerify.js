
const jwt = require('jsonwebtoken');
const Constant = require('../utilities/Constant')
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        Constant.handleAuthToken(res, 401, 'Authorization token not found');
    }
    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET_KEY_VALUE, (err, decoded) => {
        if (err) {
            Constant.handleAuthToken(res, 403, 'Invalid token');
        }
        req.userId = decoded.userId;
        next();
    });
};

module.exports = verifyToken;
