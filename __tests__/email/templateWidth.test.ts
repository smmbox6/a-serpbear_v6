import { readFileSync } from 'fs';
import path from 'path';

const loadTemplate = (): string => {
  const templatePath = path.join(process.cwd(), 'email', 'email.html');
  return readFileSync(templatePath, 'utf8');
};

const extractBlock = (template: string, selector: string): string | undefined => {
  const regex = new RegExp(String.raw`${selector}\s*\{[\s\S]*?\n\s*\}`, 'm');
  const match = template.match(regex);
  return match?.[0];
};

describe('notification email template layout', () => {
  const template = loadTemplate();

  it('expands the container width for digest tables', () => {
    const containerBlock = extractBlock(template, '\\.' + 'container');

    expect(containerBlock).toBeTruthy();
    expect(containerBlock?.trim()).toBe(`.container {
        display: block;
        margin: 0 auto !important;
        /* makes it centered */
        max-width: 720px;
        padding: 10px;
        width: 100%;
      }`);
  });

  it('mirrors the wider layout on the content wrapper', () => {
    const contentBlock = extractBlock(template, '\\.' + 'content');

    expect(contentBlock).toBeTruthy();
    expect(contentBlock?.trim()).toBe(`.content {
        box-sizing: border-box;
        display: block;
        margin: 0 auto;
        max-width: 720px;
        padding: 10px;
        width: 100%;
      }`);
  });
});
