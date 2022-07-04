/* eslint-disable unicorn/prevent-abbreviations */
export type DebouncedFn<T extends (...args: any) => any> = (...args: Parameters<T>) => void

/**
 * Returns a debounced version of the passed function.
 * @param {Function} callback The function to debounce
 * @param {number} [delay] The debounce delay in milliseconds
 * @returns {Function} A debounced function
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
