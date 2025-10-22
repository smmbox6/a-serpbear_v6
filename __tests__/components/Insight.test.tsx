/// <reference path="../../types.d.ts" />

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import Insight from '../../components/insight/Insight';

jest.mock('react-chartjs-2', () => ({
   Line: () => null,
}));

describe('Insight component', () => {
   const insightData: InsightDataType = {
      stats: [],
      keywords: [
         {
            keyword: 'first keyword',
            clicks: 10,
            impressions: 100,
            ctr: 5,
            position: 2,
         },
         {
            keyword: 'second keyword',
            clicks: 20,
            impressions: 200,
            ctr: 10,
            position: 3,
         },
      ],
      countries: [],
      pages: [],
   };

   const domain = {
      domain: 'example.com',
   } as unknown as DomainType;

   it('omits the bottom border on the final insight row', () => {
      const { container } = render(
         <Insight
            domain={domain}
            insight={insightData}
            isLoading={false}
            isConsoleIntegrated={false}
         />,
      );

      const keywordsTab = screen.getAllByText(/keywords/i).find((element) => element.tagName.toLowerCase() === 'i');
      expect(keywordsTab).toBeDefined();
      fireEvent.click(keywordsTab as HTMLElement);

      const table = container.querySelector('.domKeywords_keywords');
      const rows = table ? table.querySelectorAll('div.keyword') : null;
      expect(rows && rows.length).toBe(2);

      const firstRow = rows?.[0] as HTMLElement;
      const lastRow = rows?.[rows.length - 1] as HTMLElement;
      expect(firstRow).toBeTruthy();
      expect(lastRow).toBeTruthy();

      expect(firstRow.className).not.toContain('border-b-0');
      expect(lastRow.className).toContain('border-b-0');
   });
});
