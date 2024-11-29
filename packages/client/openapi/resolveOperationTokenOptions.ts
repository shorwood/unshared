import type { OpenAPI, OpenAPIV3 as V3 } from 'openapi-types'
import { isOpenAPIV3 } from './isOpenAPIV3'

export interface TokenOptions {
  tokenLocation?: 'cookie' | 'header' | 'query'
  tokenProperty?: string
}

/**
 * Resolve the location of the apiKey token based on the OpenAPI specification.
 *
 * @param document The OpenAPI specification document.
 * @param operation The OpenAPI operation object.
 * @returns The location of the apiKey token ('query' | 'cookie' | 'header').
 * @example resolveOperationTokenOptions(document, operation) // => { tokenLocation: 'header', tokenProperty: 'X-API-Key' }
 */
export function resolveOperationTokenOptions(document: object, operation: OpenAPI.Operation): TokenOptions {
  if (!isOpenAPIV3(document)) return {}

  // --- Find the security scheme in the OpenAPI specification.
  const security = operation.security ?? document.security
  if (!security) return {}
  const securityScheme = document?.components?.securitySchemes
  if (!securityScheme) return {}

  // --- Find the first security scheme that is an apiKey.
  for (const requirement of security) {
    for (const key in requirement) {
      const scheme = securityScheme[key] as V3.SecuritySchemeObject
      if (typeof scheme !== 'object' || scheme === null) continue
      if (scheme.type === 'apiKey') {
        return {
          tokenLocation: scheme.in as 'cookie' | 'header' | 'query',
          tokenProperty: scheme.name,
        }
      }
    }
  }

  // --- Return an empty object if no apiKey was found.
  return {}
}
