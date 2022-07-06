/* eslint-disable unicorn/prevent-abbreviations */

/**
 * Attemt to run a function and return an array with the value and the error if any.
 * @param {Function} fn The function to run.
 * @returns {[any, Error]} The value and the error if any.
 */
export const attempt = async<R>(fn: () => R | Promise<R>): Promise<[R | undefined, Error | undefined]> => {
  try {
    // --- Get function result.
    const result = fn()

    // --- Handle promises.
    if (result instanceof Promise) {
      let promiseError: Error | undefined
      let promiseResult: R | undefined

      // --- Wait for the promise to resolve.
      await result
        .then(value => promiseResult = value)
        .catch(error => promiseError = error)

      // --- Return the result and the error.
      return [promiseResult, promiseError]
    }

    // --- Return result.
    return [result, undefined]
  }

  // --- Catch sync error.
  catch (error: any) {
    return [undefined, error]
  }
}
