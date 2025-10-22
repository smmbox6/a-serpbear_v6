import {
   trimStringProperties,
   safeTrim,
   hasTrimmedLength
} from '../../utils/security';

describe('Security Utilities', () => {
   describe('trimStringProperties', () => {
      it('should trim all string properties in an object', () => {
         const input = {
            stringProp: '  trimmed  ',
            anotherString: '\twhitespace\n',
            numberProp: 123,
            booleanProp: true,
            nullProp: null,
            undefinedProp: undefined
         };

         const result = trimStringProperties(input);

         expect(result.stringProp).toBe('trimmed');
         expect(result.anotherString).toBe('whitespace');
         expect(result.numberProp).toBe(123);
         expect(result.booleanProp).toBe(true);
         expect(result.nullProp).toBe(null);
         expect(result.undefinedProp).toBe(undefined);
      });

      it('should not modify the original object', () => {
         const input = {
            stringProp: '  original  ',
            numberProp: 456
         };

         const result = trimStringProperties(input);

         expect(input.stringProp).toBe('  original  ');
         expect(result.stringProp).toBe('original');
         expect(input).not.toBe(result);
      });

      it('should handle empty objects', () => {
         const result = trimStringProperties({});
         expect(result).toEqual({});
      });

      it('should handle objects with only non-string properties', () => {
         const input = {
            numberProp: 123,
            booleanProp: false,
            arrayProp: [1, 2, 3]
         };

         const result = trimStringProperties(input);
         expect(result).toEqual(input);
         expect(result).not.toBe(input); // Should still be a copy
      });
   });

   describe('safeTrim', () => {
      it('should trim string values', () => {
         expect(safeTrim('  hello  ')).toBe('hello');
         expect(safeTrim('\t\nworld\r\n')).toBe('world');
      });

      it('should handle numeric values by converting to string', () => {
         expect(safeTrim(587)).toBe('587');
         expect(safeTrim(0)).toBe('0');
         expect(safeTrim(-42)).toBe('-42');
      });

      it('should handle null and undefined values', () => {
         expect(safeTrim(null)).toBe('');
         expect(safeTrim(undefined)).toBe('');
      });

      it('should handle boolean values', () => {
         expect(safeTrim(true)).toBe('true');
         expect(safeTrim(false)).toBe('false');
      });

      it('should handle object values by converting to string', () => {
         expect(safeTrim({})).toBe('[object Object]');
         expect(safeTrim([])).toBe('');
      });
   });

   describe('hasTrimmedLength', () => {
      it('should return true for non-empty trimmed strings', () => {
         expect(hasTrimmedLength('hello')).toBe(true);
         expect(hasTrimmedLength('  world  ')).toBe(true);
         expect(hasTrimmedLength('\ttest\n')).toBe(true);
      });

      it('should return false for empty or whitespace-only strings', () => {
         expect(hasTrimmedLength('')).toBe(false);
         expect(hasTrimmedLength('   ')).toBe(false);
         expect(hasTrimmedLength('\t\n\r ')).toBe(false);
      });

      it('should handle numeric values correctly', () => {
         expect(hasTrimmedLength(587)).toBe(true);
         expect(hasTrimmedLength(0)).toBe(true);
         expect(hasTrimmedLength(-1)).toBe(true);
      });

      it('should handle null and undefined values', () => {
         expect(hasTrimmedLength(null)).toBe(false);
         expect(hasTrimmedLength(undefined)).toBe(false);
      });

      it('should handle boolean values', () => {
         expect(hasTrimmedLength(true)).toBe(true);
         expect(hasTrimmedLength(false)).toBe(true);
      });
   });
});
