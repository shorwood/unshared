import type { OpenAPI } from 'openapi-types'

/**
 * Given an OpenAPI specification, get the first base URL.
 *
 * @param specification The OpenAPI specification.
 * @returns The first base URL.
 * @example getBaseUrl(specification) // 'https://api.example.com/v1'
 */
export function getBaseUrl(specification: OpenAPI.Document): string {

  // --- Handle OpenAPI 3.0 specifications.
  if ('servers' in specification && Array.isArray(specification.servers) && specification.servers.length > 0)
    return specification.servers[0].url

  // --- Handle OpenAPI 2.0 specifications.
  if ('host' in specification && typeof specification.host === 'string') {
    const scheme = specification.schemes && specification.schemes.length > 0 ? specification.schemes[0] : 'https'
    const basePath = specification.basePath && typeof specification.basePath === 'string' ? specification.basePath : '/'
    return `${scheme}://${specification.host}${basePath}`
  }

  throw new Error('No base URL found in the OpenAPI specification.')
}
