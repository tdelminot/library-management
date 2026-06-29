const Book = require('../../src/models/Book');
const { pool } = require('../../src/config/database');

jest.mock('../../src/config/database');

describe('Book Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all books', async () => {
      const mockBooks = [
        { id: 1, title: 'Test Book', author: 'Test Author' },
      ];
      
      pool.query.mockResolvedValue([mockBooks]);
      
      const result = await Book.findAll();
      
      expect(result).toEqual(mockBooks);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM books WHERE 1=1 ORDER BY created_at DESC',
        []
      );
    });

    it('should filter by genre', async () => {
      const mockBooks = [{ id: 1, title: 'Science Book', genre: 'Science' }];
      pool.query.mockResolvedValue([mockBooks]);
      
      const result = await Book.findAll({ genre: 'Science' });
      
      expect(result).toEqual(mockBooks);
      expect(pool.query).toHaveBeenCalledWith(
        'SELECT * FROM books WHERE 1=1 AND genre = ? ORDER BY created_at DESC',
        ['Science']
      );
    });
  });

  describe('create', () => {
    it('should create a new book', async () => {
      const bookData = {
        title: 'New Book',
        author: 'New Author',
        isbn: '1234567890',
        published_year: 2023,
        genre: 'Fiction',
      };
      
      const mockInsertResult = { insertId: 1 };
      const mockBook = { id: 1, ...bookData };
      
      pool.query
        .mockResolvedValueOnce([mockInsertResult])
        .mockResolvedValueOnce([[mockBook]]);
      
      const result = await Book.create(bookData);
      
      expect(result).toEqual(mockBook);
      expect(pool.query).toHaveBeenCalledTimes(2);
    });
  });
});