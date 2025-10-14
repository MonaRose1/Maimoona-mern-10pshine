import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../../routes.js';
import { errorHandler, notFoundHandler } from '../../middleware/errorHandler.js';

describe('Authentication Routes', () => {
  let app;

  before(async () => {
    // Create test app
    const testApp = express();
    testApp.use(express.json());
    await registerRoutes(testApp);
    testApp.use(notFoundHandler);
    testApp.use(errorHandler);
    app = testApp;
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(200);

      expect(res.body).to.have.property('token');
      expect(res.body).to.have.property('user');
      expect(res.body.user.name).to.equal(userData.name);
      expect(res.body.user.email).to.equal(userData.email);
    });

    it('should return error for duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'duplicate@example.com',
        password: 'password123'
      };

      // Create user first time
      await request(app)
        .post('/api/auth/signup')
        .send(userData);

      // Try to create again with same email
      const res = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(res.body.message).to.include('already exists');
    });

    it('should return error for invalid data', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test',
          // missing email and password
        })
        .expect(500);

      expect(res.body).to.have.property('message');
    });
  });

  describe('POST /api/auth/login', () => {
    const testUser = {
      name: 'Login Test',
      email: `logintest${Date.now()}@example.com`,
      password: 'password123'
    };

    before(async () => {
      // Create user for login tests
      await request(app)
        .post('/api/auth/signup')
        .send(testUser);
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(res.body).to.have.property('token');
      expect(res.body).to.have.property('user');
      expect(res.body.user.email).to.equal(testUser.email);
    });

    it('should return error for incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(400);

      expect(res.body.message).to.include('Invalid credentials');
    });

    it('should return error for non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(400);

      expect(res.body.message).to.include('Invalid credentials');
    });
  });

  describe('GET /api/me', () => {
    let authToken;

    before(async () => {
      // Create user and get token
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Profile Test',
          email: `profiletest${Date.now()}@example.com`,
          password: 'password123'
        });

      authToken = res.body.token;
    });

    it('should return user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).to.have.property('name');
      expect(res.body).to.have.property('email');
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('hasSecretPin');
    });

    it('should return error without token', async () => {
      const res = await request(app)
        .get('/api/me')
        .expect(401);

      expect(res.body.message).to.exist;
    });
  });
});
