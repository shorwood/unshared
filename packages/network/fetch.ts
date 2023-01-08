/* eslint-disable unicorn/no-null */
import { parseJson } from '@unshared-dev/module'

/**
 * Fetches a resource from the network using the same specification
 * as the browser's `fetch` API.
 *
 * This can be used as a drop-in
 * replacement for `fetch` in the browser.
 *
 * Original source: [developit/unfetch](https://github.com/developit/unfetch/blob/master/src/index.mjs)
 *
 * @param url The URL to fetch
 * @param options The options to use
 * @return The response
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 * @example
 * await fetch('https://example.com')
 */
export const fetch = (url: string, options: RequestInit = {}): Promise<Response> => {
  const {
    method = 'get',
    headers = {},
    credentials,
    body = null,
  } = options

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    const responseHeaders: Record<string, string> = {}

    // --- Initialize the response object.
    const response = () => ({
      ok: request.status >= 200 && request.status < 300,
      statusText: request.statusText,
      status: request.status,
      url: request.responseURL,
      redirected: request.responseURL !== url,
      body: request.response,
      bodyUsed: request.response !== null,
      clone: response,
      type: 'basic',
      text: () => Promise.resolve(request.responseText),
      json: () => Promise.resolve(request.responseText).then(parseJson),
      blob: () => Promise.resolve(new Blob([request.response])),
      headers: {
        keys: () => Object.keys(responseHeaders),
        entries: () => Object.entries(responseHeaders),
        get: (name: string) => responseHeaders[name.toLowerCase()],
        has: (name: string) => name.toLowerCase() in responseHeaders,
      },
    })

    // --- Open the request.
    request.open(method, url, true)

    // --- Reject the promise on the `error` event.
    request.addEventListener('error', reject)

    // --- Store the response headers on the `load` event.
    request.addEventListener('load', () => {
      const headerMatches = request
        .getAllResponseHeaders()
        .matchAll(/^(.*?):[^\S\n]*([\S\s]*?)$/gm)
      for (const [, keyCased, value] of headerMatches) {
        const key = keyCased.toLowerCase()
        if (key in responseHeaders) responseHeaders[key] += `, ${value}`
        else responseHeaders[key] = value
      }

      // @ts-expect-error: Only partially implemented.
      resolve(response())
    })

    // --- Set the request headers.
    for (const index in headers) // @ts-expect-error: Types will match.
      request.setRequestHeader(index, headers[index])

    // --- Send the request.
    request.withCredentials = credentials === 'include'
    // @ts-expect-error: Types will match.
    request.send(body)
  })
}
