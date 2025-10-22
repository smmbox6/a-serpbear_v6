import type { NextApiRequest } from 'next';
import isRequestSecure from '../../../utils/api/isRequestSecure';

const createMockRequest = (headers: Record<string, string | string[]>, encrypted?: boolean): NextApiRequest => {
   const socket = encrypted !== undefined ? { encrypted } : undefined;
   return {
      headers,
      socket,
   } as unknown as NextApiRequest;
};

describe('isRequestSecure', () => {
   it('returns true when x-forwarded-proto is exactly "https"', () => {
      const req = createMockRequest({ 'x-forwarded-proto': 'https' });
      expect(isRequestSecure(req)).toBe(true);
   });

   it('returns false when x-forwarded-proto is exactly "http"', () => {
      const req = createMockRequest({ 'x-forwarded-proto': 'http' });
      expect(isRequestSecure(req)).toBe(false);
   });

   it('returns true when x-forwarded-proto contains https in comma-delimited list', () => {
      const req = createMockRequest({ 'x-forwarded-proto': 'https,http' });
      expect(isRequestSecure(req)).toBe(true);
   });

   it('returns true when x-forwarded-proto has https as second value in comma-delimited list', () => {
      const req = createMockRequest({ 'x-forwarded-proto': 'http,https' });
      expect(isRequestSecure(req)).toBe(true);
   });

   it('returns false when x-forwarded-proto is comma-delimited but contains no https', () => {
      const req = createMockRequest({ 'x-forwarded-proto': 'http,http' });
      expect(isRequestSecure(req)).toBe(false);
   });

   it('handles comma-delimited values with spaces', () => {
      const req = createMockRequest({ 'x-forwarded-proto': 'https, http' });
      expect(isRequestSecure(req)).toBe(true);
   });

   it('returns true when x-forwarded-proto is an array containing https', () => {
      const req = createMockRequest({ 'x-forwarded-proto': ['https', 'http'] });
      expect(isRequestSecure(req)).toBe(true);
   });

   it('returns false when x-forwarded-proto is an array without https', () => {
      const req = createMockRequest({ 'x-forwarded-proto': ['http', 'http'] });
      expect(isRequestSecure(req)).toBe(false);
   });

   it('returns true when x-forwarded-protocol is https', () => {
      const req = createMockRequest({ 'x-forwarded-protocol': 'https' });
      expect(isRequestSecure(req)).toBe(true);
   });

   it('returns true when x-forwarded-ssl is on', () => {
      const req = createMockRequest({ 'x-forwarded-ssl': 'on' });
      expect(isRequestSecure(req)).toBe(true);
   });

   it('returns true when socket is encrypted', () => {
      const req = createMockRequest({}, true);
      expect(isRequestSecure(req)).toBe(true);
   });

   it('returns false when socket is not encrypted', () => {
      const req = createMockRequest({}, false);
      expect(isRequestSecure(req)).toBe(false);
   });

   it('returns false when no secure indicators are present', () => {
      const req = createMockRequest({});
      expect(isRequestSecure(req)).toBe(false);
   });

   it('is case-insensitive for header values', () => {
      const req1 = createMockRequest({ 'x-forwarded-proto': 'HTTPS' });
      expect(isRequestSecure(req1)).toBe(true);

      const req2 = createMockRequest({ 'x-forwarded-proto': 'HTTPS,HTTP' });
      expect(isRequestSecure(req2)).toBe(true);

      const req3 = createMockRequest({ 'x-forwarded-ssl': 'ON' });
      expect(isRequestSecure(req3)).toBe(true);
   });
});
