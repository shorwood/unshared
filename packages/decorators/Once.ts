import type { Function, MethodDecorator } from '@unshared/types'
import { once } from '@unshared/functions/once'

/**
 * Decorate a method to memoize it's result. Meaning that if the method is called,
 * it will return the same result without executing the method again, **even if the
 * method is called with different arguments**.
 *
 * @returns The method descriptor.
 * @example
 * // Declare a class with a onced method.
 * class Greeter {
 * ->@Once()
 *  greet(name: string) { return `Hello, ${name}! - ${Math.random()}` }
 * }
 *
 * // The first call to the method will be executed.
 * const instance = new Greeter()
 * instance.greet('Alice') // 'Hello, Alice! - 0.123456789'
 * instance.greet('Bob')   // 'Hello, Alice! - 0.123456789'
 */
export function Once<T extends Function>(): MethodDecorator<T> {
  return (target, propertyName, descriptor) => {
    const method = descriptor.value!
    descriptor.value = once(method) as unknown as T
    return descriptor
  }
}
