import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import { registerRoutes } from '../../routes.js';
import { errorHandler, notFoundHandler } from '../../middleware/errorHandler.js';
import { User } from '../../models/User.js';
import { Note } from '../../models/Note.js';

describe('Note Routes', () => {
  let app;
  let authToken;
  let testUser;
  let testNote;

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
      name: 'Note Test User',
      email: `note-test-${Date.now()}@example.com`,
      password: 'password123'
    });
    await testUser.save();

    // Create auth token (mock implementation)
    authToken = `mock-token-${testUser._id}-${Date.now()}`;

    // Create a test note
    testNote = new Note({
      title: 'Test Note',
      content: 'This is a test note',
      userId: testUser._id
    });
    await testNote.save();
  });

  describe('GET /api/notes', () => {
    it('should get all notes for authenticated user', async () => {
      const res = await request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
    });

    it('should return error for unauthenticated request', async () => {
      const res = await request(app)
        .get('/api/notes')
        .expect(401);

      expect(res.body.message).to.include('User not authenticated');
    });
  });

  describe('POST /api/notes', () => {
    it('should create a new note for authenticated user', async () => {
      const noteData = {
        title: 'New Test Note',
        content: 'This is a new test note',
        tags: ['test', 'note']
      };

      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${authToken}`)
        .send(noteData)
        .expect(200);

      expect(res.body.title).to.equal(noteData.title);
      expect(res.body.content).to.equal(noteData.content);
      expect(res.body.tags).to.deep.equal(noteData.tags);
      expect(res.body.userId.toString()).to.equal(testUser._id.toString());
    });

    it('should return error for unauthenticated request', async () => {
      const noteData = {
        title: 'Unauthorized Note',
        content: 'This should fail'
      };

      const res = await request(app)
        .post('/api/notes')
        .send(noteData)
        .expect(401);

      expect(res.body.message).to.include('User not authenticated');
    });
  });

  describe('GET /api/notes/:id', () => {
    it('should get a specific note by ID for authenticated user', async () => {
      const res = await request(app)
        .get(`/api/notes/${testNote._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.title).to.equal(testNote.title);
      expect(res.body.content).to.equal(testNote.content);
    });

    it('should return 404 for non-existent note', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const res = await request(app)
        .get(`/api/notes/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(res.body.message).to.include('Note not found');
    });

    it('should return error for unauthenticated request', async () => {
      const res = await request(app)
        .get(`/api/notes/${testNote._id}`)
        .expect(401);

      expect(res.body.message).to.include('User not authenticated');
    });
  });

  describe('PUT /api/notes/:id', () => {
    it('should update a note for authenticated user', async () => {
      const updateData = {
        title: 'Updated Test Note',
        content: 'This note has been updated',
        isPinned: true
      };

      const res = await request(app)
        .put(`/api/notes/${testNote._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(res.body.title).to.equal(updateData.title);
      expect(res.body.content).to.equal(updateData.content);
      expect(res.body.isPinned).to.equal(updateData.isPinned);
    });

    it('should return 404 for non-existent note', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const updateData = {
        title: 'Should not update',
        content: 'This should fail'
      };

      const res = await request(app)
        .put(`/api/notes/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(404);

      expect(res.body.message).to.include('Note not found');
    });

    it('should return error for unauthenticated request', async () => {
      const updateData = {
        title: 'Unauthorized Update',
        content: 'This should fail'
      };

      const res = await request(app)
        .put(`/api/notes/${testNote._id}`)
        .send(updateData)
        .expect(401);

      expect(res.body.message).to.include('User not authenticated');
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete a note for authenticated user', async () => {
      // Create a note to delete
      const noteToDelete = new Note({
        title: 'Note to delete',
        content: 'This note will be deleted',
        userId: testUser._id
      });
      await noteToDelete.save();

      const res = await request(app)
        .delete(`/api/notes/${noteToDelete._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(res.body.message).to.include('Note deleted successfully');

      // Verify note is deleted
      const deletedNote = await Note.findById(noteToDelete._id);
      expect(deletedNote).to.be.null;
    });

    it('should return 404 for non-existent note', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const res = await request(app)
        .delete(`/api/notes/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(res.body.message).to.include('Note not found');
    });

    it('should return error for unauthenticated request', async () => {
      const res = await request(app)
        .delete(`/api/notes/${testNote._id}`)
        .expect(401);

      expect(res.body.message).to.include('User not authenticated');
    });
  });
});