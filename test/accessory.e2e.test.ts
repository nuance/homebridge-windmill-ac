import express from 'express';
import { AddressInfo } from 'net';
import fetch from 'node-fetch';

// ensure fetch uses node-fetch in tests
(global as any).fetch = fetch;

describe('WindmillThermostatAccessory end-to-end', () => {
  let server;
  let baseUrl: string;
  const pins: Record<string,string> = {
    V0: '0',
    V1: '70',
    V2: '70',
    V3: '1',
    V4: '1',
  };

  beforeAll(done => {
    const app = express();
    app.get('/external/api/get', (req, res) => {
      const pin = Object.keys(req.query).find(p => p !== 'token') as string;
      res.send(pins[pin] ?? '');
    });
    app.get('/external/api/update', (req, res) => {
      const pin = Object.keys(req.query).find(p => p !== 'token') as string;
      const val = req.query[pin] as string;
      pins[pin] = val;
      res.send('1');
    });
    server = app.listen(0, () => {
      const port = (server.address() as AddressInfo).port;
      baseUrl = `http://localhost:${port}`;
      process.env.WINDMILL_BASE_URL = baseUrl;
      done();
    });
  });

  afterAll(done => {
    server.close(done);
  });

  function createAccessory() {
    const hap = require('hap-nodejs');
    let Constructor: any;
    const api = {
      hap,
      registerAccessory: (_: string, ctor: any) => {
        Constructor = ctor;
      },
    };
    // load plugin
    require('../src/accessory')(api);
    const log = { debug: jest.fn(), warn: jest.fn() } as any;
    const config = { name: 'Test', token: 'testtoken' };
    return new Constructor(log, config);
  }

  test('reads current temperature', async () => {
    const accessory = createAccessory();
    const temp = await accessory.handleGetCurrentTemperature();
    expect(temp).toBeCloseTo(21.1, 1);
  });

  test('sets target temperature', async () => {
    const accessory = createAccessory();
    await accessory.handleSetTargetTemperature(22); // °C
    expect(pins.V2).toBe('72');
  });

  test('sets fan speed', async () => {
    const accessory = createAccessory();
    await accessory.handleSetFanRotationSpeed(100);
    expect(pins.V4).toBe('3');
  });
});
