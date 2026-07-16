const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const bookRoutes = require('./routes/books');
const requestLogger = require('./middleware/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { testConnection } = require('./config/database');
const logger = require('./config/logger');

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Trop de requêtes, veuillez réessayer plus tard.',
});
app.use('/api/', limiter);

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Health check
app.get('/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbConnected ? 'connected' : 'disconnected',
  });
});

// API routes
app.use('/api/books', bookRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Library Management API',
    version: '1.0.0',
    endpoints: {
      books: '/api/books',
      stats: '/api/books/stats',
      health: '/health',
    },
  });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

module.exports = app;
