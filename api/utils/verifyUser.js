import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
    // Check if token exists in cookies
    const token = req.cookies?.access_token;
    if (!token) {
        // Return a more descriptive error message for missing token
        return next(errorHandler(401, 'No token provided, unauthorized'));
    }

    // Verify the token using the JWT secret
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            // Handle different JWT error types 
            if (err.name === 'TokenExpiredError') {
                return next(errorHandler(401, 'Token has expired, please login again'));
            } else if (err.name === 'JsonWebTokenError') {
                return next(errorHandler(401, 'Invalid token, unauthorized'));
            } else {
                return next(errorHandler(401, 'Token verification failed, unauthorized'));
            }
        }

        // Attach user info to request object after successful verification
        req.user = user;
        next();
    });
};
