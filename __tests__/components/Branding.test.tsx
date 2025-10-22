import { render } from '@testing-library/react';
import { DEFAULT_BRANDING, BrandingConfig } from '../../utils/branding';
import { useBranding } from '../../hooks/useBranding';

jest.mock('../../hooks/useBranding');

const mockUseBranding = useBranding as jest.MockedFunction<typeof useBranding>;

const buildBrandingState = (branding: BrandingConfig) => ({
   branding,
   isLoading: false,
   isError: false,
   isFetching: false,
   refetch: jest.fn(),
});

describe('Branding components', () => {
   beforeEach(() => {
      mockUseBranding.mockReturnValue(buildBrandingState(DEFAULT_BRANDING));
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   it('falls back to the default icon when white-label is disabled', async () => {
      const brandingModule = await import('../../components/common/Branding');
      const { BrandTitle } = brandingModule;
      const { container } = render(<BrandTitle />);
      expect(container.querySelector('svg')).toBeInTheDocument();
   });

   it('renders the custom logo and platform name when white-label is enabled', async () => {
      const customBranding: BrandingConfig = {
         ...DEFAULT_BRANDING,
         whiteLabelEnabled: true,
         platformName: 'Acme Rankings',
         logoFile: 'brand.svg',
         logoMimeType: 'image/svg+xml',
         hasCustomLogo: true,
      };
      mockUseBranding.mockReturnValue(buildBrandingState(customBranding));

      const brandingModule = await import('../../components/common/Branding');
      const { BrandTitle } = brandingModule;
      const { getByAltText } = render(<BrandTitle />);
      const logo = getByAltText('Acme Rankings logo') as HTMLImageElement;
      expect(logo).toBeInTheDocument();
      expect(logo.src).toContain('/api/branding/logo');
   });
});
