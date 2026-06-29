const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Erreur interne du serveur';

  logger.error(`${req.method} ${req.originalUrl} - ${status}: ${message}`, {
    stack: err.stack,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  res.status(status).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

const notFound = (req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} non trouvée`,
  });
};

module.exports = { errorHandler, notFound };
