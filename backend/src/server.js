import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import dietRoutes from './routes/dietRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();

// Middleware Setup
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all API requests
app.use('/api', apiLimiter);

// ✅ Root route (moved here, before notFound middleware)
app.get('/', (req, res) => {
    res.json({ success: true, message: 'FitLife AI Backend Running 🚀' });
});

// ✅ Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'FitLife AI API Server is running smoothly',
        timestamp: new Date().toISOString(),
        databaseMode: global.isMockDatabase ? 'File Mock Database' : 'MongoDB Connection'
    });
});

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/diets', dietRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/ai', aiRoutes);

// ✅ Error Handling Middleware (always at the very end)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// ✅ startServer moved to bottom, nothing after it
const startServer = async() => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`🚀 [Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        console.log(`🔗 [Health] Check API status at http://localhost:${PORT}/api/health`);
    });
};

startServer();