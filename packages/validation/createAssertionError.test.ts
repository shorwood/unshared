import { AssertionError, createAssertionError } from './createAssertionError'

describe('createAssertionError', () => {
  it('should create a AssertionError instance', () => {
    const result = createAssertionError()
    expect(result).toBeInstanceOf(AssertionError)
  })

  it('should create a AssertionError instance with default values', () => {
    const result = createAssertionError()
    expect(result).toMatchObject({
      name: 'E_ASSERTION_ERROR',
      message: 'An assertion failed.',
      context: {},
    })
  })

  it('should create a AssertionError instance with the given name', () => {
    const result = createAssertionError('E_ASSERTION_ERROR')
    expect(result).toMatchObject({
      name: 'E_ASSERTION_ERROR',
      message: 'An assertion failed.',
      context: {},
    })
  })

  it('should create a AssertionError instance with the given error', () => {
    const error = new Error('Something went wrong.')
    const result = createAssertionError(error)
    expect(result).toMatchObject({
      name: 'E_ASSERTION_ERROR',
      message: 'Something went wrong.',
      stack: error.stack,
      context: {},
      cause: error,
    })
  })

  it('should create a AssertionError instance with the given options', () => {
    const result = createAssertionError({
      name: 'E_CUSTOM_ERROR',
      message: 'A custom error occurred.',
      context: { key: 'value' },
    })
    expect(result).toMatchObject({
      name: 'E_CUSTOM_ERROR',
      message: 'A custom error occurred.',
      context: { key: 'value' },
    })
  })
})
