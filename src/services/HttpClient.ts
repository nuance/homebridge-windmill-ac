import fetch from 'node-fetch'
export interface HttpClient {
  get(url: string): Promise<string>
  post(url: string, body: unknown): Promise<string>
}

export class FetchHttpClient implements HttpClient {
  async get(url: string): Promise<string> {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`GET request failed for ${url}`)
    }
    return res.text()
  }

  async post(url: string, body: unknown): Promise<string> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body ?? {}),
    })
    if (!res.ok) {
      throw new Error(`POST request failed for ${url}`)
    }
    return res.text()
  }
}
