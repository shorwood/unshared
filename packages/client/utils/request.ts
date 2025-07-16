import type { Awaitable } from '@unshared/functions/awaitable'
import type { ObjectLike } from '@unshared/types'
import type { FetchMethod, FetchOptions } from './parseRequest'
import { fetch } from './fetch'
import { handleResponse } from './handleResponse'

export type RequestOptionsOnData<T> =
  T extends AsyncGenerator<infer U, any, any> ? (data: U) => any
    : T extends Awaitable<AsyncGenerator<infer U, any, any>> ? (data: U) => any
      : (data: T) => any

export interface RequestOptions<
  Method extends FetchMethod = FetchMethod,
  BaseUrl extends string = string,
  Parameters extends ObjectLike = ObjectLike,
  Query extends ObjectLike = ObjectLike,
  Body = unknown,
  Headers extends ObjectLike = ObjectLike,
  Data = any,
  Response = globalThis.Response,
> extends
  FetchOptions<Method, BaseUrl, Parameters, Query, Body, Headers> {

  /**
   * The callback that is called when an error occurs during the request.
   */
  onError?: (error: Error) => any

  /**
   * The callback that is called when data is received from the request. This callback
   * will be called for each chunk of data that is received from the request.
   */
  onData?: RequestOptionsOnData<Data>

  /**
   * The callback that is called when the request is successful. This callback will be
   * called after the request is complete and all data has been received.
   */
  onSuccess?: (response: Response) => any

  /**
   * The callback that is called when the status code is not OK. This callback will be called
   * after the request is complete and before the data is consumed.
   */
  onFailure?: (response: Response) => any

  /**
   * The callback that is called when the request is complete. This callback will be called
   * after the request is complete and all data has been received.
   */
  onEnd?: (response: Response) => any
}

/**
 * Fetch a route from the API and return the data. If the client was instantiated with an
 * application, the route name will be inferred from the application routes. Otherwise, you
 * can pass the route name as a string.
 *
 * @param route The name of the route to fetch.
 * @param options The options to pass to the request.
 * @returns The data from the API.
 * @example
 * // Declare the application type.
 * type App = Application<[ModuleProduct]>
 *
 * // Create a type-safe client for the application.
 * const request = createClient<App>()
 *
 * // Fetch the data from the API.
 * const data = request('GET /api/product/:id', { data: { id: '1' } })
 */
export async function request(route: string, options?: RequestOptions): Promise<unknown>
export async function request(route: string, options: RequestOptions = {}): Promise<unknown> {
  const response = await fetch(route, options)
  return await handleResponse(response, options)
}
