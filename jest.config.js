module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/backend/tests'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'backend/src/**/*.js',
    '!backend/src/server.js',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/backend/tests/setup.js'],
  verbose: true,
};