import type { Function, MethodDecorator } from '@unshared/types'
import { debounce } from '@unshared/functions/debounce'

/**
 * Debounce a method so that it will only execute after the specified delay. If the method
 * is called multiple times before the delay has passed, the method will only execute once
 * after the delay has passed. The method will be called with the parameters of the last call.
 *
 * **Note:** This decorator will omit the return value of the method and return `undefined`.
 *
 * @param delay The delay in milliseconds to wait before executing the method.
 * @returns The method descriptor.
 * @example
 * // Declare a class with a debounced method.
 * class Greeter {
 * ->@Debounce(100)
 *  greet(name: string) { return `Hello, ${name}! - ${Date.now()}` }
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
export function Debounce<T extends Function<void>>(delay: number): MethodDecorator<T> {
  return (target, propertyName, descriptor) => {
    const method = descriptor.value!
    descriptor.value = debounce(method, delay) as unknown as T
    return descriptor
  }
}
