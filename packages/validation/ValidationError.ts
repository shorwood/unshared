/**
 * A unique code that identifies the error. This code must start with `E_` and
 * be in uppercase snake case. Best-practice is to use a concise, descriptive
 * name that is unique to the error. The type of the error should be the first
 * part of the name, followed by an underscore, followed by a short description
 * of the error.
 *
 * This normalization allows the error code to be used as a key in a dictionary
 * of error messages and easily converted to a human-readable string with
 * i18n-like tools.
 *
 * @example 'E_EMAIL_REQUIRED'
 */
export type ValidationErrorCode = `E_${Uppercase<string>}`

/**
 * A validation error is an error that is thrown when a value is invalid. It is
 * used to provide a more detailed error message to the user.
 */
export interface ValidationErrorOptions extends Pick<Error, 'message' | 'stack'> {

  /**
   * A unique code that identifies the error. This code must start with `E_` and
   * be in uppercase snake case. Best-practice is to use a concise, descriptive
   * name that is unique to the error. The type of the error should be the first
   * part of the name, followed by an underscore, followed by a short description
   * of the error.
   *
   * This normalization allows the error code to be used as a key in a dictionary
   * of error messages and easily converted to a human-readable string with
   * i18n-like tools.
   *
   * @example 'E_EMAIL_REQUIRED'
   */
  code: ValidationErrorCode
}

/**
 * Class that represents a validation error. It is used to store the result of a validation.
 */
export class ValidationError extends Error {

  /**
   * Create a new `ValidationError` instance.
   *
   * @param options A validation error code or the options to use.
   * @example new ValidationError('E_INVALID_EMAIL')
   */
  constructor(options: Error | Partial<ValidationError> | string) {
    super()

    // --- If the options is a string, use it as the error code.
    if (typeof options === 'string') {
      this.message = options
    }

    // --- If the options is an error, use it as the cause.
    else if (options instanceof Error) {
      this.stack = options.stack
      this.causes = [options]
      this.message = options.message
    }

    // --- Otherwise, copy the options to the instance.
    else {
      if (options.name) this.name = options.name
      if (options.stack) this.stack = options.stack
      if (options.causes) this.causes = options.causes
      if (options.message) this.message = options.message
      if (options.statusCode) this.statusCode = options.statusCode
    }
  }

  /**
   * A unique code that identifies the error. This code must start with `E_` and
   * be in uppercase snake case. Best-practice is to use a concise, descriptive
   * name that is unique to the error. The type of the error should be the first
   * part of the name, followed by an underscore, followed by a short description
   * of the error.
   *
   * This normalization allows the error code to be used as a key in a dictionary
   * of error messages and easily converted to a human-readable string with
   * i18n-like tools.
   *
   * @example 'E_EMAIL_REQUIRED'
   */
  name: ValidationErrorCode = 'E_VALIDATION_ERROR'

  /**
   * The errors that caused this one. This is an array of `Error` instances that
   * represents all the errors in a rule set that failed validation.
   *
   * @example [Error, Error]
   */
  causes: Error[] | Record<PropertyKey, Error> | undefined

  /**
   * An HTTP status code that can be used to determine the severity of the error.
   * This is useful when the error is returned as a response to an HTTP request.
   *
   * @default 500
   */
  statusCode = 500
}

/* v8 ignore start */
if (import.meta.vitest) {
  test('should create a ValidationError instance from a string', () => {
    const result = new ValidationError('Custom message error')
    expect(result).toMatchObject({
      name: 'E_VALIDATION_ERROR',
      message: 'Custom message error',
      statusCode: 500,
    })
  })

  test('should create a ValidationError instance from options', () => {
    const result = new ValidationError({
      name: 'E_UNKNOWN_ERROR',
      message: 'Custom error message',
      causes: [new Error('Cause of the error')],
      statusCode: 401,
      stack: 'stack',
    })
    expect(result).toMatchObject({
      name: 'E_UNKNOWN_ERROR',
      message: 'Custom error message',
      causes: [new Error('Cause of the error')],
      statusCode: 401,
      stack: 'stack',
    })
  })
}
