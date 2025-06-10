import { Logging } from 'homebridge';
import { WindmillService, Mode, FanSpeed } from '../WindmillService';
import { HttpClient } from '../HttpClient';

const createMockLog = (): Logging => ({
  prefix: '',
  info: jest.fn(),
  success: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
  log: jest.fn(),
} as unknown as Logging);

describe('WindmillService', () => {
  const token = 'test-token';
  let httpClient: jest.Mocked<HttpClient>;
  let log: Logging;
  let service: WindmillService;

  beforeEach(() => {
    httpClient = {
      get: jest.fn(),
      post: jest.fn(),
    };
    log = createMockLog();
    service = new WindmillService(token, log, httpClient);
  });

  test('getMode returns Mode.COOL for numeric response', async () => {
    httpClient.get.mockResolvedValueOnce('1');
    const mode = await service.getMode();
    expect(mode).toBe(Mode.COOL);
    const url = new URL('/external/api/get', 'https://dashboard.windmillair.com');
    url.searchParams.append('token', token);
    url.searchParams.append('V3', '');
    expect(httpClient.get).toHaveBeenCalledWith(url.toString());
  });

  test('getMode returns Mode.ECO for string response', async () => {
    httpClient.get.mockResolvedValueOnce('Eco');
    const mode = await service.getMode();
    expect(mode).toBe(Mode.ECO);
  });

  test('setFanSpeed sends correct value', async () => {
    httpClient.get.mockResolvedValue('1');
    await service.setFanSpeed(FanSpeed.MEDIUM);
    const url = new URL('/external/api/update', 'https://dashboard.windmillair.com');
    url.searchParams.append('token', token);
    url.searchParams.append('V4', '2');
    expect(httpClient.get).toHaveBeenCalledWith(url.toString());
  });
});
