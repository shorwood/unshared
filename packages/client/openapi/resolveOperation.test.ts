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

  it('should return the correct operation for a valid operationId', () => {
    const result = resolveOperation(document, 'deleteUser')
    expect(result).toStrictEqual({
      operationId: 'deleteUser',
      method: 'delete',
      path: '/users/{username}',
    })
  })

  describe('inference', () => {
    it('should infer the correct operation type', () => {
      const result = resolveOperation(document, 'getUser')
      expectTypeOf(result).toEqualTypeOf<Operation>()
    })

    it('should fallback to the OpenAPI.Operation type for an unknown operationId', () => {
    // @ts-expect-error: operationId is unknown
      const result = resolveOperation(document, 'unknownOperationId')
      expectTypeOf(result).toEqualTypeOf<Operation>()
    })

    it('should fallback to the OpenAPI.Operation type for an unknown specification', () => {
      const result = resolveOperation({}, 'unknownOperationId')
      expectTypeOf(result).toEqualTypeOf<Operation>()
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
