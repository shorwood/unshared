export type Memoized<T extends Function> = T & {
  /**
   * The cache of the arguments and their results
   */
  cache: Record<string, any>
}

/**
 * Wrap a function to cache it's results indexed by their parameters
 *
 * @param fn The function to be cached
 * @returns The memoized function
 */
export const memoize = <T extends Function>(fn: T): Memoized<T> => {
  // --- Instantiate a cache
  const cache = new Map<unknown[], unknown>()

  // --- Wrap the function
  const memoized = (...parameters: unknown[]) => {
    const cacheHit = cache.get(parameters)
    if (cacheHit) return cacheHit
    const result = fn(...parameters)
    cache.set(parameters, result)

    if (cache.size > 1000) cache.clear()

    return result
  }

  // --- Add the cache to the wrapped function
  memoized.cache = cache

  // --- Return the wrapped function
  return memoized as unknown as Memoized<T>
}

/* c8 ignore next */
if (import.meta.vitest) {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  it('should pass the parameters to the memoized function', async() => {
    const memoized = memoize((value: number) => value + 1)
    const result = memoized(10)
    expect(result).toEqual(11)
  })

  it('should return the cached result if the parameters are the same', async() => {
    const memoized = memoize((value: number) => value + 1)
    memoized(10)
    memoized(10)
    memoized(10)
    const result = memoized(10)
    expect(result).toEqual(11)
  })

  it('should return a different result if the parameters are different', async() => {
    const memoized = memoize((value: number) => value + 1)
    memoized(10)
    memoized(10)
    memoized(10)
    const result = memoized(11)
    expect(result).toEqual(12)
  })

  it('should expose the cache', async() => {
    const memoized = memoize((value: number) => value + 1)
    memoized(10)
    memoized(10)
    memoized(10)
    expect(memoized.cache.get([10])).toEqual(11)
    expect(memoized.cache.get([11])).toEqual(12)
    expect(memoized.cache.get([12])).toEqual(undefined)
  })

  it('should infer the return type', async() => {
    const memoized = memoize((value: number) => value + 1)
    const result = memoized(10)
    expect(result).toEqual(11)
  })
}
