/* eslint-disable unicorn/prevent-abbreviations */
export type Throttle = <T extends Function>(callback: T, delay: number) => T

/**
 * Returns a function, that, when invoked, will only be triggered at most once during a given window of time.
 * @param {Function} callback The function to throttle
 * @param {number} delay The amount of time in milliseconds to throttle invocations
 * @returns {Function}
 */
export const throttle: Throttle = (callback: Function, delay = 200): any => {
  let timeout: NodeJS.Timeout
  let last: number
  return (...args: any[]) => {
    const now = Date.now()
    if (last && now < last + delay) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        last = now
        callback(args)
      }, delay)
    }
    else {
      last = now
      callback(args)
    }
  }
}
