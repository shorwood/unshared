import { once } from '@unshared/functions/once'

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
