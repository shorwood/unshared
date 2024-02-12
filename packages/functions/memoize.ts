import { Function } from '@unshared/types'

export type Memoized<T extends Function> = T & {
  /**
   * The cache of the arguments and their results
   */
  cache: Map<string, unknown>
}

/**
 * Wrap a function to cache it's results indexed by their parameters
 *
 * @param fn The function to be cached
 * @returns The memoized function
 */
export function memoize<T extends Function>(fn: T): Memoized<T> {
  // --- Instantiate a cache
  const cache = new Map<string, unknown>()

  // --- Wrap the function
  const memoized = (...parameters: unknown[]) => {
    const parametersKey = JSON.stringify(parameters)
    const cacheHit = cache.get(parametersKey)
    if (cacheHit) return cacheHit
    const result = fn(...parameters)
    cache.set(parametersKey, result)
    return result
  }

  // --- Add the cache to the wrapped function
  memoized.cache = cache

  // --- Return the wrapped function
  return memoized as unknown as Memoized<T>
}

/**
 * Decorate a class method to memoize the result of the method.
 *
 * @param target The class prototype
 * @param propertyName The name of the method.
 * @param descriptor The method descriptor.
 * @returns The method descriptor.
 * @example
 * // Declare a class with a memoized method.
 * class MyClass {
 *   \@Memoize()
 *   getId() { return Math.random() }
 * }
 *
 * // Use the class.
 * const instance = new MyClass()
 *
 * // The first call to the method will be executed.
 * instance.getId() // 0.123456789
 * instance.getId() // 0.123456789
 */
export function Memoize<T extends Function>(target: unknown, propertyName: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> {
  const originalMethod = descriptor.value!
  descriptor.value = memoize(originalMethod).bind(target) as unknown as T
  return descriptor
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

  it('should memoize the result of a method', () => {
    class MyClass {
      @Memoize
      getId() { return Math.random() }
    }

    const instance = new MyClass()
    const first = instance.getId()
    const second = instance.getId()
    expect(first).toEqual(second)
  })

  it('should keep the context of the method', () => {
    class MyClass {
      private id = Math.random()
      @Memoize
      getId() { return this }
    }

    const instance = new MyClass()
    const first = instance.getId()
    const second = instance.getId()
    expect(first).toEqual(second)
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
