import type { OpenAPIV3 } from 'openapi-types'
import type { ClientOptions } from './createClient'
import { parse } from 'yaml'
import { createClient } from './createClient'
import { createMethods, resolveDocument } from './utils'

export interface ServiceOptions extends ClientOptions {

  /**
   * Will throw an error if a request that does not match the OpenAPI specification
   * is made.
   *
   * @default false
   */
  strict?: boolean
}

/**
 * Build an HTTP client from an [OpenAPI specification](https://swagger.io/specification)
 * document. Each path in the *OpenAPI specification* will be converted into a
 * convenience method on the client.
 *
 * @param specification The OpenAPI specification.
 * @param options The options to pass to the client.
 * @returns The client.
 * @example
 * const spec = await readJson('./specs/twitter.v1.json')
 * const client = createClientFromSpec(spec)
 * const response = await client.getTweets({ count: 10 })
 */
export function createService(specification: OpenAPIV3.Document, options: ClientOptions = {}) {
  const specResolved = resolveDocument(specification)

  // --- Get the server URL from the specification.
  const serverUrl = specResolved.servers?.[0]?.url.replace('{scheme}', 'https')
  if (typeof serverUrl !== 'string')
    throw new TypeError('Expected OpenAPI specification to have a server URL.')

  // --- Initialize the client and service.
  const client = createClient(serverUrl, options)
  const service: Record<string, any> = { url: serverUrl }

  // --- Collect all the operations in the specification.
  for (const [path, pathSpec] of Object.entries(specResolved.paths)) {
    if (typeof pathSpec !== 'object') continue
    for (const [method, operation] of Object.entries(pathSpec)) {
      if (typeof operation !== 'object') continue

      // --- Create the methods.
      const operations = Array.isArray(operation) ? operation : [operation]
      for (const operation of operations) {
        // @ts-expect-error: operation is resolved at this point.
        const methods = createMethods({ method, path, operation, client })
        Object.assign(service, methods)
      }
    }
  }

  // --- Return the service.
  return service
}

/* v8 ignore start */
if (import.meta.vitest) {
  const response = await fetch('https://raw.githubusercontent.com/APIs-guru/openapi-directory/main/APIs/openai.com/1.1.0/openapi.yaml')
  const specYaml = await response.text()
  const spec = parse(specYaml) as OpenAPIV3.Document

  it('should create a client from a specification', async() => {
    const client = createService(spec)
    const listModels = await client.listModels()
  })
}
