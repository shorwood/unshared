import { createValidationError, ValidationError } from './createValidationError'

describe('createValidationError', () => {
  test('should create a ValidationError instance', () => {
    const result = createValidationError()
    expect(result).toBeInstanceOf(ValidationError)
  })

  test('should create a ValidationError instance with default values', () => {
    const result = createValidationError()
    expect(result).toMatchObject({
      name: 'E_VALIDATION_ERROR',
      message: 'A validation error occurred.',
      context: {},
    })
  })

  test('should create a ValidationError instance with the given name', () => {
    const result = createValidationError('E_VALIDATION_ERROR')
    expect(result).toMatchObject({
      name: 'E_VALIDATION_ERROR',
      message: 'A validation error occurred.',
      context: {},
    })
  })

  test('should create a ValidationError instance with the given error', () => {
    const error = new Error('Something went wrong.')
    const result = createValidationError(error)
    expect(result).toMatchObject({
      name: 'E_VALIDATION_ERROR',
      message: 'A validation error occurred.',
      context: {},
      cause: error,
    })
  })

  test('should create a ValidationError instance with the given options', () => {
    const result = createValidationError({
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
