import type { ObjectLike } from '@unshared/types'
import type { RequestContext } from './parseRequest'

/** Regular expression to match path parameters in the URL. */
const EXP_PATH_PARAMETER = /:([\w-]+)|%7B([\w-]+)%7D/g

/** The options to pass to the `parseRequestParameters` function. */
export interface RequestParametersOptions<T extends ObjectLike = ObjectLike> {

  /**
   * The path parameters to include in the request.
   */
  parameters?: T
}

/**
 * Parse the request parameters from the request data. This function will mutate the
 * `url` object of the context to include the path parameters based on the provided data.
 *
 * @param context The request context to mutate.
 * @param options The options to pass to the request.
 * @example
 * // Using `express` style path parameters.
 * parseRequestParameters({ url: new URL('https://api.example.com/users/:id') }, { parameters: { id: 1 } })
 *
 * // Using `OpenAPI` style path parameters.
 * parseRequestParameters({ url: new URL('https://api.example.com/users/{id}') }, { parameters: { id: 1 } })
 */
export function parseRequestParameters(context: RequestContext, options: RequestParametersOptions): void {
  const { url } = context
  const { parameters } = options

  // --- Return early if the parameters is not an object.
  if (typeof parameters !== 'object' || parameters === null) return
  if (url === undefined) return
  if (url instanceof URL === false) throw new Error('The `url` must be an instance of `URL`.')

  // --- If the method has a parameter, fill the path with the data.
  const pathParameters = url.pathname.match(EXP_PATH_PARAMETER)
  if (!pathParameters) return

  // --- Apply the path parameters to the URL.
  for (const parameter of pathParameters.values()) {
    const key = parameter.replaceAll(EXP_PATH_PARAMETER, '$1$2')
    const value = parameters[key]

    // --- If the parameter is provided, replace the path with the value.
    if (
      (typeof value === 'string' && value.length > 0)
      || (typeof value === 'number' && Number.isFinite(value))
      || (typeof value === 'boolean')
    ) {
      url.pathname = url.pathname.replace(parameter, value.toString())
      delete parameters[key]
    }
  }
}
