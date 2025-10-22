import { readFileSync } from 'fs';
import path from 'path';

describe('email template Search Console styles', () => {
  const templatePath = path.join(__dirname, '..', '..', 'email', 'email.html');
  const template = readFileSync(templatePath, 'utf-8');

  it('scopes tracker keyword column styles away from Search Console tables', () => {
    expect(template).toContain('.keyword_table:not(.keyword_table--sc) .keyword td:nth-child(1){');
    expect(template).toContain('.keyword_table:not(.keyword_table--sc) .keyword td:nth-child(2){');
    expect(template).toContain('.keyword_table:not(.keyword_table--sc) .keyword td:nth-child(4){');
  });

  it('widens and left-aligns the Search Console label column', () => {
    const firstColumnBlock = template.match(/\.keyword_table--sc th:first-child,[\s\S]*?\.keyword_table--sc td:first-child\{[\s\S]*?\}/);

    expect(firstColumnBlock).toBeTruthy();
    expect(firstColumnBlock?.[0]).toContain('text-align: left;');
    expect(firstColumnBlock?.[0]).toContain('width: 220px;');
    expect(firstColumnBlock?.[0]).toContain('padding-right: 16px;');
  });

  it('right-aligns Search Console metric columns for consistent number stacking', () => {
    const metricColumnsBlock = template.match(/\.keyword_table--sc th:nth-child\(2\),[\s\S]*?\.keyword_table--sc td:nth-child\(4\)\{[\s\S]*?\}/);

    expect(metricColumnsBlock).toBeTruthy();
    expect(metricColumnsBlock?.[0]).toContain('text-align: right;');
    expect(metricColumnsBlock?.[0]).toContain('width: 90px;');
  });
});
