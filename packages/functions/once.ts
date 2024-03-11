import { Function } from '@unshared/types'

/**
 * A function that will be executed at most one time, no matter how often you
 * call it. Useful for lazy initialization. Once called, the function will
 * always return the same value as the one returned by the first call.
 *
 * @template T The type of the function.
 * @example Once<() => number> // => () => number & { reset: () => void }
 */
export type Once<T extends Function> = T & { reset: () => void }

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
  let called = false
  let result: unknown

  // --- Wrap the function in a call guard.
  const wrapped = (...args: unknown[]): unknown => {
    if (called) return result
    called = true
    return result = fn(...args)
  }

  // --- Extend the wrapped function with a `reset` method.
  wrapped.reset = () => {
    called = false
    result = undefined
  }

  // --- Return the wrapped function.
  return wrapped as Once<T>
}

/** c8 ignore next */
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
}
