/* eslint-disable unicorn/prevent-abbreviations */
export type ThrottledFn<T extends (...args: any) => any> = (...args: Parameters<T>) => void

/**
 * Returns a function, that, when invoked, will only be triggered at most once during a given window of time.
 * @param {Function} callback The function to throttle
 * @param {number} delay The amount of time in milliseconds to throttle invocations
 * @returns {Function}
 */
export const throttle = <T extends (...args: any) => any>(callback: T, delay: number): ThrottledFn<T> => {
  // --- Handle edge cases.
  if (delay <= 0) return callback

  // --- Initialize variables.
  let timeout: NodeJS.Timeout
  let last: number

  // --- Instantiate and return a thottled function.
  return (...args: any[]) => {
    const now = Date.now()
    if (last && now <= last + delay) {
      clearTimeout(timeout)
      timeout = setTimeout(() => last = now, delay)
    }
    else {
      last = now
      callback(args)
    }
  }
}
