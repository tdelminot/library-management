const { pool } = require('../config/database');
const logger = require('../config/logger');

class Book {
  static async findAll(filters = {}) {
    let query = 'SELECT * FROM books WHERE 1=1';
    const values = [];

    if (filters.genre) {
      query += ' AND genre = ?';
      values.push(filters.genre);
    }

    if (filters.author) {
      query += ' AND author LIKE ?';
      values.push(`%${filters.author}%`);
    }

    if (filters.available !== undefined) {
      query += ' AND available = ?';
      values.push(filters.available);
    }

    query += ' ORDER BY created_at DESC';

    try {
      const [rows] = await pool.query(query, values);
      logger.debug(`Found ${rows.length} books`);
      return rows;
    } catch (error) {
      logger.error('Error in findAll:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      logger.error(`Error in findById for id ${id}:`, error);
      throw error;
    }
  }

  static async findByISBN(isbn) {
    try {
      const [rows] = await pool.query('SELECT * FROM books WHERE isbn = ?', [isbn]);
      return rows[0] || null;
    } catch (error) {
      logger.error(`Error in findByISBN for ${isbn}:`, error);
      throw error;
    }
  }

  static async create(bookData) {
    const { title, author, isbn, published_year, genre } = bookData;
    try {
      const [result] = await pool.query(
        `INSERT INTO books (title, author, isbn, published_year, genre, available) 
         VALUES (?, ?, ?, ?, ?, true)`,
        [title, author, isbn, published_year, genre]
      );
      logger.info(`Book created with id ${result.insertId}: ${title}`);
      return this.findById(result.insertId);
    } catch (error) {
      logger.error('Error in create:', error);
      throw error;
    }
  }

  static async update(id, bookData) {
    const { title, author, isbn, published_year, genre, available } = bookData;
    try {
      const [result] = await pool.query(
        `UPDATE books SET title = ?, author = ?, isbn = ?, 
         published_year = ?, genre = ?, available = ? WHERE id = ?`,
        [title, author, isbn, published_year, genre, available, id]
      );
      if (result.affectedRows > 0) {
        logger.info(`Book updated: id ${id}`);
        return this.findById(id);
      }
      return null;
    } catch (error) {
      logger.error(`Error in update for id ${id}:`, error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM books WHERE id = ?', [id]);
      if (result.affectedRows > 0) {
        logger.info(`Book deleted: id ${id}`);
      }
      return result.affectedRows > 0;
    } catch (error) {
      logger.error(`Error in delete for id ${id}:`, error);
      throw error;
    }
  }

  static async borrow(id) {
    try {
      const [result] = await pool.query(
        'UPDATE books SET available = false WHERE id = ? AND available = true',
        [id]
      );
      if (result.affectedRows > 0) {
        logger.info(`Book borrowed: id ${id}`);
      }
      return result.affectedRows > 0;
    } catch (error) {
      logger.error(`Error in borrow for id ${id}:`, error);
      throw error;
    }
  }

  static async return(id) {
    try {
      const [result] = await pool.query('UPDATE books SET available = true WHERE id = ?', [id]);
      if (result.affectedRows > 0) {
        logger.info(`Book returned: id ${id}`);
      }
      return result.affectedRows > 0;
    } catch (error) {
      logger.error(`Error in return for id ${id}:`, error);
      throw error;
    }
  }

  static async count() {
    try {
      const [rows] = await pool.query('SELECT COUNT(*) as total FROM books');
      return rows[0].total;
    } catch (error) {
      logger.error('Error in count:', error);
      throw error;
    }
  }

  static async getStats() {
    try {
      const [total] = await pool.query('SELECT COUNT(*) as total FROM books');
      const [available] = await pool.query(
        'SELECT COUNT(*) as available FROM books WHERE available = true'
      );
      const [borrowed] = await pool.query(
        'SELECT COUNT(*) as borrowed FROM books WHERE available = false'
      );

      return {
        total: total[0].total,
        available: available[0].available,
        borrowed: borrowed[0].borrowed,
      };
    } catch (error) {
      logger.error('Error in getStats:', error);
      throw error;
    }
  }
}

module.exports = Book;
