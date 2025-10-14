import { expect } from 'chai';
import sinon from 'sinon';
import { Note } from '../../models/Note.js';

describe('Note Model', () => {
  describe('Note Creation', () => {
    it('should create a new note with required fields', () => {
      const noteData = {
        title: 'Test Note',
        content: 'This is test content',
        userId: '507f1f77bcf86cd799439011'
      };

      const note = new Note(noteData);
      
      expect(note.title).to.equal(noteData.title);
      expect(note.content).to.equal(noteData.content);
      expect(note.userId.toString()).to.equal(noteData.userId);
    });

    it('should have isPinned as false by default', () => {
      const note = new Note({
        title: 'Test Note',
        content: 'Content',
        userId: '507f1f77bcf86cd799439011'
      });

      expect(note.isPinned).to.be.false;
    });

    it('should have empty tags array by default', () => {
      const note = new Note({
        title: 'Test Note',
        content: 'Content',
        userId: '507f1f77bcf86cd799439011'
      });

      expect(note.tags).to.be.an('array').that.is.empty;
    });

    it('should allow setting tags', () => {
      const note = new Note({
        title: 'Test Note',
        content: 'Content',
        userId: '507f1f77bcf86cd799439011',
        tags: ['work', 'important']
      });

      expect(note.tags).to.deep.equal(['work', 'important']);
    });

    it('should allow setting isPinned', () => {
      const note = new Note({
        title: 'Test Note',
        content: 'Content',
        userId: '507f1f77bcf86cd799439011',
        isPinned: true
      });

      expect(note.isPinned).to.be.true;
    });
  });

  describe('Note Validation', () => {
    it('should fail validation without userId', async () => {
      const note = new Note({
        title: 'Test Note',
        content: 'Content'
      });

      try {
        await note.validate();
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).to.equal('ValidationError');
        expect(error.errors.userId).to.exist;
      }
    });
  });

  describe('Note Schema Fields', () => {
    it('should have timestamps enabled', () => {
      const note = new Note({
        title: 'Test Note',
        content: 'Content',
        userId: '507f1f77bcf86cd799439011'
      });

      expect(note.schema.options.timestamps).to.be.true;
    });

    it('should allow null or undefined for optional fields', () => {
      const note = new Note({
        title: 'Test Note',
        userId: '507f1f77bcf86cd799439011'
      });

      // In Mongoose, optional fields may be null, undefined, or empty string
      const validContentValues = [null, undefined, ''];
      expect(validContentValues).to.include(note.content);
      
      // FolderId should be null or undefined when not set
      const validFolderValues = [null, undefined];
      expect(validFolderValues).to.include(note.folderId);
    });
  });
});
