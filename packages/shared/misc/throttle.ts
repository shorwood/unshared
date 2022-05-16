/* eslint-disable unicorn/prevent-abbreviations */
export type Throttle = <T extends Function>(callback: T, delay: number) => T

/**
 * Returns a `Function`, once called, and then as long as it continues to be
 * invoked, will not be triggered. The function will be allowed to call after
 * `delay` milliseconds.
 * @param callback Function to throttle.
 * @param delay Throttle delay in ms. Defaulted to `200`.
 * @see https://gist.github.com/sagiavinash/303a2f1153739de8859b
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
