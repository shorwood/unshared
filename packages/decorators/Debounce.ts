import { debounce } from '@unshared/functions/debounce'

/**
 * Debounce a method so that it will only execute after the specified delay. If the method
 * is called multiple times before the delay has passed, the method will only execute once
 * after the delay has passed. The method will be called with the parameters of the last call.
 *
 * **Note:** This decorator will omit the return value of the method and return `undefined`.
 *
 * @param delay The delay in milliseconds to wait before executing the method.
 * @returns The method decorator.
 * @example
 * // Declare a class with a debounced method.
 * class Greeter {
 *   \@Debounce(100)
 *   greet(name: string) { return `Hello, ${name}! - ${Date.now()}` }
 * }
 *
 * // The first call to the method will be executed.
 * const instance = new Greeter()
 * instance.greet('Alice')
 * instance.greet('Bob')
 * instance.greet('Charlie')
 *
 * // After 100ms the method will be called with the parameters of the last call.
 * // => Hello, Charlie!
 */
export function Debounce<This, Arguments extends unknown[]>(delay: number) {
  return function(
    originalMethod: (this: This, ...args: Arguments) => void,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Arguments) => void>,
  ): (this: This, ...args: Arguments) => void {

    // --- Ensure decorator is applied to a method.
    if (context.kind !== 'method')
      throw new TypeError('@Debounce can only be applied to methods.')

    // --- Create a debounced version per instance using a WeakMap.
    const instances = new WeakMap<object, (...args: Arguments) => void>()

    return function(this: This, ...args: Arguments): void {
      let debouncedMethod = instances.get(this as object)
      if (!debouncedMethod) {
        debouncedMethod = debounce(originalMethod.bind(this) as (...args: Arguments) => void, delay)
        instances.set(this as object, debouncedMethod)
      }
      debouncedMethod(...args)
    }
  }
}
