const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/config/database');

jest.mock('../../src/config/database');

describe('API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      pool.query.mockResolvedValue([[]]);
      
      const response = await request(app)
        .get('/health')
        .expect(200);
      
      expect(response.body.status).toBe('OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api/books', () => {
    it('should return list of books', async () => {
      const mockBooks = [
        { id: 1, title: 'Book 1', author: 'Author 1', available: true },
        { id: 2, title: 'Book 2', author: 'Author 2', available: false },
      ];
      
      pool.query.mockResolvedValue([mockBooks]);
      
      const response = await request(app)
        .get('/api/books')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data).toHaveLength(2);
    });
  });

  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const newBook = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '9781234567897',
        published_year: 2023,
        genre: 'Fiction',
      };
      
      const mockBook = { id: 1, ...newBook, available: true };
      
      // Mock findByISBN (no existing book)
      pool.query
        .mockResolvedValueOnce([[]]) // findByISBN
        .mockResolvedValueOnce([{ insertId: 1 }]) // INSERT
        .mockResolvedValueOnce([[mockBook]]); // findById
      
      const response = await request(app)
        .post('/api/books')
        .send(newBook)
        .expect(201);
      
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(newBook.title);
      expect(response.body.message).toBe('Livre créé avec succès');
    });

    it('should return 400 if ISBN already exists', async () => {
      const existingBook = { id: 1, isbn: '9781234567897' };
      
      pool.query.mockResolvedValueOnce([[existingBook]]);
      
      const response = await request(app)
        .post('/api/books')
        .send({
          title: 'Another Book',
          author: 'Another Author',
          isbn: '9781234567897',
          published_year: 2023,
          genre: 'Fiction',
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Un livre avec cet ISBN existe déjà');
    });

    it('should return 400 for invalid data', async () => {
      const response = await request(app)
        .post('/api/books')
        .send({
          title: 'A', // too short
          author: '',
          isbn: '123',
          published_year: 3000, // future year
        })
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/books/:id/borrow', () => {
    it('should borrow an available book', async () => {
      const availableBook = { id: 1, available: true };
      
      pool.query
        .mockResolvedValueOnce([[availableBook]]) // findById
        .mockResolvedValueOnce([{ affectedRows: 1 }]) // borrow
        .mockResolvedValueOnce([[{ ...availableBook, available: false }]]); // findById again
      
      const response = await request(app)
        .post('/api/books/1/borrow')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Livre emprunté avec succès');
    });

    it('should not borrow an already borrowed book', async () => {
      const borrowedBook = { id: 1, available: false };
      
      pool.query.mockResolvedValueOnce([[borrowedBook]]);
      
      const response = await request(app)
        .post('/api/books/1/borrow')
        .expect(400);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Ce livre est déjà emprunté');
    });
  });

  describe('DELETE /api/books/:id', () => {
    it('should delete a book', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
      
      const response = await request(app)
        .delete('/api/books/1')
        .expect(200);
      
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Livre supprimé avec succès');
    });

    it('should return 404 if book not found', async () => {
      pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
      
      const response = await request(app)
        .delete('/api/books/999')
        .expect(404);
      
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Livre non trouvé');
    });
  });
});