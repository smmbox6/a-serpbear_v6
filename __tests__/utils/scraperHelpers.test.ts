import { resolveCountryCode } from '../../utils/scraperHelpers';
import countries from '../../utils/countries';

describe('resolveCountryCode', () => {
   it('returns uppercase for valid country codes', () => {
      expect(resolveCountryCode('us')).toBe('US');
      expect(resolveCountryCode('US')).toBe('US');
      expect(resolveCountryCode('Ca')).toBe('CA');
   });

   it('returns uppercase that works with countries object lookup', () => {
      // Test that lowercase input returns uppercase that can be used with countries object
      const country = resolveCountryCode('de');
      expect(country).toBe('DE');
      expect(countries[country]).toBeDefined();
      expect(countries[country][0]).toBe('Germany');

      // Test with multiple lowercase inputs
      const frCountry = resolveCountryCode('fr');
      expect(frCountry).toBe('FR');
      expect(countries[frCountry]).toBeDefined();
      
      const gbCountry = resolveCountryCode('gb');
      expect(gbCountry).toBe('GB');
      expect(countries[gbCountry]).toBeDefined();
   });

   it('falls back to default for unsupported codes without allowed list', () => {
      expect(resolveCountryCode('ZZ')).toBe('US');
   });

   it('uses provided fallback when valid', () => {
      expect(resolveCountryCode('zz', undefined, 'gb')).toBe('GB');
   });

   it('prefers fallback when allowed countries provided and contains fallback', () => {
      expect(resolveCountryCode('zz', ['US', 'CA'], 'us')).toBe('US');
   });

   it('falls back to first valid allowed country when fallback is not permitted', () => {
      expect(resolveCountryCode('zz', ['DE', 'FR'], 'BR')).toBe('DE');
   });
});
