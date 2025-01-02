const jwt = require('jsonwebtoken');

// Authentication Middleware
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Check if the Authorization header is missing
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized: No Authorization Header' });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1]; 

    // Verify the token using the secret key from environment variables
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // If the token is invalid or expired
            return res.status(403).json({ message: 'Forbidden: Invalid or Expired Token' });
        }

        // Attach decoded token payload to `req.user`
        req.user = user; 
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authenticate;
