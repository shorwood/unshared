/* eslint-disable unicorn/prevent-abbreviations */
export type Debounce = <T extends Function>(callback: T, delay: number) => T

/**
 * Returns a `Function`, that, as long as it continues to be invoked, will not be
 * triggered. The function will be called after it stops being called for `delay`
 * milliseconds.
 * @param callback Function to debounce.
 * @param delay Deounce delay in ms. Defaulted to `200`.
 * @see https://gist.github.com/sagiavinash/5c9084b79f68553c4b7d
 */
export const debounce: Debounce = (callback: Function, delay = 200): any => {
  let timeout: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(callback.bind(undefined, ...args), delay)
  }
}
