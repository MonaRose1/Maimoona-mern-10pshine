import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { registerRoutes } from '../../routes.js';
import { errorHandler, notFoundHandler } from '../../middleware/errorHandler.js';
import { User } from '../../models/User.js';
import { SecretNote } from '../../models/SecretNote.js';

describe('Secret Note Routes', () => {
  let app;
  let authToken;
  let pinToken;
  let testUser;
  let testSecretNote;

  before(async () => {
    // Create test app
    const testApp = express();
    testApp.use(express.json());
    await registerRoutes(testApp);
    testApp.use(notFoundHandler);
    testApp.use(errorHandler);
    app = testApp;

    // Create a test user with a secret PIN
    testUser = new User({
      name: 'Secret Note Test User',
      email: `secret-note-test-${Date.now()}@example.com`,
      password: 'password123',
      secretPin: '1234'
    });
    await testUser.save();

    // Create auth token (mock implementation)
    authToken = `mock-token-${testUser._id}-${Date.now()}`;

    // Create PIN token
    pinToken = jwt.sign(
      { userId: testUser._id, pinVerified: true },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: '15m' }
    );

    // Create a test secret note
    testSecretNote = new SecretNote({
      title: 'Secret Test Note',
      content: 'This is a secret test note',
      userId: testUser._id
    });
    await testSecretNote.save();
  });

  describe('GET /api/secret/notes', () => {
    it('should get all secret notes for authenticated user with valid PIN token', async () => {
      const res = await request(app)
        .get('/api/secret/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Pin-Authorization', `Bearer ${pinToken}`)
        .expect(200);

      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
    });

    it('should return error for authenticated user without PIN token', async () => {
      const res = await request(app)
        .get('/api/secret/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(res.body.message).to.include('PIN verification required');
      expect(res.body.redirectTo).to.equal('/verify-pin');
    });

    it('should return error for unauthenticated request', async () => {
      const res = await request(app)
        .get('/api/secret/notes')
        .expect(401);

      expect(res.body.message).to.include('User not authenticated');
    });
  });

  describe('POST /api/secret/notes', () => {
    it('should create a new secret note for authenticated user with valid PIN token', async () => {
      const noteData = {
        title: 'New Secret Test Note',
        content: 'This is a new secret test note',
        tags: ['secret', 'test']
      };

      const res = await request(app)
        .post('/api/secret/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Pin-Authorization', `Bearer ${pinToken}`)
        .send(noteData)
        .expect(200);

      expect(res.body.title).to.equal(noteData.title);
      expect(res.body.content).to.equal(noteData.content);
      expect(res.body.tags).to.deep.equal(noteData.tags);
      expect(res.body.userId.toString()).to.equal(testUser._id.toString());
    });

    it('should return error for authenticated user without PIN token', async () => {
      const noteData = {
        title: 'Unauthorized Secret Note',
        content: 'This should fail'
      };

      const res = await request(app)
        .post('/api/secret/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(noteData)
        .expect(403);

      expect(res.body.message).to.include('PIN verification required');
      expect(res.body.redirectTo).to.equal('/verify-pin');
    });

    it('should return error for unauthenticated request', async () => {
      const noteData = {
        title: 'Unauthorized Secret Note',
        content: 'This should fail'
      };

      const res = await request(app)
        .post('/api/secret/notes')
        .send(noteData)
        .expect(401);

      expect(res.body.message).to.include('User not authenticated');
    });
  });

  describe('GET /api/secret/notes/:id', () => {
    it('should get a specific secret note by ID for authenticated user with valid PIN token', async () => {
      const res = await request(app)
        .get(`/api/secret/notes/${testSecretNote._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Pin-Authorization', `Bearer ${pinToken}`)
        .expect(200);

      expect(res.body.title).to.equal(testSecretNote.title);
      expect(res.body.content).to.equal(testSecretNote.content);
    });

    it('should return 404 for non-existent secret note', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const res = await request(app)
        .get(`/api/secret/notes/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Pin-Authorization', `Bearer ${pinToken}`)
        .expect(404);

      expect(res.body.message).to.include('Note not found');
    });

    it('should return error for authenticated user without PIN token', async () => {
      const res = await request(app)
        .get(`/api/secret/notes/${testSecretNote._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(res.body.message).to.include('PIN verification required');
      expect(res.body.redirectTo).to.equal('/verify-pin');
    });

    it('should return error for unauthenticated request', async () => {
      const res = await request(app)
        .get(`/api/secret/notes/${testSecretNote._id}`)
        .expect(401);

      expect(res.body.message).to.include('User not authenticated');
    });
  });

  describe('PUT /api/secret/notes/:id', () => {
    it('should update a secret note for authenticated user with valid PIN token', async () => {
      const updateData = {
        title: 'Updated Secret Test Note',
        content: 'This secret note has been updated',
        isPinned: true
      };

      const res = await request(app)
        .put(`/api/secret/notes/${testSecretNote._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Pin-Authorization', `Bearer ${pinToken}`)
        .send(updateData)
        .expect(200);

      expect(res.body.title).to.equal(updateData.title);
      expect(res.body.content).to.equal(updateData.content);
      expect(res.body.isPinned).to.equal(updateData.isPinned);
    });

    it('should return 404 for non-existent secret note', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const updateData = {
        title: 'Should not update',
        content: 'This should fail'
      };

      const res = await request(app)
        .put(`/api/secret/notes/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Pin-Authorization', `Bearer ${pinToken}`)
        .send(updateData)
        .expect(404);

      expect(res.body.message).to.include('Note not found');
    });

    it('should return error for authenticated user without PIN token', async () => {
      const updateData = {
        title: 'Unauthorized Secret Update',
        content: 'This should fail'
      };

      const res = await request(app)
        .put(`/api/secret/notes/${testSecretNote._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(403);

      expect(res.body.message).to.include('PIN verification required');
      expect(res.body.redirectTo).to.equal('/verify-pin');
    });

    it('should return error for unauthenticated request', async () => {
      const updateData = {
        title: 'Unauthorized Secret Update',
        content: 'This should fail'
      };

      const res = await request(app)
        .put(`/api/secret/notes/${testSecretNote._id}`)
        .send(updateData)
        .expect(401);

      expect(res.body.message).to.include('User not authenticated');
    });
  });

  describe('DELETE /api/secret/notes/:id', () => {
    it('should delete a secret note for authenticated user with valid PIN token', async () => {
      // Create a secret note to delete
      const secretNoteToDelete = new SecretNote({
        title: 'Secret Note to delete',
        content: 'This secret note will be deleted',
        userId: testUser._id
      });
      await secretNoteToDelete.save();

      const res = await request(app)
        .delete(`/api/secret/notes/${secretNoteToDelete._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Pin-Authorization', `Bearer ${pinToken}`)
        .expect(200);

      expect(res.body.message).to.include('Note deleted successfully');

      // Verify secret note is deleted
      const deletedNote = await SecretNote.findById(secretNoteToDelete._id);
      expect(deletedNote).to.be.null;
    });

    it('should return 404 for non-existent secret note', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const res = await request(app)
        .delete(`/api/secret/notes/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .set('Pin-Authorization', `Bearer ${pinToken}`)
        .expect(404);

      expect(res.body.message).to.include('Note not found');
    });

    it('should return error for authenticated user without PIN token', async () => {
      const res = await request(app)
        .delete(`/api/secret/notes/${testSecretNote._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(403);

      expect(res.body.message).to.include('PIN verification required');
      expect(res.body.redirectTo).to.equal('/verify-pin');
    });

    it('should return error for unauthenticated request', async () => {
      const res = await request(app)
        .delete(`/api/secret/notes/${testSecretNote._id}`)
        .expect(401);

      expect(res.body.message).to.include('User not authenticated');
    });
  });
});