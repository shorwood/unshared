/* eslint-disable unicorn/prevent-abbreviations */
/**
 * Wrap a function to cache it's results indexed by their parameters
 * @param fn The function to be cached
 * @return The memoized function
 */
export const memoize = <T extends Function>(fn: T): T => {
  // --- Instantiate a cache
  const cache: Record<string, any> = {}

  // --- Wrap the function
  const wrappedFunction = (...args: any[]) => {
    const key = JSON.stringify(args)
    if (key in cache) return cache[key]
    return cache[key] = fn(...args)
  }

  // --- Return the wrapped function
  return wrappedFunction as unknown as T
}
