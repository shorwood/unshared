import { Function } from '@unshared/types/Function'

/**
 * Returns a function that will be executed at most one time, no matter how
 * often you call it. Useful for lazy initialization. Once called, the
 * function will always return the same value as the one returned by the
 * first call.
 *
 * @param fn The function to wrap in a call guard.
 * @returns A function that will be executed at most one time.
 * @example const initializeOnce = once(initialize)
 */
export function once<T extends Function>(fn: T): T {
  let called = false
  let result: unknown

  // --- Wrap the function in a call guard.
  const wrapped = (...args: unknown[]): unknown => {
    if (called) return result
    called = true
    return result = fn(...args)
  }

  // --- Return the wrapped function.
  return wrapped as T
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
    expectTypeOf(wrapped).toEqualTypeOf<() => number>()
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
}
