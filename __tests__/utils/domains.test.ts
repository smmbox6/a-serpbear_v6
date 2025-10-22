import getdomainStats from '../../utils/domains';
import Keyword from '../../database/models/keyword';
import parseKeywords from '../../utils/parseKeywords';
import { readLocalSCData } from '../../utils/searchConsole';

jest.mock('../../database/models/keyword', () => ({
  __esModule: true,
  default: { findAll: jest.fn() },
}));

jest.mock('../../utils/parseKeywords', () => ({ __esModule: true, default: jest.fn() }));

jest.mock('../../utils/searchConsole', () => ({
  __esModule: true,
  readLocalSCData: jest.fn(),
}));

const mockFindAll = (Keyword as any).findAll as jest.Mock;
const mockParseKeywords = parseKeywords as jest.Mock;
const mockReadLocalSCData = readLocalSCData as jest.Mock;

describe('getdomainStats', () => {
  beforeEach(() => {
    mockFindAll.mockReset();
    mockParseKeywords.mockReset();
    mockReadLocalSCData.mockReset();
  });

  it('omits avgPosition and mapPackKeywords when the domain lacks persisted values', async () => {
    mockFindAll.mockResolvedValue([]);
    mockParseKeywords.mockReturnValue([]);
    mockReadLocalSCData.mockResolvedValue(null);

    const domain = {
      ID: 1,
      domain: 'example.com',
      slug: 'example-com',
      notification: false,
      notification_interval: '',
      notification_emails: '',
      lastUpdated: new Date().toISOString(),
      added: new Date().toISOString(),
    } as any;

    const result = await getdomainStats([domain]);

    expect(result[0].keywordsTracked).toBe(0);
    expect(result[0].avgPosition).toBeUndefined();
    expect(result[0].mapPackKeywords).toBeUndefined();
  });

  it('does not recompute stats from keywords when persisted values are missing', async () => {
    const mockKeywordData = [
      { get: () => ({ ID: 1, position: 5, lastUpdated: '2023-01-01', mapPackTop3: true }) },
      { get: () => ({ ID: 2, position: 15, lastUpdated: '2023-01-02', mapPackTop3: false }) },
      { get: () => ({ ID: 3, position: 10, lastUpdated: '2023-01-03', mapPackTop3: true }) },
    ];

    const parsedKeywords = [
      { ID: 1, position: 5, lastUpdated: '2023-01-01', mapPackTop3: true },
      { ID: 2, position: 15, lastUpdated: '2023-01-02', mapPackTop3: false },
      { ID: 3, position: 10, lastUpdated: '2023-01-03', mapPackTop3: true },
    ];

    mockFindAll.mockResolvedValue(mockKeywordData);
    mockParseKeywords.mockReturnValue(parsedKeywords);
    mockReadLocalSCData.mockResolvedValue(null);

    const domain = {
      ID: 1,
      domain: 'example.com',
      slug: 'example-com',
      notification: false,
      notification_interval: '',
      notification_emails: '',
      lastUpdated: '2023-01-01T00:00:00.000Z',
      added: '2023-01-01T00:00:00.000Z',
    } as any;

    const result = await getdomainStats([domain]);

    expect(result[0].keywordsTracked).toBe(3);
    expect(result[0].avgPosition).toBeUndefined();
    expect(result[0].mapPackKeywords).toBeUndefined();
    expect(result[0].keywordsUpdated).toBe('2023-01-03T00:00:00.000Z');
  });

  it('uses persisted avgPosition and mapPackKeywords from domain when available', async () => {
    const parsedKeywords = [
      { ID: 1, position: 5, lastUpdated: '2023-01-01', mapPackTop3: true },
      { ID: 2, position: 15, lastUpdated: '2023-01-02', mapPackTop3: false },
    ];

    mockFindAll.mockResolvedValue([]);
    mockParseKeywords.mockReturnValue(parsedKeywords);
    mockReadLocalSCData.mockResolvedValue(null);

    const domain = {
      ID: 1,
      domain: 'persisted.com',
      slug: 'persisted-com',
      notification: false,
      notification_interval: '',
      notification_emails: '',
      lastUpdated: '2023-01-01T00:00:00.000Z',
      added: '2023-01-01T00:00:00.000Z',
      avgPosition: 7, // Persisted value
      mapPackKeywords: 3, // Persisted value
    } as any;

    const result = await getdomainStats([domain]);

    expect(result[0].keywordsTracked).toBe(2);
    expect(result[0].avgPosition).toBe(7); // Uses persisted value from domain
    expect(result[0].mapPackKeywords).toBe(3); // Uses persisted value from domain
  });

  it('removes invalid persisted stats when values are zero or non-numeric', async () => {
    mockFindAll.mockResolvedValue([]);
    mockParseKeywords.mockReturnValue([]);
    mockReadLocalSCData.mockResolvedValue(null);

    const domain = {
      ID: 1,
      domain: 'stale-stats.com',
      slug: 'stale-stats-com',
      notification: false,
      notification_interval: '',
      notification_emails: '',
      lastUpdated: '2023-01-01T00:00:00.000Z',
      added: '2023-01-01T00:00:00.000Z',
      avgPosition: 0,
      mapPackKeywords: Number.NaN,
    } as any;

    const result = await getdomainStats([domain]);

    expect(result[0].avgPosition).toBeUndefined();
    expect(result[0].mapPackKeywords).toBeUndefined();
  });
});
