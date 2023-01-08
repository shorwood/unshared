/**
 * Check if process is running in a browser environment
 * @returns `true` if process is running in a browser
 */
export const isBrowser = () =>
  typeof window === 'object'
  && typeof document === 'object'
  && typeof navigator === 'object'
