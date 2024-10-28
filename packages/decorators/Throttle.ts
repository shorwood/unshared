import type { Function, MethodDecorator } from '@unshared/types'
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
 * @returns The method descriptor.
 * @example
 * // Declare a class with a debounced method.
 * class Greeter {
 * ->@Throttle(100)
 *  greet(name: string) { return `Hello, ${name}! - ${Date.now()}` }
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
export function Throttle<T extends Function<void>>(delay: number): MethodDecorator<T> {
  return (target, propertyName, descriptor) => {
    const method = descriptor.value!
    descriptor.value = throttle(method, delay) as unknown as T
    return descriptor
  }
}
