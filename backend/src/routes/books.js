const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { validateBook, validateId, validateRequest } = require('../middleware/validation');

// Routes publiques
router.get('/', bookController.getBooks);
router.get('/stats', bookController.getStats);
router.get('/:id', validateId, validateRequest, bookController.getBookById);

// Routes d'administration
router.post('/', validateBook, validateRequest, bookController.createBook);
router.put('/:id', validateId, validateRequest, bookController.updateBook);
router.delete('/:id', validateId, validateRequest, bookController.deleteBook);

// Routes d'emprunt
router.post('/:id/borrow', validateId, validateRequest, bookController.borrowBook);
router.post('/:id/return', validateId, validateRequest, bookController.returnBook);

module.exports = router;
