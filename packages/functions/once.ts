import { Function } from '@unshared/types'

/**
 * A function that will be executed at most one time, no matter how often you
 * call it. Useful for lazy initialization. Once called, the function will
 * always return the same value as the one returned by the first call.
 *
 * @template T The type of the function.
 * @example Once<() => number> // => () => number & { reset: () => void }
 */
export type Once<T extends Function = Function> = T & { reset: () => void }

/**
 * Returns a function that will be executed at most one time, no matter how
 * often you call it. Useful for lazy initialization. Once called, the
 * function will always return the same value as the one returned by the
 * first call.
 *
 * You can reset the function by calling the `reset` method on the returned
 * function.
 *
 * @param fn The function to wrap in a call guard.
 * @returns A function that will be executed at most one time.
 * @example
 * // Create a function that will be executed at most one time.
 * const fn = once(() => Math.random())
 *
 * // Call the function.
 * fn() // => 0.123456789
 * fn() // => 0.123456789
 * fn() // => 0.123456789
 *
 * // Reset the function.
 * fn.reset()
 * fn() // => 0.987654321
 */
export function once<T extends Function>(fn: T): Once<T> {
  const cache = new Map<unknown, { result: unknown }>()

  // --- Wrap the function in a call guard.
  function wrapped(this: unknown, ...args: unknown[]): unknown {
    const context = this === undefined ? 'global' : this
    const isCalled = cache.get(context)
    if (isCalled) return isCalled.result
    const result = fn.call(this, ...args) as unknown
    cache.set(context, { result })
    return result
  }

  // --- Extend the wrapped function with a `reset` method.
  wrapped.reset = function(this: unknown) {
    const context = this === wrapped ? 'global' : this
    cache.delete(context)
  }

  // --- Return the wrapped function.
  return wrapped as Once<T>
}

/** v8 ignore start */
if (import.meta.vitest) {
  it('should only call the function once', () => {
    const fn = vi.fn()
    const wrapped = once(fn)
    wrapped()
    wrapped()
    wrapped()
    expect(fn).toHaveBeenCalledOnce()
  })

  it('should always return the same result', () => {
    const wrapped = once(Math.random)
    const resultFirst = wrapped()
    const resultSecond = wrapped()
    const resultThird = wrapped()
    expect(resultFirst).toEqual(resultSecond)
    expect(resultSecond).toEqual(resultThird)
    expectTypeOf(wrapped).toEqualTypeOf<(() => number) & { reset: () => void }>()
  })

  it('should take parameters but ignore them after the first call', () => {
    const fn = vi.fn((n: number) => n)
    const wrapped = once(fn)
    const resultFirst = wrapped(1)
    const resultSecond = wrapped(2)
    const resultThird = wrapped(3)
    expect(resultFirst).toEqual(1)
    expect(resultSecond).toEqual(1)
    expect(resultThird).toEqual(1)
    expect(fn).toHaveBeenCalledOnce()
    expect(fn).toHaveBeenCalledWith(1)
  })

  it('should call the function again after reset', () => {
    const fn = vi.fn()
    const wrapped = once(fn)
    wrapped()
    wrapped.reset()
    wrapped()
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should preserve the `this` context when calling the function', () => {
    const context = { value: 42 }
    const fn = vi.fn(function(this: typeof context) {
      return this.value
    })
    const wrapped = once(fn)
    const result = wrapped.call(context)
    expect(result).toEqual(42)
  })

  it('should return different results for different `this` contexts', () => {
    const wrapped = once(Math.random)
    const result1 = wrapped.call({})
    const result2 = wrapped.call({})
    expect(result1).not.toEqual(result2)
  })
}
