import type { MaybeLiteral, Override, Pretty } from '@unshared/types'
import type { OpenAPI, OpenAPIV2 as V2, OpenAPIV3 as V3, OpenAPIV3_1 as V3_1 } from 'openapi-types'
import type { RequestOptions } from './utils/index'
import { fetch } from './fetch'
import { getOperationById } from './openapi/getOperationById'
import { getBaseUrl, type OpenAPIV2, type OpenAPIV3 } from './openapi/index'

type ClientBaseUrl<T> =
  MaybeLiteral<
    T extends V2.Document ? OpenAPIV2.ServerUrl<T>
      : T extends V3.Document ? OpenAPIV3.ServerUrl<T>
        : T extends V3_1.Document ? OpenAPIV3.ServerUrl<T>
          : string
  >

type ClientFetch<T> =
  T extends V2.Document ? <P extends OpenAPIV2.Route<T>>(name: P, options: OpenAPIV2.RequestInit<OpenAPIV2.OperationByRoute<T, P>>) => Promise<OpenAPIV2.Response<OpenAPIV2.OperationByRoute<T, P>>>
    : T extends V3.Document ? <P extends OpenAPIV2.Route<T>>(name: P, options: OpenAPIV3.RequestInit<T, OpenAPIV2.OperationByRoute<T, P>>) => Promise<OpenAPIV3.Response<OpenAPIV2.OperationByRoute<T, P>>>
      : T extends V3_1.Document ? <P extends OpenAPIV2.Route<T>>(name: P, options: OpenAPIV3.RequestInit<T, OpenAPIV2.OperationByRoute<T, P>>) => Promise<OpenAPIV3.Response<OpenAPIV2.OperationByRoute<T, P>>>
        : typeof globalThis.fetch

type ClientFetchOperation<T, U extends OpenAPIV2.OperationId<T>> =
  T extends V2.Document ? (options: OpenAPIV2.RequestInit<OpenAPIV2.OperationById<T, U>>) => Promise<OpenAPIV2.ResponseBody<OpenAPIV2.OperationById<T, U>>>
    : T extends V3.Document ? (options: OpenAPIV3.RequestInit<T, OpenAPIV2.OperationById<T, U>>) => Promise<OpenAPIV3.ResponseBody<OpenAPIV2.OperationById<T, U>>>
      : T extends V3_1.Document ? (options: OpenAPIV3.RequestInit<T, OpenAPIV2.OperationById<T, U>>) => Promise<OpenAPIV3.ResponseBody<OpenAPIV2.OperationById<T, U>>>
        : (options: RequestOptions) => Promise<Response>

export type Client<T = OpenAPI.Document> =
  Pretty<
    & { [K in OpenAPIV2.OperationId<T>]: ClientFetchOperation<T, K> }
    & { fetch: ClientFetch<T> }
  >

export type ClientOptions<T> = Pretty<Override<RequestOptions, {
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

  async function fetchByOperationId(operationId: string, options: ClientOptions<any>) {
    if (!specifications) throw new Error('No OpenAPI specification provided.')
    const operation = getOperationById(specifications, operationId) as { method: string; path: string } & OpenAPI.Operation
    if (!operation) throw new Error(`Operation ID "${operationId}" not found.`)
    const { method, path, responses = {} } = operation
    const response = await fetch(path, {
      method,
      baseUrl: getBaseUrl(specifications),
      ...initialOptions,
      ...options,
    })

    // --- Return the JSON response if successful.
    if (response.ok) return response.json() as Promise<unknown>

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

  return new Proxy({}, {
    get(_, property: string) {
      if (property === 'fetch') return fetch
      return (options: Record<string, unknown>) => fetchByOperationId(property, options)
    },
  }) as unknown as Client
}