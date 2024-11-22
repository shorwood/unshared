import { getOperationById } from './getOperationById'

describe('getOperationById', () => {
  const specifications = { paths: {
    '/users': {
      get: { operationId: 'getUsers' },
      post: { operationId: 'createUser' },
    },
    '/users/{username}': {
      get: { operationId: 'getUser' },
      delete: { operationId: 'deleteUser' },
    },
  } } as const

  it('should return the correct operation for a valid operationId', () => {
    const result = getOperationById(specifications, 'deleteUser')
    expect(result).toStrictEqual({
      operationId: 'deleteUser',
      method: 'delete',
      path: '/users/{username}',
    })
  })

  it('should throw an error for an invalid operationId', () => {
    const shouldThrow = () => getOperationById({ paths: {} }, 'invalidOperationId')
    expect(shouldThrow).toThrowError('Operation "invalidOperationId" not found in specification.')
  })

  it('should throw an error if the paths object is missing', () => {
    const shouldThrow = () => getOperationById({}, 'getUsers')
    expect(shouldThrow).toThrowError('Missing paths object in the OpenAPI specification.')
  })
})
