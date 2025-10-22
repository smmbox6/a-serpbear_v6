import { readFileSync } from 'fs';
import path from 'path';

describe('fflag map pack styles', () => {
   it('removes the sprite background from the map-pack badge', () => {
      const cssPath = path.join(process.cwd(), 'styles', 'fflag.css');
      const css = readFileSync(cssPath, 'utf8');
      const blockMatch = css.match(/\.fflag-map-pack\s*\{[^}]*\}/);

      expect(blockMatch).toBeTruthy();
      expect(blockMatch?.[0]).toMatch(/background-image:\s*none;/);
   });
});
