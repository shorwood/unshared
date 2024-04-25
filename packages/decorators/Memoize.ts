import { Function, MethodDecorator } from '@unshared/types'
import { MemoizeOptions, memoize } from '@unshared/functions/memoize'

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

/* v8 ignore start */
if (import.meta.vitest) {
  test('should memoize the method', () => {
    const fn = vi.fn(Math.random)
    class MyClass { @Memoize() getId() { return fn() } }
    const instance = new MyClass()
    const id1 = instance.getId()
    const id2 = instance.getId()
    expect(id1).toStrictEqual(id2)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith()
  })

  test('should memoize the method by parameter', () => {
    const fn = vi.fn((n = 0) => (n as number) + Math.random())
    class MyClass { @Memoize() getId(n: number) { return fn(n) } }
    const instance = new MyClass()
    const id1 = instance.getId(1)
    const id2 = instance.getId(1)
    const id3 = instance.getId(2)
    expect(id1).toStrictEqual(id2)
    expect(id1).not.toStrictEqual(id3)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenCalledWith(1)
    expect(fn).toHaveBeenCalledWith(2)
  })

  test('should preserve the method context', () => {
    class MyClass { value = { foo: 42 }; @Memoize() getValue() { return this?.value } }
    const instance = new MyClass()
    const result1 = instance.getValue()
    const result2 = instance.value
    expect(result1).toBe(result2)
  })
}
