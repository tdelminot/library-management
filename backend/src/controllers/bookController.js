const Book = require('../models/Book');
const logger = require('../config/logger');

const getBooks = async (req, res, next) => {
  try {
    const { genre, author, available } = req.query;
    const filters = {};

    if (genre) {
      filters.genre = genre;
    }
    if (author) {
      filters.author = author;
    }
    if (available !== undefined) {
      filters.available = available === 'true';
    }

    const books = await Book.findAll(filters);

    res.json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Livre non trouvé',
      });
    }

    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

const createBook = async (req, res, next) => {
  try {
    const existingBook = await Book.findByISBN(req.body.isbn);
    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'Un livre avec cet ISBN existe déjà',
      });
    }

    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book,
      message: 'Livre créé avec succès',
    });
  } catch (error) {
    next(error);
  }
};

const updateBook = async (req, res, next) => {
  try {
    const book = await Book.update(req.params.id, req.body);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Livre non trouvé',
      });
    }

    res.json({
      success: true,
      data: book,
      message: 'Livre mis à jour avec succès',
    });
  } catch (error) {
    next(error);
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const deleted = await Book.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Livre non trouvé',
      });
    }

    res.json({
      success: true,
      message: 'Livre supprimé avec succès',
    });
  } catch (error) {
    next(error);
  }
};

const borrowBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Livre non trouvé',
      });
    }

    if (!book.available) {
      return res.status(400).json({
        success: false,
        message: 'Ce livre est déjà emprunté',
      });
    }

    const borrowed = await Book.borrow(req.params.id);
    if (borrowed) {
      const updatedBook = await Book.findById(req.params.id);
      res.json({
        success: true,
        data: updatedBook,
        message: 'Livre emprunté avec succès',
      });
    }
  } catch (error) {
    next(error);
  }
};

const returnBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Livre non trouvé',
      });
    }

    const returned = await Book.return(req.params.id);
    if (returned) {
      const updatedBook = await Book.findById(req.params.id);
      res.json({
        success: true,
        data: updatedBook,
        message: 'Livre retourné avec succès',
      });
    }
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const stats = await Book.getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
  getStats,
};
