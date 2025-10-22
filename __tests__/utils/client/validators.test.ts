import { isValidEmail } from '../../../utils/client/validators';

describe('isValidEmail', () => {
   it('accepts valid email addresses', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@example.com')).toBe(true);
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
      expect(isValidEmail('user_name@example.org')).toBe(true);
      expect(isValidEmail('user-name@sub.example.com')).toBe(true);
   });

   it('rejects invalid email addresses', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('   ')).toBe(false);
      expect(isValidEmail('notanemail')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@.com')).toBe(false);
      expect(isValidEmail('user@example')).toBe(false);
      expect(isValidEmail('user example@test.com')).toBe(false);
   });

   it('handles edge cases', () => {
      expect(isValidEmail('user@example.c')).toBe(false); // TLD too short
      expect(isValidEmail('user@example.co')).toBe(true); // TLD exactly 2 chars
      expect(isValidEmail('a@b.com')).toBe(true); // Short but valid
   });

   it('trims whitespace before validation', () => {
      expect(isValidEmail('  user@example.com  ')).toBe(true);
      expect(isValidEmail('\tuser@example.com\n')).toBe(true);
   });

   it('rejects non-string inputs', () => {
      expect(isValidEmail(null as unknown as string)).toBe(false);
      expect(isValidEmail(undefined as unknown as string)).toBe(false);
      expect(isValidEmail(123 as unknown as string)).toBe(false);
   });
});
