import { validateEmail, validatePassword, validateUsername, validateConfirmPassword } from '../../src/utils/helper';

describe('Helper Functions', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('should accept passwords with 6 or more characters', () => {
      expect(validatePassword('123456')).toBe(true);
      expect(validatePassword('password')).toBe(true);
      expect(validatePassword('verylongpassword123')).toBe(true);
    });

    it('should reject passwords with less than 6 characters', () => {
      expect(validatePassword('12345')).toBe(false);
      expect(validatePassword('pass')).toBe(false);
      expect(validatePassword('')).toBe(false);
    });
  });

  describe('validateUsername', () => {
    it('should accept usernames with 3 or more characters', () => {
      expect(validateUsername('abc')).toBe(true);
      expect(validateUsername('username')).toBe(true);
      expect(validateUsername('very long username')).toBe(true);
    });

    it('should reject usernames with less than 3 characters', () => {
      expect(validateUsername('ab')).toBe(false);
      expect(validateUsername('a')).toBe(false);
      expect(validateUsername('')).toBe(false);
    });
  });

  describe('validateConfirmPassword', () => {
    it('should return true when passwords match', () => {
      expect(validateConfirmPassword('password123', 'password123')).toBe(true);
      expect(validateConfirmPassword('test', 'test')).toBe(true);
    });

    it('should return false when passwords do not match', () => {
      expect(validateConfirmPassword('password123', 'password456')).toBe(false);
      expect(validateConfirmPassword('test', 'Test')).toBe(false);
      expect(validateConfirmPassword('', 'password')).toBe(false);
    });
  });
});
