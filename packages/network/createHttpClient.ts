import { HttpHeader } from './httpHeader'
import { HttpMethod } from './httpMethod'

// --- Override the `fetch` signature to allow for typeahead on the `json` method.
declare global {
  export interface Response<T = unknown> { json(): Promise<T> }
  export function fetch<T>(input: RequestInfo | URL, init?: RequestInit): Promise<Response<T>>
}

export interface ClientOptionsAuth {
  /**
   * The username to use for authentication.
   *
   * @example 'johndoe'
   */
  username?: string
  /**
   * The password to use for authentication.
   *
   * @example 'password'
   */
  password?: string
}

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface ClientOptionsHeaders extends Partial<Record<HttpHeader, string>> {
  [key: string]: string | undefined
}

// @ts-expect-error: override the `headers` property
export interface ClientOptions extends RequestInit {
  /**
   * The headers to use for all requests. These headers will be merged with the
   * headers provided in the `options` parameter of the `fetch` method.
   *
   * @example { 'Content-Type': 'application/json' }
   */
  headers?: ClientOptionsHeaders | HeadersInit
  /**
   * The method to use for the request. All requests will use this method unless
   * overridden in the `options` parameter of the method.
   *
   * @example 'GET'
   */
  method?: keyof typeof HttpMethod
}

export interface Client {
  fetch<T>(path: string, options?: ClientOptions): Promise<T>
  get<T>(path: string, options?: ClientOptions): Promise<T>
  post<T>(path: string, options?: ClientOptions): Promise<T>
  put<T>(path: string, options?: ClientOptions): Promise<T>
  patch<T>(path: string, options?: ClientOptions): Promise<T>
  delete<T>(path: string, options?: ClientOptions): Promise<T>
  options<T>(path: string, options?: ClientOptions): Promise<T>
  head<T>(path: string, options?: ClientOptions): Promise<T>
  connect<T>(path: string, options?: ClientOptions): Promise<T>
  trace<T>(path: string, options?: ClientOptions): Promise<T>
  _fetch<T>(path: string, options?: ClientOptions): Promise<Response<T>>
  $get<T>(path: string, options?: ClientOptions): Promise<Response<T>>
  $post<T>(path: string, options?: ClientOptions): Promise<Response<T>>
  $put<T>(path: string, options?: ClientOptions): Promise<Response<T>>
  $patch<T>(path: string, options?: ClientOptions): Promise<Response<T>>
  $delete<T>(path: string, options?: ClientOptions): Promise<Response<T>>
  $options<T>(path: string, options?: ClientOptions): Promise<Response<T>>
  $head<T>(path: string, options?: ClientOptions): Promise<Response<T>>
  $connect<T>(path: string, options?: ClientOptions): Promise<Response<T>>
  $trace<T>(path: string, options?: ClientOptions): Promise<Response<T>>
  clientOptions: ClientOptions
}

/**
 * Create an HTTP client that can be used to make requests to a server. The client
 * is a wrapper around the `fetch` API that defaults the initial options and
 * provides a more convenient API.
 *
 * @param url The URL of the server.
 * @param options The options.
 * @returns The client.
 * @example
 * const headers = { 'Content-Type': 'application/json' }
 * const client = createHttpClient('https://example.com', { headers })
 * const response = await client.get('/api') // Promise<Response>
 */
export function createHttpClient(url: string, options: ClientOptions = {}): Client {
  if (typeof url !== 'string')
    throw new TypeError('Expected URL to be a string.')
  if (typeof options !== 'object' || options === null)
    throw new TypeError('Expected options to be an object.')

  // --- Wrap the `fetch` function to default the initial options,
  // --- prepend the base URL, and stringify the body.
  async function fetchRaw<T>(path: string, init: ClientOptions = {}) {
    const fullUrl = new URL(path, url).toString()
    const initialOptions = { ...init, headers: { ...options.headers, ...init.headers } }
    initialOptions.body = typeof initialOptions.body === 'object' && initialOptions.body !== null
      ? JSON.stringify(initialOptions.body)
      : initialOptions.body
    return fetch<T>(fullUrl, initialOptions)
  }

  // --- Create the convenience methods.
  async function fetchData<T>(path: string, options: ClientOptions = {}) {
    const response = await fetchRaw<T>(path, options)
    if (!response.ok) throw new Error(`Request failed with status ${response.status}.`)

    // --- Attempt to parse the response as JSON. If that fails, return the raw text.
    return response.json().catch(() => response.text()) as Promise<T>
  }

  return {
    fetch: fetchData,
    get<T>(path: string, options: ClientOptions = {}) { return fetchData<T>(path, { ...options, method: 'GET' }) },
    post<T>(path: string, options: ClientOptions = {}) { return fetchData<T>(path, { ...options, method: 'POST' }) },
    put<T>(path: string, options: ClientOptions = {}) { return fetchData<T>(path, { ...options, method: 'PUT' }) },
    patch<T>(path: string, options: ClientOptions = {}) { return fetchData<T>(path, { ...options, method: 'PATCH' }) },
    delete<T>(path: string, options: ClientOptions = {}) { return fetchData<T>(path, { ...options, method: 'DELETE' }) },
    options<T>(path: string, options: ClientOptions = {}) { return fetchData<T>(path, { ...options, method: 'OPTIONS' }) },
    head<T>(path: string, options: ClientOptions = {}) { return fetchData<T>(path, { ...options, method: 'HEAD' }) },
    connect<T>(path: string, options: ClientOptions = {}) { return fetchData<T>(path, { ...options, method: 'CONNECT' }) },
    trace<T>(path: string, options: ClientOptions = {}) { return fetchData<T>(path, { ...options, method: 'TRACE' }) },
    _fetch<T>(path: string, options: ClientOptions = {}) { return fetchRaw<T>(path, options) },
    $get<T>(path: string, options: ClientOptions = {}) { return fetchData<T>(path, { ...options, method: 'GET' }) },
    $post<T>(path: string, options: ClientOptions = {}) { return fetchData<T>(path, { ...options, method: 'POST' }) },
    $put<T>(path: string, options: ClientOptions = {}) { return fetchData<T>(path, { ...options, method: 'PUT' }) },
    $patch<T>(path: string, options: ClientOptions = {}) { return fetchData<T>(path, { ...options, method: 'PATCH' }) },
    $delete<T>(path: string, options: ClientOptions = {}) { return fetchData<T>(path, { ...options, method: 'DELETE' }) },
    $options<T>(path: string, options: ClientOptions = {}) { return fetchData<T>(path, { ...options, method: 'OPTIONS' }) },
    $head<T>(path: string, options: ClientOptions = {}) { return fetchData<T>(path, { ...options, method: 'HEAD' }) },
    $connect<T>(path: string, options: ClientOptions = {}) { return fetchData<T>(path, { ...options, method: 'CONNECT' }) },
    $trace<T>(path: string, options: ClientOptions = {}) { return fetchData<T>(path, { ...options, method: 'TRACE' }) },
    clientOptions: options,
  }
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should create a client with a `.get` method', async() => {
    const client = createHttpClient('https://jsonplaceholder.typicode.com')
    const response = await client.get('/todos/1')
    expect(response).toEqual({ userId: 1, id: 1, title: 'delectus aut autem', completed: false })
  })
}
