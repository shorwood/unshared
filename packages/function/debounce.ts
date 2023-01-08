/* eslint-disable unicorn/prevent-abbreviations */
export type DebouncedFn<T extends (...args: any) => any> = (...args: Parameters<T>) => void

/**
 * Wrap a function in a debounce function.
 *
 * A debounced function will only execute after the specified delay.
 * If the function is called again before the delay has passed,
 * the timer will be reset. Useful for implementing spam protection.
 *
 * @param callback The function to debounce
 * @param delay The debounce delay in milliseconds
 * @return A debounced function
 * @example
 * const getUser = (id: string) => fetch(`/users/${id}`)
 * const debounced = debounce(getUser)
 */
export const debounce = <T extends (...args: any) => any>(callback: T, delay: number): DebouncedFn<T> => {
  // --- Handle edge cases.
  if (delay < 1) throw new Error('Debounce delay must be greater than 0.')

  // --- Initialize timeout.
  let timeout: NodeJS.Timeout

  // --- Instantiate and return a debounced function.
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(callback.bind(undefined, ...args), delay)
  }
}
