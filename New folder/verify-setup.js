#!/usr/bin/env node

/**
 * Verification Script for Testing & Code Quality Setup
 * 
 * This script verifies that all testing and quality tools are properly installed
 * and configured.
 */

import { existsSync } from 'fs';
import { resolve } from 'path';

console.log('🔍 Verifying Testing & Code Quality Setup...\n');

const checks = [];

// Check files exist
const requiredFiles = [
  // Backend Error Handling
  { path: 'backend/server/middleware/errorHandler.js', name: 'Error Handler Middleware' },
  { path: 'backend/server/utils/errors.js', name: 'Custom Error Classes' },
  { path: 'backend/server/utils/logger.js', name: 'Pino Logger' },
  
  // Backend Tests
  { path: 'backend/server/test/models/user.test.js', name: 'User Model Tests' },
  { path: 'backend/server/test/models/note.test.js', name: 'Note Model Tests' },
  { path: 'backend/server/test/middleware/errorHandler.test.js', name: 'Error Handler Tests' },
  { path: 'backend/server/test/integration/auth.test.js', name: 'Integration Tests' },
  { path: 'backend/server/test/setup.js', name: 'Test Setup' },
  { path: 'backend/server/.mocharc.json', name: 'Mocha Config' },
  
  // Frontend Tests
  { path: 'frontend/notes-app/test/pages/Login.test.jsx', name: 'Login Tests' },
  { path: 'frontend/notes-app/test/pages/Signup.test.jsx', name: 'Signup Tests' },
  { path: 'frontend/notes-app/test/utils/helper.test.js', name: 'Helper Tests' },
  { path: 'frontend/notes-app/test/setupTests.js', name: 'Jest Setup' },
  { path: 'frontend/notes-app/jest.config.js', name: 'Jest Config' },
  { path: 'frontend/notes-app/babel.config.cjs', name: 'Babel Config' },
  
  // SonarQube
  { path: 'sonar-project.properties', name: 'SonarQube Config' },
  
  // Documentation
  { path: 'TESTING_AND_QUALITY_SETUP.md', name: 'Main Documentation' },
  { path: 'QUICK_START_TESTING.md', name: 'Quick Start Guide' },
  { path: 'IMPLEMENTATION_SUMMARY.md', name: 'Implementation Summary' },
];

console.log('📁 Checking Files...\n');

requiredFiles.forEach(file => {
  const exists = existsSync(resolve(file.path));
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${file.name}`);
  checks.push({ name: file.name, passed: exists });
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Verification Summary\n');

const passed = checks.filter(c => c.passed).length;
const total = checks.length;
const percentage = Math.round((passed / total) * 100);

console.log(`Total Checks: ${total}`);
console.log(`Passed: ${passed}`);
console.log(`Failed: ${total - passed}`);
console.log(`Success Rate: ${percentage}%\n`);

if (percentage === 100) {
  console.log('🎉 All checks passed! Setup is complete.\n');
  console.log('Next steps:');
  console.log('  1. Run backend tests: npm run test:backend');
  console.log('  2. Run frontend tests: npm run test:frontend');
  console.log('  3. Run all tests: npm run test:all');
  console.log('  4. Start server: npm run server\n');
  console.log('For detailed instructions, see:');
  console.log('  - TESTING_AND_QUALITY_SETUP.md');
  console.log('  - QUICK_START_TESTING.md\n');
} else {
  console.log('⚠️  Some files are missing. Please check the installation.');
  console.log('\nMissing files:');
  checks.filter(c => !c.passed).forEach(c => {
    console.log(`  - ${c.name}`);
  });
  console.log('\nRun the setup again or check documentation.\n');
}

console.log('='.repeat(60) + '\n');
