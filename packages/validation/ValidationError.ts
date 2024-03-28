import { RuleLike } from './createRule'

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
export interface ValidationErrorOptions extends Error {
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
  /**
   * The rule that caused the error. This is used to provide more context to the
   * error allowing better error messages to be generated.
   *
   * @example { handler: isEmail, parameters: [], message: 'E_INVALID_EMAIL' }
   */
  rule?: RuleLike
  /**
   * An HTTP status code that can be used to determine the severity of the error.
   * This is useful when the error is returned as a response to an HTTP request.
   *
   * @example 400
   */
  statusCode: number
}

/**
 * Class that represents a validation error. It is used to store the result of a validation.
 */
export class ValidationError extends Error implements ValidationErrorOptions {
  /**
   * Create a new `ValidationError` instance.
   *
   * @param options A validation error code or the options to use.
   * @example new ValidationError('E_INVALID_EMAIL')
   */
  constructor(options: Partial<ValidationErrorOptions> | ValidationErrorCode) {
    super()

    // --- If the options is a string, use it as the error code.
    if (typeof options === 'string')
      options = { code: options }

    // --- Copy the options to the instance.
    this.code = options.code ?? 'E_VALIDATION_ERROR'
    this.statusCode = options.statusCode ?? 400
    this.rule = options.rule
    this.message = options.message ?? this.code
    this.cause = options.cause
    this.name = 'ValidationError'
  }

  /** A unique code that identifies the error. */
  code: `E_${Uppercase<string>}` = 'E_VALIDATION_ERROR'

  /** An HTTP status code that can be used to determine the severity of the error. */
  statusCode = 400

  /** The rule that caused the error. */
  rule?: RuleLike | undefined
}

/** v8 ignore start */
if (import.meta.vitest) {
  it('should create a ValidationError instance', () => {
    const result = new ValidationError('E_UNKNOWN_ERROR')
    expect(result).toStrictEqual({
      code: 'E_UNKNOWN_ERROR',
      rule: undefined,
      statusCode: 400,
    })
  })

  it('should create a ValidationError instance with options', () => {
    const error = new ValidationError({ code: 'E_UNKNOWN_ERROR' })
    expect(error.code).toEqual('E_UNKNOWN_ERROR')
  })
}
