import { useQuery } from 'react-query';
import { useFetchKeywordIdeas } from '../../services/adwords';

jest.mock('react-query', () => ({
   useQuery: jest.fn(),
}));

describe('useFetchKeywordIdeas', () => {
   const useQueryMock = useQuery as unknown as jest.Mock;

   beforeEach(() => {
      useQueryMock.mockClear();
      useQueryMock.mockReturnValue({ data: null });
   });

   it('disables the query when Ads is disconnected', () => {
      const router = { pathname: '/domain/ideas/example', query: { slug: 'example' } } as any;

      useFetchKeywordIdeas(router, false);

      expect(useQueryMock).toHaveBeenCalledWith(
         'keywordIdeas-example',
         expect.any(Function),
         expect.objectContaining({ enabled: false, retry: false }),
      );
   });

   it('disables the research query when Ads is disconnected', () => {
      const router = { pathname: '/research', query: {} } as any;

      useFetchKeywordIdeas(router, false);

      expect(useQueryMock).toHaveBeenCalledWith(
         'keywordIdeas-research',
         expect.any(Function),
         expect.objectContaining({ enabled: false, retry: false }),
      );
   });

   it('enables keyword ideas when Ads is connected', () => {
      const router = { pathname: '/domain/ideas/example', query: { slug: 'example' } } as any;

      useFetchKeywordIdeas(router, true);

      expect(useQueryMock).toHaveBeenCalledWith(
         'keywordIdeas-example',
         expect.any(Function),
         expect.objectContaining({ enabled: true, retry: false }),
      );
   });
});
