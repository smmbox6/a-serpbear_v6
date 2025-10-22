import { SCsortKeywords } from '../../../utils/client/SCsortFilter';

describe('SCsortKeywords', () => {
   const createKeyword = (overrides: Partial<SCKeywordType>): SCKeywordType => ({
      uid: `${Math.random()}`,
      keyword: 'term',
      country: 'US',
      device: 'desktop',
      position: 10,
      impressions: 10,
      clicks: 1,
      ctr: 0.1,
      ...overrides,
   });

   it('sorts impression metrics asc/desc correctly', () => {
      const keywords = [
         createKeyword({ uid: 'a', impressions: 100 }),
         createKeyword({ uid: 'b', impressions: 10 }),
      ];
      expect(SCsortKeywords(keywords, 'imp_asc').map((k) => k.uid)).toEqual(['b', 'a']);
      expect(SCsortKeywords(keywords, 'imp_desc').map((k) => k.uid)).toEqual(['a', 'b']);
   });

   it('sorts visits asc/desc correctly', () => {
      const keywords = [
         createKeyword({ uid: 'a', clicks: 5 }),
         createKeyword({ uid: 'b', clicks: 20 }),
      ];
      expect(SCsortKeywords(keywords, 'visits_asc').map((k) => k.uid)).toEqual(['a', 'b']);
      expect(SCsortKeywords(keywords, 'visits_desc').map((k) => k.uid)).toEqual(['b', 'a']);
   });

   it('sorts ctr asc/desc correctly', () => {
      const keywords = [
         createKeyword({ uid: 'a', ctr: 0.05 }),
         createKeyword({ uid: 'b', ctr: 0.25 }),
      ];
      expect(SCsortKeywords(keywords, 'ctr_asc').map((k) => k.uid)).toEqual(['a', 'b']);
      expect(SCsortKeywords(keywords, 'ctr_desc').map((k) => k.uid)).toEqual(['b', 'a']);
   });

   it('sorts position asc/desc handling zero position gracefully', () => {
      const keywords = [
         createKeyword({ uid: 'a', position: 0 }),
         createKeyword({ uid: 'b', position: 3 }),
         createKeyword({ uid: 'c', position: 12 }),
      ];
      expect(SCsortKeywords(keywords, 'pos_asc').map((k) => k.uid)).toEqual(['b', 'c', 'a']);
      expect(SCsortKeywords(keywords, 'pos_desc').map((k) => k.uid)).toEqual(['a', 'c', 'b']);
   });

   it('sorts alphabetically', () => {
      const keywords = [
         createKeyword({ uid: 'a', keyword: 'zeta' }),
         createKeyword({ uid: 'b', keyword: 'alpha' }),
      ];
      expect(SCsortKeywords(keywords, 'alpha_asc').map((k) => k.uid)).toEqual(['b', 'a']);
      expect(SCsortKeywords(keywords, 'alpha_desc').map((k) => k.uid)).toEqual(['a', 'b']);
   });
});
