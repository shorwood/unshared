import type { Operation } from './getOperationById'
import { getOperationByRoute } from './getOperationByRoute'

describe('getOperationByRoute', () => {
  const specifications = {
    paths: {
      '/users': {
        get: { operationId: 'getUsers' },
        post: { operationId: 'createUser' },
      },
      '/users/{username}': {
        get: { operationId: 'getUser' },
        delete: { operationId: 'deleteUser' },
      },
    },
  } as const

  it('should return the correct operation for a valid route name', () => {
    const result = getOperationByRoute(specifications, 'DELETE /users/{username}')
    expect(result).toStrictEqual({
      operationId: 'deleteUser',
      method: 'delete',
      path: '/users/{username}',
    })
  })

  describe('inference', () => {
    it('should infer the correct operation type', () => {
      const result = getOperationByRoute(specifications, 'GET /users/{username}')
      expectTypeOf(result).toEqualTypeOf<{
        readonly operationId: 'getUser'
        method: 'get'
        path: '/users/{username}'
      }>()
    })

    it('should fallback to the OpenAPI.Operation type', () => {
    // @ts-expect-error: route name is unknown
      const result = getOperationByRoute(specifications, 'UNKNOWN /route')
      expectTypeOf(result).toEqualTypeOf<Operation>()
    })
  })

  describe('edge cases', () => {
    it('should throw an error for an invalid route name', () => {
      // @ts-expect-error: route name is invalid
      const shouldThrow = () => getOperationByRoute(specifications, 'INVALID /route')
      expect(shouldThrow).toThrowError('Could not resolve the path and method from the route name.')
    })

    it('should throw an error if the route is not found in the specification', () => {
      // @ts-expect-error: route name is invalid
      const shouldThrow = () => getOperationByRoute(specifications, 'GET /invalid')
      expect(shouldThrow).toThrowError('Route "GET /invalid" not found in specification.')
    })

    it('should throw an error if the paths object is missing', () => {
      const shouldThrow = () => getOperationByRoute({}, 'GET /users')
      expect(shouldThrow).toThrowError('Missing paths object in the OpenAPI specification.')
    })
  })
})
