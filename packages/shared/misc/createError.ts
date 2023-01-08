import { HttpStatusCode } from '../network'

export interface HTTPError extends Error {
  /**
   * An unique error name. This is useful for i18n translations.
   * @default 'E_UNKNOWN'
   */
  name: string
  /**
   * The HTTP status name associated with the error.
   * @default HttpStatusCode.INTERNAL_SERVER_ERROR
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
   */
  statusCode?: HttpStatusCode
  /**
   * The message or errors that caused this error.
   * @default 'An unknown error occurred'
   */
  cause?: Error | string
}

/**
 * Create an error wrapped with HTTP status code and unique error name.
 * @param cause The error or error message
 * @param name The unique error name
 * @param statusCode The HTTP status name
 * @returns The error
 * @example
 * createError('Invalid email address', 'E_INVALID_EMAIL', HttpStatusCode.BAD_REQUEST)
 * createError({
 *   cause: 'Invalid email address',
 *   name: 'E_INVALID_EMAIL',
 *   statusCode: HttpStatusCode.BAD_REQUEST
 * })
 */
export function createError(cause?: Error | HTTPError | string, name?: string, statusCode?: HttpStatusCode): HTTPError {
  const error = typeof cause === 'string'
    ? new Error(cause) as HTTPError
    : cause as HTTPError

  // --- Set additional properties
  error.name = name || error.name || 'E_UNKNOWN'
  error.statusCode = statusCode || error.statusCode || 500

  // --- Capture stack trace and return
  Error.captureStackTrace(error, createError)
  return error
}
