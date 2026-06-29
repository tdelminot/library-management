const { body, param, validationResult } = require('express-validator');
const logger = require('../config/logger');

const validateBook = [
  body('title')
    .notEmpty()
    .withMessage('Le titre est requis')
    .isLength({ min: 2 })
    .withMessage('Le titre doit faire au moins 2 caractères')
    .trim(),
  body('author')
    .notEmpty()
    .withMessage("L'auteur est requis")
    .isLength({ min: 2 })
    .withMessage("L'auteur doit faire au moins 2 caractères")
    .trim(),
  body('isbn')
    .notEmpty()
    .withMessage("L'ISBN est requis")
    .isLength({ min: 10, max: 13 })
    .withMessage("L'ISBN doit faire entre 10 et 13 caractères")
    .trim(),
  body('published_year')
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(`L'année doit être entre 1000 et ${new Date().getFullYear()}`),
  body('genre').notEmpty().withMessage('Le genre est requis').trim(),
];

const validateId = [param('id').isInt().withMessage("L'ID doit être un nombre entier")];

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation failed:', errors.array());
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

module.exports = { validateBook, validateId, validateRequest };
