import { HttpStatusCode } from './httpStatusCode'

/**
 * An errors that provide a consistent interface for error handling and should
 * be used for either **all** or **none** of the errors in a project.
 *
 * It provides properties for troubleshooting and debugging errors, as well as
 * a way to provide HTTP status codes for errors.
 *
 * The logic behind this class is based on the following article:
 *
 * @see https://medium.com/@xjamundx/custom-javascript-errors-in-es6-aa891b173f87
 */
export class HttpError extends Error {
  constructor(message: string, options?: Partial<HttpError>)
  constructor(...parameters: Parameters<typeof Error>) {
    super(...parameters)
    Error.captureStackTrace(this, HttpError)

    // --- Decompose the parameters.
    const [, options] = parameters as [string, HttpError]

    // --- Set the options.
    if (typeof options === 'object' && options !== null)
      Object.assign(this, options)
  }

  /**
   * Wrap an `Error` in an `HttpError`.
   *
   * @param error The error to wrap.
   * @param options The additionnal properties to set on the exception.
   * @returns The wrapped exception.
   */
  public static wrap(error: Error, options?: Partial<HttpError>): HttpError {
    return new HttpError(error.message, { ...options, cause: error })
  }

  /**
   * A unique name for the error. This name should be unique to the error and
   * should not be used for any other error cases. This name should be used to
   * identify the error in logs and other places where the error is logged.
   *
   * As a convention, the name should be prefixed with `E_` to indicate that it
   * is an error.
   *
   * @example E_STREAM_ALREADY_CLOSED
   */
  public name: `E_${string}` = 'E_UNKNOWN'

  /**
   * The HTTP status name associated with the error.
   *
   * @default HttpStatusCode.INTERNAL_SERVER_ERROR
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
   */
  public statusCode?: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR

  /**
   * A message that explains the likely cause of the error. This message should be
   * suitable for a developer to understand the error and is not intended for
   * end-users.
   *
   * @example 'The provided stream is already closed and cannot be written to.'
   */
  public debugExplanation?: string

  /**
   * A possible resolution to the error that might be helpful to the developer(s).
   *
   * @example 'Ensure that the stream is not closed before writing to it.'
   */
  public debugSolution?: string
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should create an instance of basic error', () => {
    const error = new HttpError('An error occurred while processing your request.')
    expect(error.name).toEqual('E_UNKNOWN')
    expect(error.statusCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR)
    expect(error.message).toEqual('An error occurred while processing your request.')
    expect(error.debugExplanation).toBeUndefined()
    expect(error.debugSolution).toBeUndefined()
  })

  it('should create an instance of error with options', () => {
    const error = new HttpError('An error occurred while processing your request.', {
      name: 'E_STREAM_ALREADY_CLOSED',
      statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      debugExplanation: 'The provided stream is already closed and cannot be written to.',
      debugSolution: 'Ensure that the stream is not closed before writing to it.',
    })
    expect(error.name).toEqual('E_STREAM_ALREADY_CLOSED')
    expect(error.statusCode).toEqual(HttpStatusCode.INTERNAL_SERVER_ERROR)
    expect(error.debugExplanation).toEqual('The provided stream is already closed and cannot be written to.')
    expect(error.debugSolution).toEqual('Ensure that the stream is not closed before writing to it.')
    expect(error.message).toEqual('An error occurred while processing your request.')
  })
}
