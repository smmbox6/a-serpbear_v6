import parseKeywords from '../../utils/parseKeywords';

describe('parseKeywords', () => {
   const buildKeyword = (overrides: Partial<Record<string, any>> = {}) => ({
      ID: 1,
      keyword: 'example keyword',
      device: 'desktop',
      country: 'US',
      domain: 'example.com',
      lastUpdated: '2025-01-01T00:00:00.000Z',
      added: '2025-01-01T00:00:00.000Z',
      position: 5,
      volume: 100,
      sticky: true,
      history: JSON.stringify({ '2025-01-01': 5 }),
      lastResult: JSON.stringify([]),
      url: 'https://example.com/page',
      tags: JSON.stringify(['tag']),
      updating: false,
      lastUpdateError: 'false',
      mapPackTop3: false,
      ...overrides,
   });

   it('normalises falsy boolean variants to false', () => {
      const [keyword] = parseKeywords([
         buildKeyword({ updating: '0', sticky: 'no', mapPackTop3: 'false' }) as any,
      ]);

      expect(keyword.updating).toBe(false);
      expect(keyword.sticky).toBe(false);
      expect(keyword.mapPackTop3).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(keyword, 'mapPackTop3')).toBe(true);
   });

   it('normalises truthy boolean variants to true', () => {
      const [keyword] = parseKeywords([
         buildKeyword({ updating: '1', sticky: 'YES', mapPackTop3: 1 }) as any,
      ]);

      expect(keyword.updating).toBe(true);
      expect(keyword.sticky).toBe(true);
      expect(keyword.mapPackTop3).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(keyword, 'mapPackTop3')).toBe(true);
   });

   it('keeps existing keyword structure intact', () => {
      const [keyword] = parseKeywords([buildKeyword({ updating: 0 }) as any]);

      expect(keyword.history).toEqual({ '2025-01-01': 5 });
      expect(keyword.tags).toEqual(['tag']);
      expect(keyword.lastResult).toEqual([]);
      expect(keyword.location).toBe('');
   });

   it('returns false for missing mapPackTop3 flag', () => {
      const [{ mapPackTop3 }] = parseKeywords([
         buildKeyword({ mapPackTop3: undefined }) as any,
      ]);

      expect(mapPackTop3).toBe(false);
   });
});
