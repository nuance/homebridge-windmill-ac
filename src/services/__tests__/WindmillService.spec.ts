import { WindmillService, Mode, FanSpeed } from '../WindmillService';
import fetch from 'node-fetch';
import { URL } from 'url';

jest.mock('node-fetch');
const fetchMock = fetch as jest.MockedFunction<typeof fetch>;

describe('WindmillService', () => {
  const log = {
    debug: jest.fn(),
    warn: jest.fn(),
  } as any;
  let service: WindmillService;

  beforeEach(() => {
    fetchMock.mockReset();
    service = new WindmillService('token', log);
  });

  test('getMode parses numeric response', async () => {
    fetchMock.mockResolvedValue({ ok: true, text: async () => '1' } as any);
    const mode = await service.getMode();
    expect(mode).toBe(Mode.COOL);
    expect(fetchMock).toHaveBeenCalled();
  });

  test('setFanSpeed sends correct value', async () => {
    fetchMock.mockResolvedValue({ ok: true, text: async () => '1' } as any);
    await service.setFanSpeed(FanSpeed.MEDIUM);
    expect(fetchMock).toHaveBeenCalled();
    const calledUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(calledUrl.searchParams.get('V4')).toBe('2');
  });
});
