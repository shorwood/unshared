import type { MaybePromise, NotPromise } from '@unshared/types'

/**
 * A result type that can be used to represent the result of an operation that
 * can fail. This type is similar to the `Either` type in functional programming
 * languages.
 *
 * @template T The type of the value.
 * @template E The type of the error.
 * @example Result<string, Error> // [string | undefined, Error | undefined]
 */
export type Result<T = unknown, E extends Error = Error> =
  { error: E; value: undefined } |
  { error: undefined; value: T }

/**
 * Run a function and return the value or error in an array. If the function
 * throws an error, the error will be returned in the second element of the
 * array. Otherwise, the value will be returned in the first element of the
 * array. This allows for error handling similar to Rust's `Result` type.
 *
 * If the function is asynchronous, the result will be a promise that resolves
 * to the result asynchronously. If the function is synchronous, the result will
 * be returned immediately.
 *
 * @param fn The function to run.
 * @returns A tuple with the value and the error if any.
 * @example
 * // Synchronous function.
 * attempt(() => true)
 * // { value: true, error: undefined }
 *
 * // Asynchronous function.
 * attempt(async() => true)
 * // Promise<{ value: true, error: undefined }>
 *
 * // Failing synchronous function.
 * attempt(() => { throw new Error('I am failing') })
 * // { value: undefined, error: Error('I am failing') }
 *
 * // Failing asynchronous function.
 * attempt(async() => { throw new Error('I am failing asynchronously') })
 * // Promise<{ value: undefined, error: Error('I am failing asynchronously') }>
 */
export function attempt<T, E extends Error = Error>(fn: () => NotPromise<T>): Result<T, E>
export function attempt<T, E extends Error = Error>(fn: () => Promise<T>): Promise<Result<T, E>>
export function attempt<T, E extends Error = Error>(fn: () => MaybePromise<T>): MaybePromise<Result<T, E>>
export function attempt(fn: () => unknown) {
  try {
    const value = fn()

    // --- Return a promise if the function is asynchronous.
    return value instanceof Promise
      ? value
        .then((value: unknown) => ({ value }))
        .catch((error: Error) => ({ error }))

      // --- Return the result immediately if the function is synchronous.
      : { value }
  }

  // --- Catch sync error.
  catch (error: unknown) {
    return { error }
  }
}
