import { toCamelCase } from '@unshared/string/toCamelCase'
import { OpenAPIV3 } from 'openapi-types'
import { HttpMethodEnum } from '../../httpMethod'
import { createMethodParameters } from './createMethodParameters'
import { ResolvedDeep } from './resolveDocument'

export interface CreateMethodContext {
  path: string
  method: string
  operation: ResolvedDeep<OpenAPIV3.OperationObject>
  client: any
}

/**
 * Create a `fetch` method from an OpenAPI operation specification.
 *
 * @param context The context derived from the OpenAPI specification.
 * @returns The `fetch` method.
 */
export function createMethods(context: CreateMethodContext) {
  const { path, method, operation, client } = context

  if (typeof path !== 'string') throw new TypeError('Expected path to be a string.')
  if (typeof method !== 'string') throw new TypeError('Expected method to be a string.')
  if (typeof operation !== 'object') throw new TypeError('Expected operation to be an object.')
  if (typeof client !== 'object') throw new TypeError('Expected client to be an object.')

  // --- Assert that the method is a valid HTTP method.
  const isHttpMethod = Object.values<string>(HttpMethodEnum).includes(method.toUpperCase())
  if (!isHttpMethod) throw new TypeError('Expected method to be a valid HTTP method.')

  // --- Compute key from operationId or path.
  const key = operation.operationId
    ? toCamelCase(operation.operationId)
    : toCamelCase(`${method} ${path}`)
  const keyRaw = `$${key}`

  // --- Create and assign the methods.
  const fetchRaw = async(userOptions: Record<string, any>) => {
    const methodParameters = createMethodParameters(userOptions, context)
    return await client.fetchRaw(...methodParameters)
  }

  const fetchData = async(options: Record<string, any>) => {
    const methodParameters = createMethodParameters(options, context)
    return await client.fetchData(...methodParameters)
  }

  // --- Return the methods.
  return { [key]: fetchData, [keyRaw]: fetchRaw }
}
