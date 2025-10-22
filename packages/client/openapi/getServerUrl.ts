/** Get the base URL of an OpenAPI specification. */
export type ServerUrl<T> =

  // --- Handle OpenAPI 2.0 specifications.
  T extends {
    host: infer Host extends string
    basePath?: infer BasePath extends string
    schemes?: Array<infer Scheme extends string>
  }
    ? `${Scheme}://${Host}${BasePath}`

    // --- Handle OpenAPI 3.0 specifications.
    : T extends { servers: Array<{ url: infer U extends string }> }
      ? U
      : string

/**
 * Given an OpenAPI specification, get the first base URL.
 *
 * @param specification The OpenAPI specification.
 * @returns The first base URL.
 * @example getBaseUrl(specification) // 'https://api.example.com/v1'
 */
export function getServerUrl<T>(specification: T): ServerUrl<T> {

  // --- Ensure the specification is an object.
  if (
    !specification
    || typeof specification !== 'object'
    || specification === null)
    throw new Error('Invalid OpenAPI specification.')

  // --- Handle OpenAPI 3.0 specifications.
  if (
    'servers' in specification
    && Array.isArray(specification.servers)
    && specification.servers.length > 0
    && 'url' in specification.servers[0]
    && typeof specification.servers[0].url === 'string'
    && specification.servers[0].url.length > 0)
    return specification.servers[0].url as ServerUrl<T>

  // --- Handle OpenAPI 2.0 specifications.
  if (
    'host' in specification
    && typeof specification.host === 'string') {

    const scheme = (
      'schemes' in specification
      && Array.isArray(specification.schemes)
      && specification.schemes.length > 0
      && typeof specification.schemes[0] === 'string')
      ? specification.schemes[0]
      : 'https'

    const basePath = (
      'basePath' in specification
      && typeof specification.basePath === 'string'
      && specification.basePath.length > 0)
      ? specification.basePath
      : '/'

    return `${scheme}://${specification.host}${basePath}` as ServerUrl<T>
  }

  throw new Error('No base URL found in the OpenAPI specification.')
}
