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
 * Note: The once behavior is scoped to the `this` context. This means that if
 * you call the function with different `this` contexts, it will execute once
 * per context.
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

/**
 * Decorate a method to memoize it's result. Meaning that if the method is called,
 * it will return the same result without executing the method again, **even if the
 * method is called with different arguments**.
 *
 * @returns The method decorator.
 * @example
 * // Declare a class with a onced method.
 * class Greeter {
 *   \@Once()
 *   greet(name: string) { return `Hello, ${name}! - ${Math.random()}` }
 * }
 *
 * // The first call to the method will be executed.
 * const instance = new Greeter()
 * instance.greet('Alice') // 'Hello, Alice! - 0.123456789'
 * instance.greet('Bob')   // 'Hello, Alice! - 0.123456789'
 */
export function Once<This, Arguments extends unknown[], Return>() {
  return function(
    originalMethod: (this: This, ...args: Arguments) => Return,
  ): (this: This, ...args: Arguments) => Return {

    // --- Create a once version per instance using a WeakMap.
    const instances = new WeakMap<object, (this: This, ...args: Arguments) => Return>()

    return function(this: This, ...args: Arguments): Return {
      let oncedMethod = instances.get(this as object)
      if (!oncedMethod) {
        oncedMethod = once(originalMethod.bind(this) as (...args: Arguments) => Return)
        instances.set(this as object, oncedMethod)
      }
      return oncedMethod.call(this, ...args)
    }
  }
}
