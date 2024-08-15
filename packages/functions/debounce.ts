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

/* v8 ignore start */
if (import.meta.vitest) {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  test('should not call the function if the delay has not passed', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced()
    debounced()
    debounced()
    vi.advanceTimersByTime(50)
    expect(fn).not.toHaveBeenCalled()
  })

  test('should call the function once after the delay has passed', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 10)
    debounced()
    debounced()
    debounced()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  test('should call the function once with the parameters of the last call', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 10)
    debounced('Alice')
    debounced('Bob')
    debounced('Charlie')
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledWith('Charlie')
  })

  test('should call the function multiple times if the delay has passed', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 10)
    debounced()
    vi.advanceTimersByTime(100)
    debounced()
    vi.advanceTimersByTime(100)
    debounced()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(3)
  })

  test('should return undefined', () => {
    const debounced = debounce(() => 'foobar', 100)
    const result = debounced()
    expect(result).toBeUndefined()
  })
}
