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
  const wrapped = (...args: unknown[]) => {
    if (called) return result
    called = true
    result = fn(...args)
    return result
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
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should always return the same result', () => {
    const wrapped = once(Math.random)
    const resultFirst = wrapped()
    const resultSecond = wrapped()
    const resultThird = wrapped()
    expect(resultFirst).toEqual(resultSecond)
    expect(resultSecond).toEqual(resultThird)
  })

  it('should preserve the function context', () => {
    const context = { foo: 'foo', getFOO() { return this.foo.toUpperCase() } }
    const wrapped = once(context.getFOO.bind(context))
    const result = wrapped()
    expect(result).toEqual('FOO')
  })
}
