import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';

export const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // 100 requests per window
    message: {
        success: false,
        message: 'Too many requests, please try again later.'
    },
    handler: (req, res, next, options) => {
        logger.warn(`Rate limit exceeded for IP`, {ip: req.ip});
        res.status(options.statusCode).json(options.message);
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});