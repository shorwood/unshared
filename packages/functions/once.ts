import type { Function } from '@unshared/types'

/**
 * A function that will be executed at most one time, no matter how often you
 * call it. Useful for lazy initialization. Once called, the function will
 * always return the same value as the one returned by the first call.
 *
 * @template T The type of the function.
 * @example Once<() => number> // => () => number & { reset: () => void }
 */
export type Onced<T extends Function = Function> = T & { reset: () => void }

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
export function once<T extends Function>(fn: T): Onced<T> {
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
  return wrapped as Onced<T>
}
