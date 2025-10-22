import { getSelectedUntrackedKeywords } from '../../../utils/client/helpers';

describe('getSelectedUntrackedKeywords', () => {
   it('filters keywords to include only selected and untracked items', () => {
      const keywords = [
         { uid: '1', keyword: 'keyword1', isTracked: false },
         { uid: '2', keyword: 'keyword2', isTracked: true },
         { uid: '3', keyword: 'keyword3', isTracked: false },
         { uid: '4', keyword: 'keyword4', isTracked: true },
      ];

      const selectedIds = ['1', '2', '3'];

      const result = getSelectedUntrackedKeywords(keywords, selectedIds);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ uid: '1', isTracked: false });
      expect(result[1]).toMatchObject({ uid: '3', isTracked: false });
   });

   it('returns empty array when no keywords are selected', () => {
      const keywords = [
         { uid: '1', keyword: 'keyword1', isTracked: false },
         { uid: '2', keyword: 'keyword2', isTracked: true },
      ];

      const result = getSelectedUntrackedKeywords(keywords, []);

      expect(result).toHaveLength(0);
   });

   it('returns empty array when all selected keywords are tracked', () => {
      const keywords = [
         { uid: '1', keyword: 'keyword1', isTracked: true },
         { uid: '2', keyword: 'keyword2', isTracked: true },
      ];

      const selectedIds = ['1', '2'];

      const result = getSelectedUntrackedKeywords(keywords, selectedIds);

      expect(result).toHaveLength(0);
   });

   it('returns all selected keywords when none are tracked', () => {
      const keywords = [
         { uid: '1', keyword: 'keyword1', isTracked: false },
         { uid: '2', keyword: 'keyword2', isTracked: false },
         { uid: '3', keyword: 'keyword3', isTracked: false },
      ];

      const selectedIds = ['1', '3'];

      const result = getSelectedUntrackedKeywords(keywords, selectedIds);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({ uid: '1', isTracked: false });
      expect(result[1]).toMatchObject({ uid: '3', isTracked: false });
   });

   it('handles keywords with additional properties', () => {
      interface ExtendedKeyword {
         uid: string;
         isTracked: boolean;
         keyword: string;
         country: string;
         competition: string;
      }

      const keywords: ExtendedKeyword[] = [
         { uid: '1', keyword: 'test1', isTracked: false, country: 'US', competition: 'HIGH' },
         { uid: '2', keyword: 'test2', isTracked: true, country: 'CA', competition: 'LOW' },
      ];

      const selectedIds = ['1', '2'];

      const result = getSelectedUntrackedKeywords(keywords, selectedIds);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
         uid: '1',
         isTracked: false,
         keyword: 'test1',
         country: 'US',
         competition: 'HIGH',
      });
   });
});