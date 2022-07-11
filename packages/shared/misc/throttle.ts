/* eslint-disable unicorn/prevent-abbreviations */
export type ThrottledFn<T extends (...args: any) => any> = (...args: Parameters<T>) => void

/**
 * Wrap a function in a throttle function.
 *
 * A throttled function will only execute once per delay.
 * If the function is called again before the delay has passed,
 * the timer will be reset. Useful for implementing spam protection.
 *
 * @param {Function} callback The function to throttle
 * @param {number} [delay] The throttle delay in milliseconds
 * @returns {Function} A throttled function
 * @example
 * const getUsers = (id: string) => axios.get(`/users/${id}`)
 * const throttled = throttle(getUser)
 */
export const throttle = <T extends (...args: any) => any>(callback: T, delay: number): ThrottledFn<T> => {
  // --- Handle edge cases.
  if (delay <= 0) return callback

  // --- Initialize variables.
  let timeout: NodeJS.Timeout
  let last = 0

  // --- Instantiate and return a thottled function.
  return (...args: any[]) => {
    const now = Date.now()
    const canExecute = (now - last) > delay

    // --- If the delay has passed, or if the function is being called for the first time.
    if (canExecute) {
      last = now
      callback(...args)
    }

    // --- If the delay has not passed, reset the timeout.
    else {
      clearTimeout(timeout)
      timeout = setTimeout(() => last = now, delay)
    }
  }
}
