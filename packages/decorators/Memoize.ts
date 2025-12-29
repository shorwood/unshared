import type { MemoizeOptions } from '@unshared/functions/memoize'
import { memoize } from '@unshared/functions/memoize'

/**
 * Decorate a method to memoize it's result based on the arguments. Meaning
 * that it will return the same result without executing the method again,
 * **unless the arguments change**.
 *
 * @param options The memoization options.
 * @returns The method decorator.
 * @example
 * // Declare a class with a memoized method.
 * class Greeter {
 *   \@Memoize()
 *   greet(name: string) { return `Hello, ${name}! - ${Math.random()}` }
 * }
 *
 * // The first call to the method will be executed.
 * const instance = new Greeter()
 * instance.greet('Alice') // 'Hello, Alice! - 0.123456789'
 * instance.greet('Alice') // 'Hello, Alice! - 0.123456789'
 * instance.greet('Bob')   // 'Hello, Bob!   - 0.987654321'
 */
export function Memoize<This, Arguments extends unknown[], Return>(
  options?: MemoizeOptions<(this: This, ...args: Arguments) => Return>,
) {
  return function(
    originalMethod: (this: This, ...args: Arguments) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Arguments) => Return>,
  ): (this: This, ...args: Arguments) => Return {

    // --- Ensure decorator is applied to a method.
    if (context.kind !== 'method')
      throw new TypeError('@Memoize can only be applied to methods.')

    // --- Create a memoized version per instance using a WeakMap.
    const instances = new WeakMap<object, (this: This, ...args: Arguments) => Return>()

    return function(this: This, ...args: Arguments): Return {
      let memoizedMethod = instances.get(this as object)
      if (!memoizedMethod) {
        memoizedMethod = memoize(originalMethod.bind(this) as (...args: Arguments) => Return, options)
        instances.set(this as object, memoizedMethod)
      }
      return memoizedMethod.call(this, ...args)
    }
  }
}
