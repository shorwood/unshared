import { Fallback, Function } from '@unshared/types'

/**
 * The result of trying multiple functions.
 *
 * @template F The functions to try.
 * @returns The first non-undefined result.
 * @example type Result = TriesResult<[() => string, () => number]> // string | number | undefined
 */
export type TriesResult<F extends Function[], IsPromise = false, Result extends unknown[] = []> =
  F extends [() => infer U, ...infer FNext extends Function[]]

    // --- Some functions might return `never` and may override the resulting type.
    // --- To avoid this, we fallback to `undefined` since thrown errors are caught and ignored.
    ? Fallback<U, void> extends (infer R)

      // --- If an async function was found before, wrap the next return types in a promise.
      ? R extends Promise<unknown>
        ? TriesResult<FNext, true, [...Result, R]>
        : TriesResult<FNext, IsPromise, [...Result, IsPromise extends true ? Promise<R>: R]>

      // --- Stop the recursion if no more functions are left.
      : TriesResult<[], IsPromise, Result>

    // --- At the end of the recursion, return the result as a union.
    // --- Also add `undefined` to represent the case where all functions have thrown.
    : Exclude<Result[number], void> | (IsPromise extends true ? Promise<void> : void)

/**
 * Try multiple functions and return the result of the first one that does not throw.
 * The functions are called in order until one successfully returns a value.
 *
 * @param functions The functions to try.
 * @returns A promise that resolves to the first non-undefined result.
 * @example tries(throws, Date.now) // 1658682347132
 */
export function tries<F extends Function[]>(...functions: F): TriesResult<F>
export function tries<T>(...functions: Function[]): T
export function tries(...functions: Function[]) {
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < functions.length; i++) {
    const fn = functions[i] as () => unknown
    try {
      const result = fn()

      // --- If the result is a promise, wait for it to resolve.
      // --- If an error occurs, try the next function but return
      // --- wrapped in a promise to keep the result type consistent.
      if (result instanceof Promise)
        return result.catch(() => tries(...functions.slice(1)))

      // --- If the result is not a promise, we can return it immediately.
      return result
    }
    catch {
      // --- Continue to the next function if the current one throws.
    }
  }
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should return the first result that does not throw', () => {
    const fn1 = vi.fn(() => { throw new Error('Error') }) as () => number
    const fn2 = vi.fn(() => 'Hello, World!') as () => string
    const fn3 = vi.fn(() => 1) as () => number
    const result = tries(fn1, fn2, fn3)
    expect(result).toEqual('Hello, World!')
    expect(fn1).toHaveBeenCalledOnce()
    expect(fn2).toHaveBeenCalledOnce()
    expect(fn3).not.toHaveBeenCalled()
    expectTypeOf(result).toEqualTypeOf<number | string | void>()
  })

  it('should return a promise if the result is a promise after the first function throws', async() => {
    const fn1 = vi.fn(() => { throw new Error('Error') }) as () => Promise<number>
    const fn2 = vi.fn(() => Promise.resolve(1)) as () => Promise<number>
    const result = tries(fn1, fn2)
    await expect(result).resolves.toEqual(1)
    expect(fn1).toHaveBeenCalledOnce()
    expect(fn2).toHaveBeenCalledOnce()
    expectTypeOf(result).toEqualTypeOf<Promise<number> | Promise<void>>()
  })

  it('should return a promise if a previous function rejects', async() => {
    const fn1 = vi.fn(() => Promise.reject(new Error('Error'))) as () => Promise<number>
    const fn2 = vi.fn(() => 1) as () => number
    const result = tries(fn1, fn2)
    await expect(result).resolves.toEqual(1)
    expect(fn1).toHaveBeenCalledOnce()
    expect(fn2).toHaveBeenCalledOnce()
    expectTypeOf(result).toEqualTypeOf<Promise<number> | Promise<void>>()
  })

  it('should return undefined if all functions throw or return undefined', () => {
    const fn1 = vi.fn(() => { throw new Error('Error') }) as () => void
    const fn2 = vi.fn(() => {}) as () => void
    const result = tries(fn1, fn2)
    expect(result).toBeUndefined()
    expect(fn1).toHaveBeenCalledOnce()
    expect(fn2).toHaveBeenCalledOnce()
    expectTypeOf(result).toEqualTypeOf<void>()
  })

  it('should only call each function once when switching to a promise', async() => {
    const fn1 = vi.fn(() => { throw new Error('Error') })
    const fn2 = vi.fn(() => { throw new Error('Error') })
    const fn3 = vi.fn(() => Promise.resolve(1))
    const result = tries(fn1, fn2, fn3)
    await expect(result).resolves.toEqual(1)
    expect(fn1).toHaveBeenCalledOnce()
    expect(fn2).toHaveBeenCalledOnce()
    expect(fn3).toHaveBeenCalledOnce()
  })

  it('should return undefined if no functions are provided', () => {
    const result = tries()
    expect(result).toBeUndefined()
    expectTypeOf(result).toEqualTypeOf<void>()
  })

  it('should override the return type using the generic', () => {
    const result = tries<'foo'>(() => 'not-foo')
    expect(result).toEqual('not-foo')
    expectTypeOf(result).toEqualTypeOf<'foo'>()
  })
}
