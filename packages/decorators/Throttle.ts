import { throttle } from '@unshared/functions/throttle'
import { Function, MethodDecorator } from '@unshared/types'

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

/* v8 ignore start */
if (import.meta.vitest) {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  it('should call the function immediately', () => {
    const fn = vi.fn()
    class Greeter { @Throttle(100) fn() { fn() } }
    const instance = new Greeter()
    instance.fn()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should not call the function more than once within the delay', () => {
    const fn = vi.fn()
    class Greeter { @Throttle(100) fn() { fn() } }
    const instance = new Greeter()
    instance.fn()
    instance.fn()
    instance.fn()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should pass the parameters of the first call to the function', () => {
    const fn = vi.fn()
    class Greeter { @Throttle(10) fn(name: string) { fn(name) } }
    const instance = new Greeter()
    instance.fn('Alice')
    instance.fn('Bob')
    instance.fn('Charlie')
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledWith('Alice')
  })

  it('should call the function again after the delay has passed', () => {
    const fn = vi.fn()
    class Greeter { @Throttle(100) fn() { fn() } }
    const instance = new Greeter()
    instance.fn()
    vi.advanceTimersByTime(100)
    instance.fn()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should return undefined', () => {
    const fn = vi.fn(() => 'foobar')
    class Greeter { @Throttle(100) fn() { return fn() } }
    const instance = new Greeter()
    const result = instance.fn()
    expect(result).toBeUndefined()
  })
}
