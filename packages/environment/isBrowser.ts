/**
 * Check if process is running in a browser environment and
 * has access to the global browser APIs. Be aware that this
 * function will return `true` if the browser APIs are mocked
 * or polyfilled in a Node.js environment.
 *
 * @returns `true` if process is running in a browser.
 * @example isBrowser() // => true
 */
export function isBrowser() {
  return typeof window === 'object'
  && typeof document === 'object'
  && typeof navigator === 'object'
}
