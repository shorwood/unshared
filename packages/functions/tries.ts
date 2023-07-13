import { Function } from '@unshared/types/Function'

export type TriesResult<F extends Function[]> =
  F extends Function<infer U>[]
    ? Exclude<U, null | void>
    : never

/**
 * Try multiple functions and return the first one that does not throw or is not undefined.
 * If all functions throw or return `undefined`, `undefined` is returned.
 *
 * @param functions The functions to try.
 * @returns A promise that resolves to the first non-undefined result.
 * @example tries(throws, noop, Date.now) // 1658682347132
 */
export function tries<F extends [Function, ...Function[]]>(...functions: F): TriesResult<F> | undefined {
  for (const fn of functions) {
    try {
      const result = fn()
      if (result !== undefined && result !== null)
        return result as TriesResult<F>
    }
    catch { /* Ignore errors */ }
  }
}

/* c8 ignore next */
if (import.meta.vitest) {
  const noop = () => {}
  const throws = () => { throw new Error('Error') }
  const returns = () => true

  it('should return the first non-undefined result', () => {
    const result = tries(noop, throws, returns)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<boolean | undefined>()
  })

  it('should return undefined if all functions throw or return undefined', () => {
    const result = tries(throws, noop)
    expect(result).toEqual(undefined)
    expectTypeOf(result).toEqualTypeOf<undefined>()
  })

  it('should throw if no functions are provided', () => {
    // @ts-expect-error: Expected at least one function.
    const shouldReject = () => tries()
    expect(shouldReject).rejects.toThrowError(Error)
  })

  it('should throw if any argument is not a function', () => {
    // @ts-expect-error: Expected all arguments to be functions.
    const shouldReject = () => tries(noop, 'foo')
    expect(shouldReject).rejects.toThrowError(TypeError)
  })
}
