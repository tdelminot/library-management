const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'library_test_db';

// Increase timeout for async operations
jest.setTimeout(30000);