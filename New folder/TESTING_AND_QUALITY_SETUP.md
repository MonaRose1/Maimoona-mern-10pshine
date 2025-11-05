# 🧪 Testing and Code Quality Setup - Complete Guide

## Overview

This document provides comprehensive information about the testing infrastructure, exception handling, and code quality tools integrated into the Notes Application.

---

## 📋 Table of Contents

1. [Exception Handling](#exception-handling)
2. [Backend Testing (Mocha/Chai)](#backend-testing)
3. [Frontend Testing (Jest)](#frontend-testing)
4. [SonarQube Integration](#sonarqube-integration)
5. [Running Tests](#running-tests)
6. [Code Coverage](#code-coverage)
7. [Best Practices](#best-practices)

---

## 🛡️ Exception Handling

### Global Exception Handling Middleware

**Location:** `backend/server/middleware/errorHandler.js`

#### Features

- ✅ Centralized error handling across the application
- ✅ Meaningful error messages for users
- ✅ Structured logging with Pino
- ✅ Environment-specific error responses (dev vs production)
- ✅ MongoDB error handling (duplicate keys, validation, cast errors)
- ✅ JWT error handling
- ✅ Custom error classes for different HTTP status codes

#### Custom Error Classes

**Location:** `backend/server/utils/errors.js`

```javascript
import { 
  AppError, 
  BadRequestError, 
  UnauthorizedError, 
  NotFoundError, 
  ConflictError,
  ValidationError,
  InternalServerError,
  DatabaseError 
} from './utils/errors.js';

// Usage examples:
throw new BadRequestError('Invalid input data');
throw new UnauthorizedError('Please login to continue');
throw new NotFoundError('User not found');
throw new ConflictError('Email already exists');
throw new ValidationError('Validation failed', ['Field required']);
```

#### Error Handler Usage

```javascript
import { asyncHandler } from './middleware/errorHandler.js';

// Wrap async route handlers
app.get('/api/notes', asyncHandler(async (req, res) => {
  // If any error occurs, it will be caught and handled
  const notes = await Note.find();
  res.json(notes);
}));
```

### Logging with Pino

**Location:** `backend/server/utils/logger.js`

#### Features

- ✅ Structured JSON logging
- ✅ Pretty printing in development
- ✅ Configurable log levels
- ✅ Timestamp support
- ✅ Performance optimized

#### Usage

```javascript
import logger from './utils/logger.js';

logger.info('Server started');
logger.error({ err }, 'Database connection failed');
logger.warn({ userId }, 'Invalid token attempt');
logger.debug({ data }, 'Processing request');
```

#### Log Levels

- `trace` - Very detailed information
- `debug` - Debugging information
- `info` - General information (default)
- `warn` - Warning messages
- `error` - Error messages
- `fatal` - Fatal errors

---

## 🧪 Backend Testing (Mocha/Chai)

### Test Structure

```
backend/server/test/
├── models/
│   ├── user.test.js          # User model tests
│   └── note.test.js          # Note model tests
├── middleware/
│   └── errorHandler.test.js  # Error handler tests
├── setup.js                  # Test setup and configuration
└── package.json              # Test-specific package.json
```

### Running Backend Tests

```bash
# Run all backend tests
npm run test:backend

# Run tests in watch mode
npm run test:backend:watch

# Run tests with coverage
cd backend/server
npm run test:coverage
```

### Test Examples

#### Model Testing

```javascript
describe('User Model', () => {
  it('should create a new user with valid data', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    expect(user.name).to.equal('Test User');
    expect(user.email).to.equal('test@example.com');
  });
});
```

#### Middleware Testing

```javascript
describe('Error Handler', () => {
  it('should handle BadRequestError correctly', () => {
    const error = new BadRequestError('Invalid input');
    errorHandler(error, req, res, next);
    
    expect(res.status.calledWith(400)).to.be.true;
  });
});
```

### Test Configuration

**File:** `.mocharc.json`

```json
{
  "require": ["./test/setup.js"],
  "spec": "test/**/*.test.js",
  "timeout": 10000,
  "exit": true
}
```

---

## 🎯 Frontend Testing (Jest)

### Test Structure

```
frontend/notes-app/test/
├── pages/
│   ├── Login.test.jsx        # Login page tests
│   └── Signup.test.jsx       # Signup page tests
├── utils/
│   └── helper.test.js        # Helper functions tests
└── setupTests.js             # Jest setup
```

### Running Frontend Tests

```bash
# Run all frontend tests
npm run test:frontend

# Or from frontend directory
cd frontend/notes-app
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Examples

#### Component Testing

```javascript
describe('Login Component', () => {
  it('renders login form correctly', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
  });

  it('shows error on failed login', async () => {
    apiRequest.mockRejectedValue(new Error('Invalid credentials'));
    
    // Trigger login
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });
});
```

#### Utility Function Testing

```javascript
describe('Helper Functions', () => {
  it('should validate correct email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });

  it('should reject invalid email', () => {
    expect(validateEmail('invalid')).toBe(false);
  });
});
```

### Jest Configuration

**File:** `jest.config.js`

```javascript
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setupTests.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
  ],
};
```

---

## 📊 SonarQube Integration

### Setup

1. **Install SonarQube Scanner**

```bash
npm install -g sonarqube-scanner
```

2. **Configure SonarQube Server**

Create `.env` file in project root:

```env
SONAR_HOST_URL=http://localhost:9000
SONAR_TOKEN=your_token_here
```

3. **Configuration File**

**File:** `sonar-project.properties`

```properties
sonar.projectKey=notes-app
sonar.projectName=Notes Application
sonar.sources=backend/server,frontend/notes-app/src
sonar.tests=backend/server/test,frontend/notes-app/test
sonar.javascript.lcov.reportPaths=backend/server/coverage/lcov.info
```

### Running SonarQube Analysis

```bash
# Run SonarQube scan
npm run sonar

# Or manually
sonar-scanner
```

### SonarQube Rules

#### Code Quality Gates

- **Bugs:** 0 tolerance
- **Vulnerabilities:** 0 tolerance
- **Code Smells:** < 5% ratio
- **Coverage:** > 50%
- **Duplications:** < 3%

#### JavaScript/TypeScript Rules

- ✅ No unused variables
- ✅ No console.log in production
- ✅ Consistent naming conventions
- ✅ Proper error handling
- ✅ No duplicate code blocks
- ✅ Complexity limits (max 15)
- ✅ File size limits (max 500 lines)

---

## 🚀 Running Tests

### Run All Tests

```bash
# From project root
npm run test:all
```

### Run Backend Tests Only

```bash
npm run test:backend
```

### Run Frontend Tests Only

```bash
npm run test:frontend
```

### Watch Mode (Development)

```bash
# Backend
npm run test:backend:watch

# Frontend
cd frontend/notes-app
npm run test:watch
```

---

## 📈 Code Coverage

### Generate Coverage Reports

```bash
# Backend coverage
cd backend/server
npm run test:coverage

# Frontend coverage
cd frontend/notes-app
npm run test:coverage
```

### Coverage Reports Location

- **Backend:** `backend/server/coverage/`
- **Frontend:** `frontend/notes-app/coverage/`

### Viewing Coverage Reports

```bash
# Open HTML coverage report (backend)
open backend/server/coverage/index.html

# Open HTML coverage report (frontend)
open frontend/notes-app/coverage/lcov-report/index.html
```

### Coverage Thresholds

**Frontend (jest.config.js):**

```javascript
coverageThreshold: {
  global: {
    branches: 50,
    functions: 50,
    lines: 50,
    statements: 50,
  },
}
```

---

## ✅ Best Practices

### Exception Handling

1. **Always use asyncHandler for async routes**
   ```javascript
   app.get('/api/notes', asyncHandler(async (req, res) => {
     // Your code
   }));
   ```

2. **Use appropriate error classes**
   ```javascript
   if (!user) {
     throw new NotFoundError('User not found');
   }
   ```

3. **Log errors with context**
   ```javascript
   logger.error({ userId, err }, 'Failed to fetch notes');
   ```

### Testing

1. **Write tests before fixing bugs**
2. **Test edge cases and error conditions**
3. **Use descriptive test names**
4. **Mock external dependencies**
5. **Aim for >80% coverage on critical code**

### Code Quality

1. **Run SonarQube regularly**
2. **Fix critical issues immediately**
3. **Address code smells gradually**
4. **Keep functions small and focused**
5. **Avoid code duplication**

---

## 📝 Test Coverage Summary

### Backend

- ✅ User Model (creation, validation)
- ✅ Note Model (creation, validation)
- ✅ Error Handler Middleware (all error types)
- ✅ MongoDB Error Handling
- ✅ Async Error Handling

### Frontend

- ✅ Login Component (form, validation, API calls)
- ✅ Signup Component (form, validation, API calls)
- ✅ Helper Functions (email, password validation)
- ✅ Error Display
- ✅ Loading States

---

## 🔧 Troubleshooting

### Common Issues

#### Backend Tests Failing

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check MongoDB connection
# Ensure MongoDB is running
```

#### Frontend Tests Failing

```bash
# Clear Jest cache
npm run test -- --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### SonarQube Connection Issues

```bash
# Check SonarQube server is running
curl http://localhost:9000

# Verify token
echo $SONAR_TOKEN
```

---

## 📚 Additional Resources

### Documentation

- [Mocha Documentation](https://mochajs.org/)
- [Chai Assertion Library](https://www.chaijs.com/)
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Pino Logger](https://getpino.io/)
- [SonarQube Docs](https://docs.sonarqube.org/)

### Tutorials

- [Testing Node.js with Mocha](https://blog.logrocket.com/testing-node-js-mocha-chai/)
- [Jest Testing React](https://jestjs.io/docs/tutorial-react)
- [SonarQube Setup](https://docs.sonarqube.org/latest/setup/get-started-2-minutes/)

---

## 🎯 Next Steps

1. **Increase Test Coverage**
   - Add integration tests
   - Add E2E tests with Cypress
   - Test API endpoints with supertest

2. **Enhance Error Handling**
   - Add request validation middleware
   - Implement rate limiting
   - Add security headers

3. **Improve Code Quality**
   - Set up ESLint
   - Configure Prettier
   - Add pre-commit hooks with Husky

4. **CI/CD Integration**
   - Run tests on every commit
   - Block merges if tests fail
   - Automated SonarQube scans

---

**Last Updated:** 2025-10-14  
**Status:** ✅ COMPLETE AND FUNCTIONAL  
**Coverage:** Backend 50%+ | Frontend 50%+
