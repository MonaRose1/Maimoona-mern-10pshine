import { expect } from 'chai';
import { SecretNote } from '../../models/SecretNote.js';

describe('SecretNote Model', () => {
  describe('SecretNote Creation', () => {
    it('should create a new secret note with required fields', () => {
      const noteData = {
        title: 'Secret Test Note',
        content: 'This is secret test content',
        userId: '507f1f77bcf86cd799439011'
      };

      const secretNote = new SecretNote(noteData);
      
      expect(secretNote.title).to.equal(noteData.title);
      expect(secretNote.content).to.equal(noteData.content);
      expect(secretNote.userId.toString()).to.equal(noteData.userId);
    });

    it('should have isPinned as false by default', () => {
      const secretNote = new SecretNote({
        title: 'Secret Test Note',
        content: 'Content',
        userId: '507f1f77bcf86cd799439011'
      });

      expect(secretNote.isPinned).to.be.false;
    });

    it('should have empty tags array by default', () => {
      const secretNote = new SecretNote({
        title: 'Secret Test Note',
        content: 'Content',
        userId: '507f1f77bcf86cd799439011'
      });

      expect(secretNote.tags).to.be.an('array').that.is.empty;
    });

    it('should allow setting tags', () => {
      const secretNote = new SecretNote({
        title: 'Secret Test Note',
        content: 'Content',
        userId: '507f1f77bcf86cd799439011',
        tags: ['secret', 'confidential']
      });

      expect(secretNote.tags).to.deep.equal(['secret', 'confidential']);
    });

    it('should allow setting isPinned', () => {
      const secretNote = new SecretNote({
        title: 'Secret Test Note',
        content: 'Content',
        userId: '507f1f77bcf86cd799439011',
        isPinned: true
      });

      expect(secretNote.isPinned).to.be.true;
    });
  });

  describe('SecretNote Validation', () => {
    it('should fail validation without userId', async () => {
      const secretNote = new SecretNote({
        title: 'Secret Test Note',
        content: 'Content'
      });

      try {
        await secretNote.validate();
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).to.equal('ValidationError');
        expect(error.errors.userId).to.exist;
      }
    });
  });

  describe('SecretNote Schema Fields', () => {
    it('should have timestamps enabled', () => {
      const secretNote = new SecretNote({
        title: 'Secret Test Note',
        content: 'Content',
        userId: '507f1f77bcf86cd799439011'
      });

      expect(secretNote.schema.options.timestamps).to.be.true;
    });

    it('should allow null or undefined for optional fields', () => {
      const secretNote = new SecretNote({
        title: 'Secret Test Note',
        userId: '507f1f77bcf86cd799439011'
      });

      // In Mongoose, optional fields may be null, undefined, or empty string
      const validContentValues = [null, undefined, ''];
      expect(validContentValues).to.include(secretNote.content);
      
      // FolderId should be null or undefined when not set
      const validFolderValues = [null, undefined];
      expect(validFolderValues).to.include(secretNote.folderId);
    });
  });
});