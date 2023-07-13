/* eslint-disable sonarjs/cognitive-complexity */
import { toCamelCase } from '@unshared/string/toCamelCase'
import { assertSchema } from './assertSchema'
import { CreateMethodContext } from './createMethods'

/**
 * Creates the `RequestInit` options from a user-provided object. This function
 * will map the user-provided options to the OpenAPI specification.
 *
 * @param options The user-provided options.
 * @param context The context derived from the OpenAPI specification.
 * @returns The options for the fetch request.
 */
export function createMethodParameters(
  options: Record<string, any> = {},
  context: CreateMethodContext,
) {
  // --- Initialize the variables.
  const { path, method, operation } = context
  const initOptions: RequestInit = { method }
  let resolvedPath = path

  // --- Fill in the path parameters.
  if (operation.parameters) {
    for (const key in operation.parameters) {
      const parameter = operation.parameters[key]
      const schema = parameter.schema
      const keyCamelCase = toCamelCase(parameter.name)
      const value = options[keyCamelCase]

      // --- Assert the presence of required parameters.
      if (!schema) {
        console.error('parameter', operation.parameters)
        throw new TypeError(`Expected schema for '${name}' to be defined.`)
      }
      assertSchema(value, schema)

      // --- Fill in the path parameter.
      if (parameter.in === 'path')
        resolvedPath = resolvedPath.replace(`{${parameter.name}}`, value)

      // --- Fill in the query parameter.
      if (parameter.in === 'query') {
        const urlObject = new URL(resolvedPath, 'http://localhost')
        urlObject.searchParams.append(parameter.name, value)
        resolvedPath = urlObject.pathname + urlObject.search
      }
    }
  }

  // --- Fill in the request body.
  const requestBodySchema = operation.requestBody?.content['application/json'].schema
  const requestBodyType = requestBodySchema?.type
  const requestBodyProperties = requestBodySchema?.properties

  // --- Fill in the request body.
  const body: Record<string, any> = {}
  if (requestBodyType && requestBodyProperties) {
    for (const name in requestBodyProperties) {
      const value = options[name]
      const schema = requestBodyProperties[name]

      if (!schema) throw new TypeError(`Expected schema for '${name}' to be defined.`)

      // --- Assert the value is valid.
      assertSchema(value, schema)
      body[name] = value
    }
  }

  return [path, initOptions]
}
