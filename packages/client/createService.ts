import type { MaybeLiteral } from '@unshared/types'
import type { OpenAPIV3, Operation, OperationById, OperationId, OperationOptions, OperationResult, ServerUrl } from './openapi'
import type { RequestOptions } from './utils/request'
import { getServerUrl } from './openapi/getServerUrl'
import { resolveOperation } from './openapi/resolveOperation'
import { resolveOperationTokenOptions } from './openapi/resolveOperationTokenOptions'
import { handleResponse } from './utils/handleResponse'
import { parseRequest } from './utils/parseRequest'

/** A service instance for the given OpenAPI specification. */
export type Service<T> = {
  [K in OperationId<T>]:
  OperationById<T, K> extends infer U extends OperationById<T, K>
    ? (data: OperationOptions<T, U>['data'], options?: OperationOptions<T, U>) => Promise<OperationResult<T, U>>
    : never
}

/** The options to pass to the service client. */
export interface ServiceOptions<T = any> extends RequestOptions {
  baseUrl?: MaybeLiteral<ServerUrl<T>>
  headers?: T extends { openapi: string } ? OpenAPIV3.ServerHeaders<T> : never
}

/**
 * Create a new client instance for the given OpenAPI specification.
 *
 * @param document The OpenAPI specification document.
 * @param initialOptions The initial options to use for every request.
 * @returns The client instance.
 * @example
 *
 * // Import the Giphy OpenAPI specification.
 * import Giphy from './giphy.openapi.json'
 *
 * // Create a new service instance for the Giphy API.
 * const service = createService(Giphy, { headers: { 'Bearer' } })
 *
 * // Request the "searchGifs" operation from the Giphy API.
 * await service.getGifs({ limit: 10, offset: 0, q: 'cats' }) // => { data: [...] }
 */
export function createService<T extends object>(document: Readonly<T>, initialOptions?: ServiceOptions<T>): Service<T> {
  return new Proxy({}, {
    get(_, id: OperationId<T>) {
      return async(data: object, options: RequestOptions) => {

        // --- Find the operation in the OpenAPI specification.
        const baseUrl = getServerUrl(document)
        const operation = resolveOperation(document, id) as Operation
        const tokenOptions = resolveOperationTokenOptions(document, operation)

        // --- Fetch the relevant resource from the server.
        const { method, path, responses = {} } = operation
        const { url, init } = parseRequest(path, { method, baseUrl, data, ...tokenOptions, ...initialOptions, ...options })
        const response = await globalThis.fetch(url, init)
        if (response.ok) return handleResponse(response, { ...initialOptions, ...options })

        // --- Throw an error if the response was not successful.
        const status = response.status.toString()
        if (status in responses
          && typeof responses[status] === 'object'
          && responses[status] !== null
          && 'description' in responses[status]
          && typeof responses[status].description === 'string')
          throw new Error(responses[status].description)

        // --- Throw a generic error if the response was not successful.
        throw new Error(response.statusText)
      }
    },
  }) as Service<T>
}
