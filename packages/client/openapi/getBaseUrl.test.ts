import { getBaseUrl } from './getBaseUrl'

describe('getBaseUrl', () => {
  it('should return the first server URL for OpenAPI 3.0', () => {
    const result = getBaseUrl({
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      servers: [{ url: 'https://api.example.com/v1' }],
      paths: {},
    })
    expect(result).toBe('https://api.example.com/v1')
  })

  it('should return the constructed URL for OpenAPI 2.0', () => {
    const result = getBaseUrl({
      swagger: '2.0',
      info: { title: 'Test API', version: '1.0.0' },
      host: 'api.example.com',
      schemes: ['https'],
      basePath: '/v1',
      paths: {},
    })
    expect(result).toBe('https://api.example.com/v1')
  })

  it('should return the constructed URL with https scheme by default', () => {
    const result = getBaseUrl({
      swagger: '2.0',
      info: { title: 'Test API', version: '1.0.0' },
      host: 'api.example.com',
      paths: {},
    })
    expect(result).toBe('https://api.example.com/')
  })

  it('should return the constructed URL with "/" basePath by default', () => {
    const result = getBaseUrl({
      swagger: '2.0',
      info: { title: 'Test API', version: '1.0.0' },
      host: 'api.example.com',
      schemes: ['https'],
      paths: {},
    })
    expect(result).toBe('https://api.example.com/')
  })

  it('should throw an error if no base URL is found', () => {
    const shouldThrow = () => getBaseUrl({ openapi: '3.0.0', info: { title: 'Test API', version: '1.0.0' }, paths: {} })
    expect(shouldThrow).toThrow('No base URL found in the OpenAPI specification.')
  })
})
