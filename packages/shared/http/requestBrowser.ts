import { bufferToString, parseHeaders, parseJson } from './utils'
import { Request, RequestOptions, RequestState } from './request'

/**
 * Request data from URL using `XMLHttpRequest`.
 * @param url Request URL.
 * @param options Request options
 * @see https://javascript.info/xmlhttprequest
 */

export const request: Request = (url: string | URL, options = {} as RequestOptions<any>) => new Promise<any>((resolve, reject) => {
  // --- Destructure options.
  const {
    data, timeout, encoding, noCors, returnState, headers = {}, method = 'GET', parser = data => parseJson(bufferToString(data)),
  } = options

  // --- Define methods.
  const state = <RequestState<any, XMLHttpRequest, XMLHttpRequest>>{
    get status() { return this.request.status },
    get headers() { return parseHeaders(this.response.getAllResponseHeaders()) },
    get response() { return this.request },
  }

  // --- Initialize the request
  state.request = new XMLHttpRequest()
  state.request.open(method, url)
  state.request.responseType = 'arraybuffer'
  state.request.withCredentials = !!noCors
  if (!noCors) {
    headers['Access-Control-Allow-Origin'] = '*'
    headers['X-Requested-With'] = 'XMLHttpRequest'
  }
  if (timeout) state.request.timeout = timeout
  if (encoding) state.request.setRequestHeader('Content-Encoding', encoding)

  // --- Set headers.
  for (const key in headers) {
    state.request.setRequestHeader(
      key.toLocaleLowerCase(),
      // @ts-expect-error: `headers` IS defined.
      headers[key].toString(),
    )
  }

  // --- On stream end, parse data and resolve promise.
  state.request.addEventListener('readystatechange', () => {
    if (state.request.readyState === 4) {
      try { state.data = parser ? parser(state.request.response) : state.request.response }
      catch (error) { reject(error) }
      resolve(returnState ? state : state.data)
    }

    if (state.response.status !== 200)
      reject(state.request.statusText)
  })

  // --- Error handling.
  state.request.addEventListener('error', () => reject(state.request.statusText))
  state.request.addEventListener('timeout', () => reject(new Error('Timeout')))
  state.request.addEventListener('abort', () => reject(new Error('Aborted')))

  // --- Send the request.
  state.request.send(data)
})
