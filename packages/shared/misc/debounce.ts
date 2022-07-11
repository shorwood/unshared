/* eslint-disable unicorn/prevent-abbreviations */
export type DebouncedFn<T extends (...args: any) => any> = (...args: Parameters<T>) => void

/**
 * Wrap a function in a debounce function.
 *
 * A debounced function will only execute after the specified delay.
 * If the function is called again before the delay has passed,
 * the timer will be reset. Useful for implementing spam protection.
 *
 * @param {Function} callback The function to debounce
 * @param {number} [delay] The debounce delay in milliseconds
 * @returns {Function} A debounced function
 * @example
 * const getUser = (id: string) => axios.get(`/users/${id}`)
 * const debounced = debounce(getUser)
 */
export const debounce = <T extends (...args: any) => any>(callback: T, delay: number): DebouncedFn<T> => {
  // --- Handle edge cases.
  if (delay <= 0) return callback

  // --- Initialize timeout.
  let timeout: NodeJS.Timeout

  // --- Instantiate and return a debounced function.
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(callback.bind(undefined, ...args), delay)
  }
}
