import fs from 'fs';
import path from 'path';

describe('Breakpoint Consistency', () => {
   const EXPECTED_MOBILE_BREAKPOINT = '767px';

   it('should use consistent mobile breakpoint across hooks and CSS', () => {
      const hookPath = path.join(process.cwd(), 'hooks', 'useIsMobile.tsx');
      const cssPath = path.join(process.cwd(), 'styles', 'globals.css');

      const hookContent = fs.readFileSync(hookPath, 'utf8');
      const cssContent = fs.readFileSync(cssPath, 'utf8');

      // Extract breakpoints from hook
      const hookBreakpoints = hookContent.match(/max-width:\s*(\d+px)/g) || [];
      
      // Extract breakpoints from CSS
      const cssBreakpoints = cssContent.match(/max-width:\s*(\d+px)/g) || [];

      // Check that all hook breakpoints are using the expected value
      hookBreakpoints.forEach(breakpoint => {
         expect(breakpoint).toContain(EXPECTED_MOBILE_BREAKPOINT);
      });

      // Check that CSS mobile breakpoints (not larger desktop ones) are using the expected value
      cssBreakpoints.forEach(breakpoint => {
         const pixelValue = breakpoint.match(/(\d+)px/)?.[1];
         // Only validate mobile breakpoints (below 800px), ignore larger desktop breakpoints
         if (pixelValue && parseInt(pixelValue) < 800) {
            expect(breakpoint).toContain(EXPECTED_MOBILE_BREAKPOINT);
         }
      });
   });

   it('should not contain any legacy 760px breakpoints', () => {
      const hookPath = path.join(process.cwd(), 'hooks', 'useIsMobile.tsx');
      const cssPath = path.join(process.cwd(), 'styles', 'globals.css');

      const hookContent = fs.readFileSync(hookPath, 'utf8');
      const cssContent = fs.readFileSync(cssPath, 'utf8');

      // Ensure no 760px breakpoints exist
      expect(hookContent).not.toContain('760px');
      expect(cssContent).not.toMatch(/max-width:\s*760px/);
   });
});