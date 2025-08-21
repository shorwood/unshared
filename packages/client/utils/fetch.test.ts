import { fetch } from './fetch'

describe('fetch', () => {
  let stubbedFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    stubbedFetch = vi.fn()
    vi.stubGlobal('fetch', stubbedFetch)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should call globalThis.fetch with parsed URL and init', async() => {
    await fetch('GET /users', { baseUrl: 'https://api.example.com' })
    const expectedUrl = new URL('https://api.example.com/users')
    const expectedInit = { method: 'get' }
    expect(stubbedFetch).toHaveBeenCalledWith(expectedUrl, expectedInit)
  })

  it('should return the response from globalThis.fetch', async() => {
    const response = new Response('test data', { status: 200, headers: { 'Content-Type': 'text/plain' } })
    stubbedFetch.mockResolvedValue(response)
    const result = await fetch('GET /test', { baseUrl: 'https://api.example.com' })
    expect(result).toBe(response)
    expect(result.status).toBe(200)
  })

  it('should reject with fetch errors', async() => {
    const error = new Error('Network error')
    stubbedFetch.mockRejectedValue(error)
    const result = fetch('GET /users', { baseUrl: 'https://api.example.com' })
    await expect(result).rejects.toThrow(error)
  })

  it('should throw error if request parsing fails', async() => {
    const result = fetch('GET /users', {})
    await expect(result).rejects.toThrow('Could not resolve the `RequestInit` object: the `baseUrl` is missing.')
    expect(stubbedFetch).not.toHaveBeenCalled()
  })
})
