const JWT = require('jsonwebtoken');

// Use environment variable for production, fallback for local development
const JWT_SECRET = process.env.JWT_SECRET || "$123shu";

function createTokenForUser(user){
    const payload = {
        _id: user._id,
        email:user.email,
        role:user.role,
    }
    const token = JWT.sign(payload, JWT_SECRET);
    return token;
}

function validateToken(token){
    const payload = JWT.verify(token, JWT_SECRET);
    return payload;
}

module.exports = {
    createTokenForUser,
    validateToken,
}