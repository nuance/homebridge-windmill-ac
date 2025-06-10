import { URL } from 'url'
import { HttpClient, FetchHttpClient } from './HttpClient'

export interface BlynkServiceConfig {
    serverAddress: string
    token: string
    httpClient?: HttpClient
}

/**
 * Service class for interacting with Blynk API
 * See: https://docs.blynk.io/en/blynk.cloud/https-api-overview
 */
export class BlynkService {
  protected readonly serverAddress: string;
  protected readonly token: string;
  protected readonly httpClient: HttpClient

  constructor({ serverAddress, token, httpClient }: BlynkServiceConfig) {
    this.serverAddress = serverAddress
    this.token = token
    this.httpClient = httpClient ?? new FetchHttpClient()
  }

  /**
   * Gets the value of a pin
   *
   * @param pin The virtual pin to get the value of (e.g. V1)
   * @returns The value of the pin
   */
  protected async getPinValue(pin: string): Promise<string> {
    const url = new URL('/external/api/get', this.serverAddress);
    url.searchParams.append('token', this.token);
    url.searchParams.append(pin, '');

    return this.httpClient.get(url.toString())
  }

  /**
   *
   * @param pin The virtual pin to set the value of (e.g. V1)
   * @param value The value to set the pin to
   * @returns Whether the pin was successfully set
   */
  protected async setPinValue(pin: string, value: string): Promise<boolean> {
    const url = new URL('/external/api/update', this.serverAddress);
    url.searchParams.append('token', this.token);
    url.searchParams.append(pin, value);

    const text = await this.httpClient.get(url.toString())
    return text === '1'
  }
}
