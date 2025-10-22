/// <reference path="../../types.d.ts" />

import { render, screen } from '@testing-library/react';
import KeywordDetails from '../../components/keywords/KeywordDetails';
import { useFetchSingleKeyword } from '../../services/keywords';
import { dummyKeywords } from '../../__mocks__/data';

jest.mock('../../services/keywords', () => ({
   useFetchSingleKeyword: jest.fn(),
}));

jest.mock('../../components/common/Chart', () => () => <div data-testid="chart" />);

jest.mock('../../components/common/SelectField', () => ({ updateField }: any) => (
   <button type="button" data-testid="chart-range" onClick={() => updateField(['7'])}>
      Change Range
   </button>
));

jest.mock('../../hooks/useOnKey', () => jest.fn());

const useFetchSingleKeywordMock = useFetchSingleKeyword as unknown as jest.Mock;

describe('KeywordDetails', () => {
   it('renders stored SERP results immediately when no fresh data is returned', () => {
      useFetchSingleKeywordMock.mockReturnValue({ data: undefined });

      render(<KeywordDetails keyword={dummyKeywords[0] as KeywordType} closeDetails={jest.fn()} />);

      expect(screen.getByText('1. Compress Image Tool')).toBeInTheDocument();
      expect(screen.getByText('https://compressimage.io/')).toBeInTheDocument();
   });

   it('falls back to keyword.lastResult when fetched data omits search results', () => {
      useFetchSingleKeywordMock.mockReturnValue({ data: { history: dummyKeywords[0].history } });

      render(<KeywordDetails keyword={dummyKeywords[0] as KeywordType} closeDetails={jest.fn()} />);

      expect(screen.getByText('1. Compress Image Tool')).toBeInTheDocument();
      expect(screen.getByText('https://compressimage.io/')).toBeInTheDocument();
   });
});
