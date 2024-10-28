/**
 * A unique code that identifies the error. This code must start with `E_` and
 * be in uppercase snake case. It is recommended to use a concise, descriptive
 * name that is unique to the error. The type of the error should be the first
 * part of the name, followed by an underscore, followed by a short description
 * of the error.
 *
 * This normalization allows the error code to be used as a key in a dictionary
 * of error messages and easily converted to a human-readable string with
 * internationalization (i18n) tools.
 *
 * @example
 * // First part is the scope, followed by what the error is about.
 * 'E_EMAIL_REQUIRED'
 * 'E_SESSION_TOKEN_EXPIRED'
 * 'E_PASSWORD_TOO_SHORT'
 */
export type ValidationErrorCode = `E_${Uppercase<string>}`

/** The options to create a new {@link ValidationError} instance. */
export interface ValidationErrorOptions extends Pick<Error, 'message'> {

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
   * @example 'E_NUMBER_NOT_IN_RANGE'
   */
  name: ValidationErrorCode

  /**
   * The context of the error. This is an object that contains additional and
   * serializeable information about the error. It can be used to provide more
   * context to the error message and help the user understand the error better.
   * It is recommended to use a flat object with primitive values.
   *
   * @example { value: 10, min: 0, max: 5 }
   */
  context?: Record<string, unknown>
}

/**
 * A `ValidationError` is an error that is thrown when a value fails some kind
 * of validation. It is used to provide a more detailed and contextually
 * relevant error message to the user.
 *
 * @example
 * // Create a new validation error from a string.
 * throw new ValidationError('E_EMAIL_REQUIRED')
 *
 * // Create a new validation error from an error.
 * throw new ValidationError(new Error('E_EMAIL_REQUIRED'))
 *
 * // Create a new validation error from options.
 * throw new ValidationError({
 *   name: 'E_EMAIL_REQUIRED',
 *   message: 'An email is required.',
 *   context: { value: 'example@acme.com' },
 * })
 */
export class ValidationError extends Error implements ValidationErrorOptions {
  constructor(options?: Error | ValidationErrorCode | ValidationErrorOptions) {
    super()

    // --- If the options is a string, use it as the error code.
    if (typeof options === 'string') {
      this.name = options
    }

    // --- If the options is an error instance, use it as the cause.
    else if (options instanceof Error) {
      this.cause = options
    }

    // --- Otherwise, copy the options to the instance.
    else if (typeof options === 'object') {
      if (options.name) this.name = options.name
      if (options.message) this.message = options.message
      if (options.context) this.context = options.context
    }
  }

  name = 'E_VALIDATION_ERROR' as ValidationErrorCode
  message = 'A validation error occurred.'
  context: Record<string, unknown> = {}
}

/**
 * Create a new `ValidationError` instance. A `ValidationError` is an error that
 * is thrown when a value fails some kind of validation. It is used to provide a
 * more detailed and contextually relevant error message to the user.
 *
 * @param options The options to create the validation error from.
 * @returns The created validation error.
 * @example
 * // Create a new validation error from a string.
 * throw createValidationError('E_EMAIL_REQUIRED')
 *
 * // Create a new validation error from an error.
 * throw createValidationError(new Error('E_EMAIL_REQUIRED'))
 *
 * // Create a new validation error from options.
 * throw createValidationError({ name: 'E_EMAIL_REQUIRED', stack: 'stack' })
 */
export function createValidationError(options?: Error | ValidationErrorCode | ValidationErrorOptions): ValidationError {
  return new ValidationError(options)
}
