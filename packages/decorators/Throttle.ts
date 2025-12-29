import { throttle } from '@unshared/functions/throttle'

/**
 * Throttle a method so that it will only execute once every specified delay.
 * Useful for implementing spam protection. When the method is called, it will
 * execute immediately and then wait for the specified delay before it can be
 * called again.
 *
 * **Note:** This decorator will omit the return value of the method and return `undefined`.
 *
 * @param delay The delay in milliseconds to wait before executing the method.
 * @returns The method decorator.
 * @example
 * // Declare a class with a throttled method.
 * class Greeter {
 *   \@Throttle(100)
 *   greet(name: string) { return `Hello, ${name}! - ${Date.now()}` }
 * }
 *
 * // The first call to the method will be executed.
 * const instance = new Greeter()
 * instance.greet('Alice')
 * instance.greet('Bob')
 * instance.greet('Charlie')
 *
 * // The method will be called immediately and can only be called again after 100ms.
 * // => Hello, Alice!
 */
export function Throttle<This, Arguments extends unknown[]>(delay: number) {
  return function(
    originalMethod: (this: This, ...args: Arguments) => void,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Arguments) => void>,
  ): (this: This, ...args: Arguments) => void {

    // --- Ensure decorator is applied to a method.
    if (context.kind !== 'method')
      throw new TypeError('@Throttle can only be applied to methods.')

    // --- Create a throttled version per instance using a WeakMap.
    const instances = new WeakMap<object, (...args: Arguments) => void>()

    return function(this: This, ...args: Arguments): void {
      let throttledMethod = instances.get(this as object)
      if (!throttledMethod) {
        throttledMethod = throttle(originalMethod.bind(this) as (...args: Arguments) => void, delay)
        instances.set(this as object, throttledMethod)
      }
      throttledMethod(...args)
    }
  }
}
