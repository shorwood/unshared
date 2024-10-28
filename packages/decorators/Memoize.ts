import type { MemoizeOptions } from '@unshared/functions/memoize'
import type { Function, MethodDecorator } from '@unshared/types'
import { memoize } from '@unshared/functions/memoize'

/**
 * Decorate a method to memoize it's result based on the arguments. Meaning
 * that it will return the same result without executing the method again,
 * **unless the arguments change**.
 *
 * @param options The memoization options.
 * @returns The method descriptor.
 * @example
 * // Declare a class with a memoized method.
 * class Greeter {
 * ->@Memoize()
 *   greet(name: string) { return `Hello, ${name}! - ${Math.random()}` }
 * }
 *
 * // The first call to the method will be executed.
 * const instance = new Greeter()
 * instance.greet('Alice') // 'Hello, Alice! - 0.123456789'
 * instance.greet('Alice') // 'Hello, Alice! - 0.123456789'
 * instance.greet('Bob')   // 'Hello, Bob!   - 0.987654321'
 */
export function Memoize<T extends Function>(options?: MemoizeOptions<T>): MethodDecorator<T> {
  return function(_target, _propertyName, descriptor) {
    const method = descriptor.value!
    descriptor.value = memoize(method, options) as unknown as T
    return descriptor
  }
}
