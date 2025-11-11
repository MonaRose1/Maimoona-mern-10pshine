import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../../routes.js';
import { errorHandler, notFoundHandler } from '../../middleware/errorHandler.js';
import { User } from '../../models/User.js';

describe('User Profile Routes', () => {
  let app;
  let authToken;
  let testUser;

  before(async () => {
    // Create test app
    const testApp = express();
    testApp.use(express.json());
    await registerRoutes(testApp);
    testApp.use(notFoundHandler);
    testApp.use(errorHandler);
    app = testApp;

    // Create a test user
    testUser = new User({
      name: 'Profile Test User',
      email: `profile-test-${Date.now()}@example.com`,
      password: 'password123'
    });
    await testUser.save();

    // Create auth token (mock implementation)
    authToken = `mock-token-${testUser._id}-${Date.now()}`;
  });

  describe('GET /api/me', () => {
    it('should return user profile with valid token', async () => {
      const res = await request(app)
        .get('/api/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.name).to.equal(testUser.name);
      expect(res.body.email).to.equal(testUser.email);
      expect(res.body).to.have.property('id');
      expect(res.body).to.have.property('hasSecretPin');
      expect(res.body).to.have.property('createdAt');
    });

    it('should return error without token', async () => {
      const res = await request(app)
        .get('/api/me')
        .expect(401);

      expect(res.body.message).to.include('User not authenticated');
    });
  });

  describe('POST /api/secret/set-pin', () => {
    it('should set a secret PIN for the user', async () => {
      const pinData = {
        pin: '5678'
      };

      const res = await request(app)
        .post('/api/secret/set-pin')
        .set('Authorization', `Bearer ${authToken}`)
        .send(pinData)
        .expect(200);

      expect(res.body.message).to.include('PIN set successfully');

      // Verify PIN was set in database
      const updatedUser = await User.findById(testUser._id);
      expect(updatedUser.secretPin).to.not.be.null;
    });

    it('should return error for invalid PIN (too short)', async () => {
      const pinData = {
        pin: '123' // Less than 4 characters
      };

      const res = await request(app)
        .post('/api/secret/set-pin')
        .set('Authorization', `Bearer ${authToken}`)
        .send(pinData)
        .expect(400);

      expect(res.body.message).to.include('PIN must be at least 4 characters');
    });

    it('should return error without token', async () => {
      const pinData = {
        pin: '5678'
      };

      const res = await request(app)
        .post('/api/secret/set-pin')
        .send(pinData)
        .expect(401);

      expect(res.body.message).to.include('User not authenticated');
    });
  });

  describe('POST /api/secret/check-pin', () => {
    it('should check if user has a secret PIN set', async () => {
      // First set a PIN
      const pinData = {
        pin: '9999'
      };

      await request(app)
        .post('/api/secret/set-pin')
        .set('Authorization', `Bearer ${authToken}`)
        .send(pinData);

      // Then check if PIN is set
      const res = await request(app)
        .post('/api/secret/check-pin')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.hasPin).to.be.true;
    });

    it('should return false for user without PIN', async () => {
      // Create a new user without PIN
      const newUser = new User({
        name: 'No PIN User',
        email: `no-pin-${Date.now()}@example.com`,
        password: 'password123'
      });
      await newUser.save();

      const newAuthToken = `mock-token-${newUser._id}-${Date.now()}`;

      const res = await request(app)
        .post('/api/secret/check-pin')
        .set('Authorization', `Bearer ${newAuthToken}`)
        .expect(200);

      expect(res.body.hasPin).to.be.false;
    });

    it('should return error without token', async () => {
      const res = await request(app)
        .post('/api/secret/check-pin')
        .expect(401);

      expect(res.body.message).to.include('User not authenticated');
    });
  });

  describe('POST /api/secret/verify-pin', () => {
    it('should verify correct PIN', async () => {
      // First set a PIN
      const pinData = {
        pin: '1234'
      };

      await request(app)
        .post('/api/secret/set-pin')
        .set('Authorization', `Bearer ${authToken}`)
        .send(pinData);

      // Then verify the PIN
      const verifyData = {
        pin: '1234'
      };

      const res = await request(app)
        .post('/api/secret/verify-pin')
        .set('Authorization', `Bearer ${authToken}`)
        .send(verifyData)
        .expect(200);

      expect(res.body.valid).to.be.true;
      expect(res.body.message).to.include('PIN verified');
      expect(res.body).to.have.property('pinToken');
    });

    it('should reject incorrect PIN', async () => {
      // Try to verify with wrong PIN
      const verifyData = {
        pin: '0000'
      };

      const res = await request(app)
        .post('/api/secret/verify-pin')
        .set('Authorization', `Bearer ${authToken}`)
        .send(verifyData)
        .expect(401);

      expect(res.body.valid).to.be.false;
      expect(res.body.message).to.include('Invalid PIN');
    });

    it('should return error without token', async () => {
      const verifyData = {
        pin: '1234'
      };

      const res = await request(app)
        .post('/api/secret/verify-pin')
        .send(verifyData)
        .expect(401);

      expect(res.body.message).to.include('User not authenticated');
    });
  });
});