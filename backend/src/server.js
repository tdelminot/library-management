const app = require('./app');
const logger = require('./config/logger');
const { testConnection } = require('./config/database');

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  // Test database connection
  const dbConnected = await testConnection();
  if (!dbConnected) {
    logger.error('Cannot start server without database connection');
    process.exit(1);
  }

  app.listen(PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${PORT}`);
    logger.info(`📚 API: http://localhost:${PORT}/api/books`);
    logger.info(`❤️ Health: http://localhost:${PORT}/health`);
  });
};

startServer();
