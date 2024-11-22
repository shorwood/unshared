import type { MaybeLiteral, Override, Pretty } from '@unshared/types'
import type { OpenAPI, OpenAPIV2 as V2, OpenAPIV3 as V3, OpenAPIV3_1 as V3_1 } from 'openapi-types'
import type { RequestOptions } from './utils/index'
import { fetch } from './fetch'
import { getOperationById } from './openapi/getOperationById'
import { getBaseUrl, type OpenAPIV2, type OpenAPIV3 } from './openapi/index'

type ClientBaseUrl<T> =
  MaybeLiteral<T extends V2.Document ? OpenAPIV2.ServerUrl<T>
    : T extends V3.Document ? OpenAPIV3.ServerUrl<T>
      : T extends V3_1.Document ? OpenAPIV3.ServerUrl<T>
        : string>

type ClientFetch<T> =
  T extends V2.Document ? OpenAPIV2.Fetch<T>
    : T extends V3.Document ? OpenAPIV3.Fetch<T>
      : T extends V3_1.Document ? OpenAPIV3.Fetch<T>
        : typeof globalThis.fetch

type ClientFetchOperation<T, U extends OpenAPIV2.OperationId<T>> =
  (options: OpenAPIV2.RequestInit<OpenAPIV2.OperationById<T, U>>) => Promise<OpenAPIV2.Response<OpenAPIV2.OperationById<T, U>>>

export type Client<T = OpenAPI.Document> =
  Pretty<
    & { [K in OpenAPIV2.OperationId<T>]: ClientFetchOperation<T, K> }
    & { fetch: ClientFetch<T> }
  >

export type ClientOptions<T = OpenAPI.Document> = Pretty<Override<RequestOptions, {
  baseUrl?: ClientBaseUrl<T>

  /**
   * The headers to include in every request made by the client.
   *
   * @example { 'Authorization': 'Bearer ...' }
   */
  headers?: T extends V3.Document
    ? OpenAPIV3.ServerHeaders<T>
    : Record<string, string>
}>>

export function createClient<T extends OpenAPI.Document>(document: Readonly<T>, initialOptions?: ClientOptions<T>): Client<T>
export function createClient<T extends OpenAPI.Document>(url: ClientBaseUrl<T>, initialOptions?: ClientOptions<T>): Client<T>
export function createClient(documentOrUrl: Readonly<OpenAPI.Document> | string, initialOptions: ClientOptions<any> = {}): Client {
  const specifications = typeof documentOrUrl === 'string' ? undefined : documentOrUrl

  function fetchByOperationId(operationId: string, options: Record<string, unknown>) {
    if (!specifications) throw new Error('No OpenAPI specification provided.')
    const operation = getOperationById(specifications, operationId)
    if (!operation) throw new Error(`Operation ID "${operationId}" not found.`)
    const { method, path } = operation
    return fetch(path, {
      method,
      baseUrl: getBaseUrl(specifications),
      ...initialOptions,
      ...options,
    })
  }

  return new Proxy({}, {
    get(_, property: string) {
      if (property === 'fetch') return fetch
      return (options: Record<string, unknown>) => fetchByOperationId(property, options)
    },
  }) as unknown as Client
}
