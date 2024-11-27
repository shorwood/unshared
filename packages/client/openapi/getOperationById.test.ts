import type { Operation } from './getOperationById'
import { getOperationById } from './getOperationById'

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
    const result = getOperationById(document, 'deleteUser')
    expect(result).toStrictEqual({
      operationId: 'deleteUser',
      method: 'delete',
      path: '/users/{username}',
    })
  })

  describe('inference', () => {
    it('should infer the correct operation type', () => {
      const result = getOperationById(document, 'getUser')
      expectTypeOf(result).toEqualTypeOf<Operation>()
    })

    it('should fallback to the OpenAPI.Operation type for an unknown operationId', () => {
    // @ts-expect-error: operationId is unknown
      const result = getOperationById(document, 'unknownOperationId')
      expectTypeOf(result).toEqualTypeOf<Operation>()
    })

    it('should fallback to the OpenAPI.Operation type for an unknown specification', () => {
      const result = getOperationById({}, 'unknownOperationId')
      expectTypeOf(result).toEqualTypeOf<Operation>()
    })
  })

  describe('edge cases', () => {
    it('should throw an error for an invalid operationId', () => {
      const shouldThrow = () => getOperationById({ paths: {} }, 'invalidOperationId')
      expect(shouldThrow).toThrowError('Operation "invalidOperationId" not found in specification.')
    })

    it('should throw an error if the paths object is missing', () => {
      const shouldThrow = () => getOperationById({}, 'getUsers')
      expect(shouldThrow).toThrowError('Missing paths object in the OpenAPI specification.')
    })
  })
})
