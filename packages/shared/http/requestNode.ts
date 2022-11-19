import { ClientRequest, IncomingMessage } from 'node:http'
import { parseCookies, parseJson } from './utils'
import { Request, RequestOptions, RequestState } from './request'

/**
 * Request data from URL using `node:https`.
 * @param url Request URL.
 * @param options Request options
 * @see https://ozzyczech.cz/js/fetch-in-pure-node-js/
 */

export const request: Request = (url: string | URL, options = {} as RequestOptions<any>) => new Promise<any>((resolve, reject) => {
  // --- Destructure options.
  const { parser = parseJson, returnState = false } = options

  // --- Define methods.
  const state = <RequestState<any, ClientRequest, IncomingMessage>>{
    get status() { return this.response.statusCode },
    get headers() { return this.response.headers },
    get cookies() { return parseCookies(this.headers.cookies as string) },
  }

  // --- Make the request.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  state.request = require('node:https').request(url, options, (response: IncomingMessage) => {
    // --- Pipe data & save response headers.
    const data: Uint8Array[] = []
    response.on('data', chunk => data.push(chunk))

    // --- On stream end, parse data and resolve promise.
    response.on('end', () => {
      try {
        state.data = Buffer.concat(data)
        state.data = parser(state.data)
      }
      catch (error) { reject(error) }
      resolve(returnState ? state : state.data)
    })
  })

  // --- Error handling.
  state.request.on('error', reject)
  state.request.end()
})
