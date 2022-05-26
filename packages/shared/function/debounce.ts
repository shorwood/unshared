/* eslint-disable unicorn/prevent-abbreviations */
export type Debounce = <T extends Function>(callback: T, delay: number) => T

/**
 * Returns a debounced version of the passed function.
 * @param {Function} callback The function to debounce
 * @param {number} delay The debounce delay in milliseconds
 * @returns {Function} The debounced function
 */
export const debounce: Debounce = (callback: Function, delay = 200): any => {
  let timeout: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(callback.bind(undefined, ...args), delay)
  }
}
