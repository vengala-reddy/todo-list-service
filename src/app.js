import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiLimiter } from './middleware/rateLimitter.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';


const app = express();
app.use(helmet()) // adds security headers
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// parse JSON request bodies
app.use(express.json());
// rate limiting middleware
app.use('/todolist/api', apiLimiter);
// request logging middleware
app.use((req,res,next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    next();
});
// API routes
app.use('/todolist/api/v1/user', taskRoutes);

// error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;