import { Function } from '@unshared/types'

export type Memoized<T extends Function> = T & {
  /**
   * The cache of the arguments and their results that have been memoized.
   * The cache is a `Map` instance that can be used to inspect the memoized
   * results and reset the cache if needed. It is also possible to replace
   * the default cache implementation with a more advanced one like `lru-cache`.
   *
   * @example memoized.cache.get('["foo"]') // => 'bar'
   */
  cache: Map<string, unknown>
}

export interface MemoizeOptions<T extends Function> {
  /**
   * The `Map` instance or constructor to use as the cache. It defaults to the
   * native `Map` constructor but can be replaced with a more advanced cache
   * like `lru-cache`.
   *
   * @default Map
   */
  cache?: Map<string, unknown> | (new () => Map<string, unknown>)
  /**
   * A function to generate the cache key given the parameters of the function.
   * This will be used to index the results of the function and retrieve them
   * from the cache when the function is called with the same parameters.
   *
   * @default JSON.stringify
   */
  getKey?: (...parameters: Parameters<T>) => string
}

/**
 * Wrap a function to cache it's results indexed by their parameters
 *
 * @param fn The function to memoize.
 * @param options The options to use.
 * @returns The memoized function.
 * @example
 * // Create a slow function.
 * const slow = (value: number) => `The value is ${Math.random()}`
 *
 * // Wrap the function in a memoize guard.
 * const memoized = memoize(slow)
 *
 * // Call the memoized function.
 * memoized(10) // => 'The value is 0.123456789'
 * memoized(10) // => 'The value is 0.123456789'
 * memoized(9) // => 'The value is 0.987654321'
 */
export function memoize<T extends Function>(fn: T, options: MemoizeOptions<T> = {}): Memoized<T> {
  // --- Instantiate a cache
  const {
    cache: getCache = new Map<string, unknown>(),
    getKey = (...args) => JSON.stringify(args),
  } = options

  // --- Create or use the cache provided in the options.
  const cache = typeof getCache === 'function' ? new getCache() : getCache

  // --- Wrap the function in a memoize guard.
  const memoized = (...parameters: Parameters<T>) => {
    const key = getKey(...parameters)

    // --- Return the cached result if it exists.
    const cacheHit = cache.get(key)
    if (cacheHit) return cacheHit

    // --- Call the function and cache the result.
    const result = fn(...parameters) as unknown
    cache.set(key, result)
    return result
  }

  // --- Add the cache to the wrapped function
  memoized.cache = cache

  // --- Return the wrapped function
  return memoized as unknown as Memoized<T>
}

/* v8 ignore start */
if (import.meta.vitest) {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  it('should call the function with the given parameters', () => {
    const fn = vi.fn()
    const memoized = memoize(fn)
    memoized(1)
    expect(fn).toHaveBeenCalledWith(1)
  })

  it('should return the result of the function', () => {
    const memoized = memoize((value: number) => value)
    const result = memoized(10)
    expect(result).toEqual(10)
  })

  it('should return the cached result if the parameters are the same', () => {
    const fn = vi.fn((n: number) => n)
    const memoized = memoize(fn)
    memoized(1)
    memoized(1)
    memoized(1)
    expect(fn).toBeCalledWith(1)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(memoized.cache.size).toEqual(1)
  })

  it('should return a different result if the parameters are different', () => {
    const fn = vi.fn((n: number) => n)
    const memoized = memoize(fn)
    memoized(1)
    memoized(2)
    memoized(3)
    expect(fn).toHaveBeenCalledWith(1)
    expect(fn).toHaveBeenCalledWith(2)
    expect(fn).toHaveBeenCalledWith(3)
    expect(fn).toHaveBeenCalledTimes(3)
    expect(memoized.cache.size).toEqual(3)
  })

  it('should register the parameters and the result in the cache', () => {
    const memoized = memoize((value: number) => value)
    memoized(1)
    const result = [...memoized.cache.entries()]
    expect(result).toEqual([['[1]', 1]])
  })

  it('should use the custom cache provided in the options', () => {
    const cache = new Map<string, unknown>()
    const memoized = memoize((value: number) => value, { cache })
    expect(memoized.cache).toBe(cache)
  })

  it('should use the custom key generator provided in the options', () => {
    const getKey = vi.fn((n: number) => Math.floor(n).toString())
    const fn = vi.fn((n: number) => n)
    const memoized = memoize(fn, { getKey })
    memoized(1.25)
    memoized(1.75)
    expect(getKey).toHaveBeenCalledWith(1.25)
    expect(getKey).toHaveBeenCalledWith(1.75)
    expect(getKey).toHaveBeenCalledTimes(2)
    expect(memoized.cache.size).toEqual(1)
    expect(fn).toHaveBeenCalledTimes(1)
  })
}
