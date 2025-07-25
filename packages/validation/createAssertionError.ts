import type { JSONSchema7 } from 'json-schema'

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
export type AssertionErrorName = `E_${Uppercase<string>}`

/** The options to create a new {@link AssertionError} instance. */
export interface AssertionErrorOptions extends Partial<Pick<Error, 'message'>> {

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
  name?: AssertionErrorName

  /**
   * The context of the error. This is an object that contains additional and
   * serializeable information about the error. It can be used to provide more
   * context to the error message and help the user understand the error better.
   * It is recommended to use a flat object with primitive values.
   *
   * @example { value: 10, min: 0, max: 5 }
   */
  context?: Record<string, unknown>

  /**
   * A JSON Schema V7 compatible schema that describes the expected shape of the
   * value that caused the error. This schema can also be used to infer the type
   * of a parser at runtime and provide documentation for values that are passed
   * to the function.
   */
  schema?: JSONSchema7

  /**
   * The cause of the error. This is the error that caused this validation error.
   */
  cause?: unknown
}

/**
 * A `AssertionError` is an error that is thrown when a value fails some kind
 * of validation. It is used to provide a more detailed and contextually
 * relevant error message to the user.
 *
 * @example
 * // Create a new validation error from a string.
 * throw new AssertionError('E_EMAIL_REQUIRED')
 *
 * // Create a new validation error from an error.
 * throw new AssertionError(new Error('E_EMAIL_REQUIRED'))
 *
 * // Create a new validation error from options.
 * throw new AssertionError({
 *   name: 'E_EMAIL_REQUIRED',
 *   message: 'An email is required.',
 *   context: { value: 'example@acme.com' },
 * })
 */
export class AssertionError extends Error implements AssertionErrorOptions {
  constructor(options?: AssertionErrorName | AssertionErrorOptions | Error) {
    super()

    // --- If the options is a string, use it as the error code.
    if (typeof options === 'string') {
      this.name = options
    }

    // --- If the options is an error instance, use it as the cause.
    else if (options instanceof Error) {
      this.cause = options
      this.message = options.message
      this.stack = options.stack
    }

    // --- Otherwise, copy the options to the instance.
    else if (typeof options === 'object') {
      if (options.name) this.name = options.name
      if (options.message) this.message = options.message
      if (options.context) this.context = options.context
      if (options.schema) this.schema = options.schema
      if (options.cause) this.cause = options.cause
    }
  }

  name = 'E_ASSERTION_ERROR' as AssertionErrorName
  message = 'An assertion failed.'
  context: Record<string, unknown> = {}
  schema?: JSONSchema7 = undefined
}

/**
 * Create a new `AssertionError` instance. A `AssertionError` is an error that
 * is thrown when a value fails some kind of validation. It is used to provide a
 * more detailed and contextually relevant error message to the user.
 *
 * @param options The options to create the validation error from.
 * @returns The created validation error.
 * @example
 * // Create a new validation error from a string.
 * throw createAssertionError('E_EMAIL_REQUIRED')
 *
 * // Create a new validation error from an error.
 * throw createAssertionError(new Error('E_EMAIL_REQUIRED'))
 *
 * // Create a new validation error from options.
 * throw createAssertionError({ name: 'E_EMAIL_REQUIRED', stack: 'stack' })
 */
export function createAssertionError(options?: AssertionErrorName | AssertionErrorOptions | Error): AssertionError {
  return new AssertionError(options)
}
