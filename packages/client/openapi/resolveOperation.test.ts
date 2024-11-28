import type { Operation } from './resolveOperation'
import { resolveOperation } from './resolveOperation'

describe('getOperationById', () => {
  const document = {
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

  describe('with a valid operationId', () => {
    it('should return the correct operation for a valid operationId', () => {
      const result = resolveOperation(document, 'deleteUser')
      expect(result).toStrictEqual({
        operationId: 'deleteUser',
        method: 'delete',
        path: '/users/{username}',
      })
    })
  })

  describe('inference', () => {
    it('should infer the correct operation type', () => {
      const result = () => resolveOperation(document, 'getUser')
      expectTypeOf(result).toEqualTypeOf<() => {
        readonly operationId: 'getUser'
        method: 'get'
        path: '/users/{username}'
      }>()
    })

    it('should infer a simple `Operation` type', () => {
      const result = () => resolveOperation(document, 'UNKNOWN')
      expectTypeOf(result).toEqualTypeOf<() => Operation>()
    })
  })

  describe('edge cases', () => {
    it('should throw an error for an invalid operationId', () => {
      const shouldThrow = () => resolveOperation({ paths: {} }, 'invalidOperationId')
      expect(shouldThrow).toThrowError('Operation "invalidOperationId" not found in specification.')
    })

    it('should throw an error if the paths object is missing', () => {
      const shouldThrow = () => resolveOperation({}, 'getUsers')
      expect(shouldThrow).toThrowError('Missing paths object in the OpenAPI specification.')
    })
  })
})
