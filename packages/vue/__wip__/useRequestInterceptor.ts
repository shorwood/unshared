import { onScopeDispose } from 'vue-demi'

/** The context of a fetch request. */
export interface FetchInterceptorContext {
  input: RequestInfo | URL
  init?: RequestInit
  response: Promise<Response>
}

/**
 * A function that can be used to intercept fetch requests.
 *
 * @param context The request context.
 * @example (context) => { console.log(context.input); }
 */
export type FetchInterceptor = (context: FetchInterceptorContext) => void

/** Global set of all fetch interceptors. */
const listeners = new Set<FetchInterceptor>()

/**
 * Intercept all fetch requests and call the given callback with the request
 * context. This can be useful for automatically adding headers, logging
 * requests, etc.
 *
 * @param callback The function to call with the request context.
 * @returns A function to remove the interceptor.
 * @example
 *
 * // Add a bearer token to all requests.
 * const removeInterceptor = useRequestInterceptor(({ init }) => {
 *   init.headers = new Headers(init.headers);
 *   init.headers.set('Authorization', `Bearer ${token}`);
 * });
 *
 * // Log all errors.
 * const removeInterceptor = useRequestInterceptor(({ response }) => {
 *   const { status, statusText } = await response;
 *   if (status >= 400) console.error(status, statusText);
 * });
 */
export function useRequestInterceptor(callback: FetchInterceptor) {
  // --- Store the original function for later restoration.
  const originalFetch = globalThis.fetch

  // --- Wrap the fetch function to call the listeners.
  if (listeners.size === 0) {
    globalThis.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    // --- Buffer the `json` body to circumvent consumption order.
      const response = originalFetch(input, init).then(async(x) => {
        const jsonResult = await x.json()
        x.json = () => Promise.resolve(jsonResult)
        return x
      })

      // --- Call each listeners.
      for (const listener of listeners) listener({ input, init, response })
      return response
    }
  }

  // --- Define a function to remove the listener. When there are no more
  // --- listeners, restore the original fetch function.
  const removeListener = () => {
    listeners.delete(callback)
    if (listeners.size === 0) globalThis.fetch = originalFetch
  }

  onScopeDispose(removeListener)
  listeners.add(callback)
  return removeListener
}
