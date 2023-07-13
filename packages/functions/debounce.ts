import { Function } from '@unshared/types/Function'

/* eslint-disable unicorn/prevent-abbreviations */
export type Debounced<T extends Function> =
  (...parameters: Parameters<T>) => ReturnType<T> extends Promise<unknown>
    ? ReturnType<T>
    : Promise<ReturnType<T>>

/**
 * Debounce a function so that it will only execute after the specified delay.
 * If the function is called again before the delay has passed,
 * the timer will be reset. Useful for implementing spam protection.
 *
 * If the delay is `0`, the returned function will be the original function.
 *
 * @param fn The function to debounce.
 * @param delay The debounce delay in milliseconds.
 * @returns A debounced function that will only execute after the specified delay.
 * @example
 * const getUserNow = (id: string) => fetch(`/users/${id}`)
 * const getUser = debounce(getUser, 1000)
 * const user = await getUser('123') // Will be ignored.
 * const user = await getUser('123') // Will be ignored.
 * const user = await getUser('123') // Will only execute after 1000ms.
 */
export const debounce = <T extends Function>(fn: T, delay: number): Debounced<T> => {
  if (delay < 0) throw new RangeError('Expected delay to be a positive number.')
  if (delay === 0) return fn as Debounced<T>

  // --- Initialize timeout.
  let timeout: NodeJS.Timeout
  let result: unknown

  // --- Instantiate and return a debounced function.
  // @ts-expect-error: override the return type.
  return (...parameters: Parameters<T>[]) =>
    new Promise((resolve) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        result = fn(...parameters)
        resolve(result as ReturnType<T>)
      }, delay)
    })
}

/* c8 ignore next */
if (import.meta.vitest) {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  it('should debounces a function so it is only called once after delay', async() => {
    let count = 0
    const debounced = debounce(() => count++, 1000)
    debounced()
    debounced()
    debounced()
    vi.advanceTimersByTime(1000)
    expect(count).toEqual(1)
  })

  it('should pass the parameters to the debounced function', async() => {
    let count = 0
    const debounced = debounce((value: number) => (count += value), 1000)
    const result = debounced(10)
    expect(result).resolves.toEqual(10)
  })

  it('should return an async function that resolves once the delay has passed', async() => {
    let count = 0
    const debounced = debounce(() => count++, 1000)
    const result = Promise.all([debounced(), debounced(), debounced()])
    expect(result).resolves.toEqual([1, 1, 1])
  })

  it('should wrap the function result in a promise', async() => {
    const debounced = debounce(() => 1, 1000)
    const result = debounced()
    expect(result).resolves.toEqual(1)
  })

  it('should wrap the function result in a promise if it is async', async() => {
    const debounced = debounce(async() => 1, 1000)
    const result = debounced()
    expect(result).resolves.toEqual(1)
  })

  it('should pass the function if the delay is 0', async() => {
    const fn = () => 1
    const debounced = debounce(fn, 0)
    expect(debounced).toBe(fn)
  })

  it('should throw if delay is lower than 1', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const shouldThrow = () => debounce(() => {}, 0)
    expect(shouldThrow).toThrow(RangeError)
  })

  it('should throw if the function is not a function', () => {
    // @ts-expect-error: invalid parameter type.
    const shouldThrow = () => debounce('function', 1000)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should infer the return type of the debounced function', async() => {
    const debounced = debounce(() => 1, 1000)
    expectTypeOf(debounced).toEqualTypeOf<() => Promise<number>>()
  })

  it('should infer the return type of the debounced function if it is async', async() => {
    const debounced = debounce(async() => 1, 1000)
    expectTypeOf(debounced).toEqualTypeOf<() => Promise<number>>()
  })
}
