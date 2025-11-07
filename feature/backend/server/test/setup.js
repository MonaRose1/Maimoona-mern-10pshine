import { expect } from 'chai';

// Global test setup
before(function() {
  console.log('Starting test suite...');
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.LOG_LEVEL = 'silent';
});

after(function() {
  console.log('Test suite completed.');
});

// Global hooks for all tests
beforeEach(function() {
  // Setup before each test
});

afterEach(function() {
  // Cleanup after each test
});

// Make chai expect available globally
global.expect = expect;
