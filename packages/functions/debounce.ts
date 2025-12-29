import type { Function, NumberIntegerPositive } from '@unshared/types'

/**
 * A debounced function that executes once within a specified delay.
 *
 * @template T The type of the function.
 * @example Debounced<(a: number) => number> = (a: number) => void
 */
export type Debounced<T extends Function> = (...parameters: Parameters<T>) => void

/**
 * Debounce a function so that it will only execute after the specified delay. If the function
 * is called multiple times before the delay has passed, the function will only execute once
 * after the delay has passed. The function will be called with the parameters of the last call.
 *
 * @param fn The function to debounce.
 * @param delay The debounce delay in milliseconds.
 * @returns The debounced function.
 * @example
 * // Create a function.
 * const sayHello = (name: string) => console.log(`Hello, ${name}!`)
 *
 * // Wrap the function in a debounce guard.
 * const debounced = debounce(sayHello, 100)
 *
 * // Call the debounced function.
 * debounced('Alice')
 * debounced('Bob')
 * debounced('Charlie')
 *
 * // After 100ms the function will be called with the parameters of the last call.
 * // => Hello, Charlie!
 */
export function debounce<T extends Function<unknown>, N extends number>(fn: T, delay: NumberIntegerPositive<N>): Debounced<T> {
  let timeout: NodeJS.Timeout | undefined

  // --- Wrap the function in a debounce guard.
  const debounced = (...parameters: Parameters<T>): void => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...parameters), delay)
  }

  // --- Return the debounced function.
  return debounced as unknown as Debounced<T>
}

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
  ): (this: This, ...args: Arguments) => void {

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
