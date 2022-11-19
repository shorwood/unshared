import { ClientRequest, IncomingHttpHeaders, IncomingMessage, OutgoingHttpHeaders } from 'node:http'
import { request as requestBrowser } from './requestBrowser'
import { request as requestNode } from './requestNode'

export interface RequestOptions<T> {
  data?: any
  method?: string
  headers?: OutgoingHttpHeaders
  timeout?: number
  encoding?: BufferEncoding
  parser?: (data: ArrayBuffer) => T
  noCors?: boolean
  returnState?: boolean
}

export interface RequestState<T, TRequest, TResponse> {
  data: T
  request: TRequest
  response: TResponse
  readonly status: number
  readonly headers: IncomingHttpHeaders
  readonly cookies: Record<string, string>
}

export interface Request {
  <T = any>(url: string | URL, options: RequestOptions<T> & { returnState: true }): Promise<RequestState<T, ClientRequest, IncomingMessage>>
  <T = any>(url: string | URL, options?: RequestOptions<T>): Promise<T>
}

/**
 * Request data from URL.
 * @param url Request URL.
 * @param options Request options
 */
export const request: Request = (...parameters: Parameters<Request>) => (
  typeof window !== 'undefined' && typeof XMLHttpRequest !== 'undefined'
    ? requestBrowser(...parameters)
    : requestNode(...parameters)
)
