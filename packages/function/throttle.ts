import { Function } from '@unshared/types/Function'

export type Throttled<T extends Function> =
  (...parameters: Parameters<T>) => ReturnType<T> extends Promise<unknown>
    ? ReturnType<T>
    : Promise<ReturnType<T>>

/**
 * Throttle a function so that it will only execute once every specified delay.
 * Useful for implementing spam protection. If the function is called again
 * before the delay has passed, the call will be ignored.
 *
 * @param fn The function to throttle.
 * @param delay The throttle delay in milliseconds.
 * @returns A throttled function that will only execute once every specified delay.
 * @example
 * const getUserNow = (id: string) => fetch(`/users/${id}`)
 * const getUser = throttle(getUser)
 * getUser('123') // Will execute immediately.
 * getUser('123') // Will be ignored.
 * getUser('123') // Will be ignored.
 */
export const throttle = <T extends Function>(fn: T, delay: number): Throttled<T> => {
  // --- Handle edge cases.
  if (typeof fn !== 'function')
    throw new TypeError('Expected first argument to be a function.')
  if (typeof delay !== 'number')
    throw new TypeError('Expected delay to be a number.')
  if (delay < 0)
    throw new RangeError('Expected delay to be a positive number.')

  // --- Initialize timeout.
  let timeout: NodeJS.Timeout | undefined
  let result: unknown

  // --- Instantiate and return a throttled function.
  // @ts-expect-error: override the return type.
  return (...parameters: Parameters<T>[]) =>
    new Promise((resolve) => {
      if (timeout) return
      timeout = setTimeout(() => {
        timeout = undefined
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

  it('should throttle a function so it is only called once every delay', async() => {
    let count = 0
    const throttled = throttle(() => count++, 1000)
    throttled()
    throttled()
    throttled()
    vi.advanceTimersByTime(1000)
    expect(count).toEqual(1)
  })

  it('should pass the parameters to the throttled function', async() => {
    let count = 0
    const throttled = throttle((value: number) => (count += value), 1000)
    const result = throttled(10)
    expect(result).resolves.toEqual(10)
  })

  it('should return an async function that resolves once the delay has passed', async() => {
    let count = 0
    const throttled = throttle(() => count++, 1000)
    const result = Promise.all([throttled(), throttled(), throttled()])
    expect(result).resolves.toEqual([1, 1, 1])
  })

  it('should wrap the function result in a promise', async() => {
    const throttled = throttle(() => 1, 1000)
    const result = throttled()
    expect(result).resolves.toEqual(1)
  })

  it('should wrap the function result in a promise if it is async', async() => {
    const throttled = throttle(async() => 1, 1000)
    const result = throttled()
    expect(result).resolves.toEqual(1)
  })

  it('should throw if delay is lower than 1', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const shouldThrow = () => throttle(() => {}, 0)
    expect(shouldThrow).toThrow(RangeError)
  })

  it('should throw if the function is not a function', () => {
    // @ts-expect-error: invalid parameter type.
    const shouldThrow = () => throttle('function', 1000)
    expect(shouldThrow).toThrow(TypeError)
  })

  it('should infer the return type of the throttled function', async() => {
    const throttled = throttle(() => 1, 1000)
    expectTypeOf(throttled).toEqualTypeOf<() => Promise<number>>()
  })

  it('should infer the return type of the throttled function if it is async', async() => {
    const throttled = throttle(async() => 1, 1000)
    expectTypeOf(throttled).toEqualTypeOf<() => Promise<number>>()
  })
}
