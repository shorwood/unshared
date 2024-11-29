import type { OpenAPI, OpenAPIV3 as V3 } from 'openapi-types'
import { resolveOperationTokenOptions } from './resolveOperationTokenOptions'

describe('resolveOperationTokenOptions', () => {
  const document: V3.Document = {
    openapi: '3.0.0',
    info: { title: 'Test API', version: '1.0.0' },
    paths: {},
    components: {
      securitySchemes: {
        OAuth2: { type: 'oauth2', flows: {} },
        ApiKeyHeader: { type: 'apiKey', in: 'header', name: 'X-API-Key' },
        ApiKeyQuery: { type: 'apiKey', in: 'query', name: 'api_key' },
        ApiKeyCookie: { type: 'apiKey', in: 'cookie', name: 'api_key' },
      },
    },
  }

  it('should resolve apiKey in header', () => {
    const operation: OpenAPI.Operation = { security: [{ ApiKeyHeader: [] }] }
    const result = resolveOperationTokenOptions(document, operation)
    expect(result).toEqual({ tokenLocation: 'header', tokenProperty: 'X-API-Key' })
  })

  it('should resolve apiKey in query', () => {
    const operation: OpenAPI.Operation = { security: [{ ApiKeyQuery: [] }] }
    const result = resolveOperationTokenOptions(document, operation)
    expect(result).toEqual({ tokenLocation: 'query', tokenProperty: 'api_key' })
  })

  it('should resolve apiKey in cookie', () => {
    const operation: OpenAPI.Operation = { security: [{ ApiKeyCookie: [] }] }
    const result = resolveOperationTokenOptions(document, operation)
    expect(result).toEqual({ tokenLocation: 'cookie', tokenProperty: 'api_key' })
  })

  it('should resolve the default apiKey in header if no security is defined for the operation', () => {
    const operation: OpenAPI.Operation = {}
    const result = resolveOperationTokenOptions({ ...document, security: [{ ApiKeyHeader: [] }] }, operation)
    expect(result).toEqual({ tokenLocation: 'header', tokenProperty: 'X-API-Key' })
  })

  it('should return empty object if security scheme does not exist', () => {
    const operation: OpenAPI.Operation = { security: [{ Unknown: [] }] }
    const result = resolveOperationTokenOptions({}, operation)
    expect(result).toEqual({})
  })

  it('should return empty object if security scheme is not an apiKey', () => {
    const operation: OpenAPI.Operation = { security: [{ OAuth2: [] }] }
    const result = resolveOperationTokenOptions(document, operation)
    expect(result).toEqual({})
  })

  it('should return an empty object if no security is defined for the operation', () => {
    const operation: OpenAPI.Operation = {}
    const result = resolveOperationTokenOptions(document, operation)
    expect(result).toEqual({})
  })

  it('should return empty object if no security schemes are defined', () => {
    const operation: OpenAPI.Operation = {}
    const result = resolveOperationTokenOptions({}, operation)
    expect(result).toEqual({})
  })
})
