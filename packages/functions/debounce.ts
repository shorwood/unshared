import { NumberIntegerPositive, Function } from '@unshared/types'

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
 * @example debounce(() => console.log('Hello'), 1000)
 */
export function debounce<T extends Function, N extends number>(fn: T, delay: NumberIntegerPositive<N>): Debounced<T> {
  let timeout: NodeJS.Timeout | undefined

  // --- Instantiate and return a debounced function.
  const debounced = (...parameters: Parameters<T>): void =>{
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...parameters), delay)
  }

  // --- Return the debounced function.
  return debounced as unknown as Debounced<T>
}

/* c8 ignore next */
if (import.meta.vitest) {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  it('should debounces a function so it is only called once after delay', async() => {
    let count = 0
    const debounced = debounce(() => count++, 10)
    debounced()
    debounced()
    debounced()
    vi.advanceTimersByTime(100)
    expect(count).toEqual(1)
  })

  it('should pass the parameters of the last call to the debounced function', async() => {
    let count = 0
    const debounced = debounce((n: number) => count = n, 10)
    debounced(1)
    debounced(2)
    debounced(3)
    vi.advanceTimersByTime(100)
    expect(count).toEqual(3)
  })

  it('should be able to execute the debounced function again after the delay has passed', async() => {
    let count = 0
    const debounced = debounce(() => count++, 10)
    debounced()
    vi.advanceTimersByTime(100)
    expect(count).toEqual(1)
    debounced()
    vi.advanceTimersByTime(100)
    expect(count).toEqual(2)
  })

  it('should return undefined', async() => {
    const debounced = debounce(async() => 1, 10)
    const result = debounced()
    vi.advanceTimersByTime(100)
    expect(result).toBeUndefined()
  })

  it('should not execute the function before the delay has passed', async() => {
    let count = 0
    const debounced = debounce(() => count++, 100)
    debounced()
    debounced()
    debounced()
    vi.advanceTimersByTime(50)
    expect(count).toEqual(0)
  })

  it('should transform the return type of the debounced function', async() => {
    type Result = Debounced<(a: number) => number>
    type Expected = (a: number) => void
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
}
