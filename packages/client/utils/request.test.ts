import { request } from './request'

describe('request', () => {
  let stubbedFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    stubbedFetch = vi.fn()
    vi.stubGlobal('fetch', stubbedFetch)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should call fetch with route and options', async() => {
    const mockResponse = new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } })
    stubbedFetch.mockResolvedValue(mockResponse)
    const expectedUrl = new URL('https://api.example.com/users')
    const expectedInit = { method: 'get' }
    await request('GET /users', { baseUrl: 'https://api.example.com' })
    expect(stubbedFetch).toHaveBeenCalledWith(expectedUrl, expectedInit)
  })

  it('should return parsed JSON data from response', async() => {
    const expectedData = { users: [] }
    const mockResponse = new Response(JSON.stringify(expectedData), { status: 200, headers: { 'Content-Type': 'application/json' } })
    stubbedFetch.mockResolvedValue(mockResponse)
    const result = await request('GET /users', { baseUrl: 'https://api.example.com' })
    expect(result).toEqual(expectedData)
  })

  it('should return text data from response', async() => {
    const expectedData = 'Hello, world!'
    const mockResponse = new Response(expectedData, { status: 200, headers: { 'Content-Type': 'text/plain' } })
    stubbedFetch.mockResolvedValue(mockResponse)
    const result = await request('GET /users', { baseUrl: 'https://api.example.com' })
    expect(result).toBe(expectedData)
  })

  it('should reject with error when fetch fails', async() => {
    const error = new Error('Network error')
    stubbedFetch.mockRejectedValue(error)
    const result = request('GET /users', { baseUrl: 'https://api.example.com' })
    await expect(result).rejects.toThrow(error)
  })

  it('should throw error if request parsing fails', async() => {
    const result = request('GET /users', {})
    await expect(result).rejects.toThrow('Could not resolve the `RequestInit` object: the `baseUrl` is missing.')
    expect(stubbedFetch).not.toHaveBeenCalled()
  })

  it('should call onError callback when fetch fails', async() => {
    const error = new Error('Network error')
    const onError = vi.fn()
    const options = { baseUrl: 'https://api.example.com', onError }
    stubbedFetch.mockRejectedValue(error)
    const result = await request('GET /users', options)
    expect(onError).toHaveBeenCalledWith(error, options)
    expect(result).toBeUndefined()
  })

  it('should call onError callback when parseRequest fails', async() => {
    const onError = vi.fn()
    const options = { onError }
    const result = await request('GET /users', options)
    const error = new Error('Could not resolve the `RequestInit` object: the `baseUrl` is missing.')
    expect(onError).toHaveBeenCalledWith(error, options)
    expect(result).toBeUndefined()
  })
})
