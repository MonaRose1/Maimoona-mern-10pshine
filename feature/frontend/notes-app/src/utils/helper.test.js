import { validateEmail } from './helper';

describe('validateEmail', () => {
  it('accepts valid emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name+tag@domain.co')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('no-at.com')).toBe(false);
    expect(validateEmail('a@b')).toBe(false);
  });
});
