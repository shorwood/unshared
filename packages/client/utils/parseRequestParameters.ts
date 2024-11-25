import type { RequestContext, RequestOptions } from './parseRequest'
import { isObjectLike } from './isObjectLike'

/** Regular expression to match path parameters in the URL. */
const EXP_PATH_PARAMETER = /:([\w-]+)|%7B([\w-]+)%7D/g

/**
 * Parse the request parameters from the request data. This function will append
 * the path parameters to the URL based on the method and the data provided.
 *
 * @param route The name of the route to fetch. (ignored)
 * @param options The options to pass to the request.
 * @param context The request context to modify.
 * @example
 * // Using `express` style path parameters.
 * parseRequestParameters('GET /users/:id', { data: { id: 1 } }, context)
 *
 * // Using `OpenAPI` style path parameters.
 * parseRequestParameters('GET /users/{id}', { data: { id: 1 } }, context)
 */
export function parseRequestParameters(route: string, options: Pick<RequestOptions, 'data' | 'parameters'>, context: RequestContext): void {
  const { url } = context
  const { data, parameters = {} } = options

  // --- If the method has a parameter, fill the path with the data.
  if (!url) throw new Error('Could not resolve the `RequestInit` object: the `url` is missing.')
  const pathParameters = url.pathname.match(EXP_PATH_PARAMETER)
  if (!pathParameters) return

  // --- Apply the path parameters to the URL.
  for (const parameter of pathParameters.values()) {
    const key = parameter.replaceAll(EXP_PATH_PARAMETER, '$1$2')

    // --- If the parameter is provided, replace the path with the value.
    const value = parameters[key]
    if (value !== undefined && typeof value === 'string') {
      url.pathname = url.pathname.replace(parameter, value)
    }

    // --- If the data contains the parameter, use it and remove it from the data.
    else if (isObjectLike(data) && data[key] !== undefined && typeof data[key] === 'string') {
      url.pathname = url.pathname.replace(parameter, data[key])
      delete data[key]
    }
  }
}
