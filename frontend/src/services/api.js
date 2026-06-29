import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || 'Une erreur est survenue';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

export const apiService = {
  getBooks: () => apiClient.get('/books'),
  getBookById: (id) => apiClient.get(`/books/${id}`),
  createBook: (book) => apiClient.post('/books', book),
  updateBook: (id, book) => apiClient.put(`/books/${id}`, book),
  deleteBook: (id) => apiClient.delete(`/books/${id}`),
  borrowBook: (id) => apiClient.post(`/books/${id}/borrow`),
  returnBook: (id) => apiClient.post(`/books/${id}/return`),
  getStats: () => apiClient.get('/books/stats'),
};

export default apiService;