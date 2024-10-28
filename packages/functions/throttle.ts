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
