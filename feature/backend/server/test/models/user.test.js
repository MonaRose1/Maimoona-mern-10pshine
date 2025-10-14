import { expect } from 'chai';
import sinon from 'sinon';
import { User } from '../../models/User.js';

describe('User Model', () => {
  describe('User Creation', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      
      expect(user.name).to.equal(userData.name);
      expect(user.email).to.equal(userData.email);
      expect(user.password).to.equal(userData.password);
    });

    it('should have secretPin as null by default', () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      expect(user.secretPin).to.be.null;
    });

    it('should allow setting secretPin', () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        secretPin: '1234'
      });

      expect(user.secretPin).to.equal('1234');
    });
  });

  describe('User Validation', () => {
    it('should fail validation without name', async () => {
      const user = new User({
        email: 'test@example.com',
        password: 'password123'
      });

      try {
        await user.validate();
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).to.equal('ValidationError');
        expect(error.errors.name).to.exist;
      }
    });

    it('should fail validation without email', async () => {
      const user = new User({
        name: 'Test User',
        password: 'password123'
      });

      try {
        await user.validate();
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).to.equal('ValidationError');
        expect(error.errors.email).to.exist;
      }
    });

    it('should fail validation with password less than 6 characters', async () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: '12345'
      });

      try {
        await user.validate();
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error.name).to.equal('ValidationError');
      }
    });
  });

  describe('User Schema Fields', () => {
    it('should have timestamps when enabled', () => {
      const user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });

      // Note: createdAt and updatedAt are only set after save()
      expect(user.schema.options.timestamps).to.be.true;
    });
  });
});
