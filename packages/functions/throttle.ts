import type { Function, NumberIntegerPositive } from '@unshared/types'

export type Throttled<T extends Function> = (...parameters: Parameters<T>) => void

/**
 * Throttle a function so that it will only execute once every specified delay.
 * Useful for implementing spam protection. When the function is called, it will
 * execute immediately and then wait for the specified delay before it can be
 * called again.
 *
 * @param fn The function to throttle.
 * @param delay The throttle delay in milliseconds.
 * @returns The throttled function.
 * @example
 * // Create a function.
 * const sayHello = (name: string) => console.log(`Hello, ${name}!`)
 *
 * // Wrap the function in a debounce guard.
 * const throttled = throttle(sayHello, 100)
 *
 * // Call the throttled function.
 * throttled('Alice')
 * throttled('Bob')
 * throttled('Charlie')
 *
 * // The function will be called immediately and can only be called again after 100ms.
 * // => Hello, Alice!
 */
export function throttle<T extends Function, N extends number>(fn: T, delay: NumberIntegerPositive<N>): Throttled<T> {
  let timeout: NodeJS.Timeout | undefined

  // --- Wrap the function in a throttle guard.
  const throttled = (...parameters: Array<Parameters<T>>) => {
    if (timeout) return
    fn(...parameters)
    timeout = setTimeout(() => { timeout = undefined }, delay)
  }

  // --- Return the throttled function.
  return throttled as unknown as Throttled<T>
}

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
  ): (this: This, ...args: Arguments) => void {

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
