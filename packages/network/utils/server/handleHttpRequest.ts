import { attempt } from '@unshared/functions/attempt'
import { RequestContext } from '../../createServerRoute'
import { HttpError } from '../../HttpError'
import { handleHttpResult } from './handleHttpResult'
import { isRouteMatch } from './isRouteMatch'

/**
 * Handles an HTTP/2 request. This function will loop through the routes and
 * call the appropriate handler. If the handler returns a value, the value will
 * be sent as the response body.
 *
 * @param context The request context.
 * @example
 * const server = createServer(routes)
 * server.on('request', handleHttpRequest)
 * server.on('stream', handleHttpRequest)
 * server.listen(8080)
 */
export async function handleHttpRequest(context: Omit<RequestContext, 'next'>) {
  const { routes, request } = context

  // --- Loop through the routes and call the appropriate handler.
  for (const routeName in routes) {
    // @ts-expect-error: ignore
    const route = routes[routeName] as Route
    const isMatch = isRouteMatch(route, request)
    if (!isMatch) continue

    // --- Create the next function.
    let shouldContinue = false
    const next = () => shouldContinue = true

    // --- Call the handlers and handle the result.
    for (const handler of route.handlers) {
      if (shouldContinue) continue
      const handlerContext = { ...context, next }
      const handlerBound = handler.bind(handlerContext)
      const result = await attempt<any, HttpError>(handlerBound)
      handleHttpResult(handlerContext, result)
    }
  }
}
