/**
 * Check if process is running in a browser environment
 *
 * @returns `true` if process is running in a browser
 */
export function isBrowser() {
  return typeof window === 'object'
  && typeof document === 'object'
  && typeof navigator === 'object'
}
