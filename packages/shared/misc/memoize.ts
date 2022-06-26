/* eslint-disable unicorn/prevent-abbreviations */
/**
 * Wrap a function to cache it's results indexed by their parameters
 * @param {Function} fn The function to be cached
 * @returns {Function} The wrapped function
 */
export const memoize = <T extends Function>(fn: T): T => {
  // --- Define a cache
  const cache: Record<string, any> = {}

  // --- Wrap the function
  const wrappedFunction = (...args: any[]) => {
    // --- Generate a key from the parameters
    const key = JSON.stringify(args)

    // --- Check the cache
    if (key in cache) return cache[key]

    // --- Cache and return result
    return cache[key] = fn(...args)
  }

  // --- Return the wrapped function
  return wrappedFunction as unknown as T
}
