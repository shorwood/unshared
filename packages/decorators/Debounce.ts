import { Function, MethodDecorator } from '@unshared/types'
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

/* v8 ignore start */
if (import.meta.vitest) {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  test('should not call the function if the delay has not passed', () => {
    const fn = vi.fn()
    class Greeter { @Debounce(100) fn() { fn() } }
    const instance = new Greeter()
    instance.fn()
    instance.fn()
    instance.fn()
    vi.advanceTimersByTime(50)
    expect(fn).not.toHaveBeenCalled()
  })

  test('should call the function once after the delay has passed', () => {
    const fn = vi.fn()
    class Greeter { @Debounce(10) fn() { fn() } }
    const instance = new Greeter()
    instance.fn()
    instance.fn()
    instance.fn()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('should call the function once with the parameters of the last call', () => {
    const fn = vi.fn()
    class Greeter { @Debounce(10) fn(name: string) { fn(name) } }
    const instance = new Greeter()
    instance.fn('Alice')
    instance.fn('Bob')
    instance.fn('Charlie')
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledWith('Charlie')
  })

  test('should call the function multiple times if the delay has passed', () => {
    const fn = vi.fn()
    class Greeter { @Debounce(10) fn() { fn() } }
    const instance = new Greeter()
    instance.fn()
    vi.advanceTimersByTime(100)
    instance.fn()
    vi.advanceTimersByTime(100)
    instance.fn()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(3)
  })

  test('should return undefined', () => {
    const fn = vi.fn(() => 'foobar')
    class Greeter { @Debounce(10) fn() { return fn() } }
    const instance = new Greeter()
    const result = instance.fn()
    expect(result).toBeUndefined()
  })
}
