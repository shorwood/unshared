import { once } from '@unshared/functions/once'
import { Function, MethodDecorator } from '@unshared/types'

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

/* v8 ignore start */
/* eslint-disable sonarjs/new-cap */
if (import.meta.vitest) {
  const { randomInt } = await import('node:crypto')

  test('should return the same value if no arguments are passed', () => {
    const fn = vi.fn(Math.random)
    class MyClass { @Once() getId() { return fn() } }
    const instance = new MyClass()
    const id1 = instance.getId()
    const id2 = instance.getId()
    expect(id1).toStrictEqual(id2)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith()
  })

  test('should return the same values if different arguments are passed', () => {
    const fn = vi.fn((n = 0) => (n as number) + randomInt(0, 1e6))
    class MyClass { @Once() getId(n: number) { return fn(n) } }
    const instance = new MyClass()
    const id1 = instance.getId(1)
    const id2 = instance.getId(1)
    const id3 = instance.getId(2)
    expect(id1).toStrictEqual(id2)
    expect(id1).toStrictEqual(id3)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(1)
    expect(fn).not.toHaveBeenCalledWith(2)
  })

  test('should preserve the method context', () => {
    class MyClass { value = { foo: 42 }; @Once() getValue() { return this?.value } }
    const instance = new MyClass()
    const result1 = instance.getValue()
    const result2 = instance.value
    expect(result1).toBe(result2)
  })

  test('should have different results for different instances', () => {
    class MyClass { @Once() getValue() { return randomInt(0, 1e6) } }
    const instance1 = new MyClass()
    const instance2 = new MyClass()
    const result1 = instance1.getValue()
    const result2 = instance2.getValue()
    expect(result1).not.toStrictEqual(result2)
  })
}
