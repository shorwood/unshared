import { Function, NumberIntegerPositive } from '@unshared/types'

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

/* c8 ignore next */
if (import.meta.vitest) {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  it('should call the function immediately', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    throttled()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should not call the function more than once within the delay', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    void throttled()
    void throttled()
    void throttled()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should pass the parameters of the first call to the function', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 10)
    void throttled(1)
    void throttled(2)
    void throttled(3)
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledWith(1)
  })

  it('should call the function again after the delay has passed', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)
    void throttled()
    vi.advanceTimersByTime(100)
    void throttled()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should return undefined', () => {
    const throttled = throttle(() => 'foobar', 100)
    const result = throttled()
    expect(result).toBeUndefined()
  })
}
