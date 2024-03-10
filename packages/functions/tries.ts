import { Function } from '@unshared/types'

/**
 * The result of trying multiple functions.
 *
 * @template F The functions to try.
 * @returns The first non-undefined result.
 * @example type Result = TriesResult<[() => string, () => number]> // string | number | undefined
 */
export type TriesResult<F extends Function[]> =
  F extends Array<Function<infer U>>
    ? Exclude<U, void>
    : never

/**
 * Try multiple functions and return the result of the first one that does not throw.
 * The functions are called in order until one successfully returns a value.
 *
 * @param functions The functions to try.
 * @returns A promise that resolves to the first non-undefined result.
 * @example tries(throws, Date.now) // 1658682347132
 */
export function tries<F extends [Function, ...Function[]]>(...functions: F): TriesResult<F> | undefined {
  for (const fn of functions) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return fn()
    }
    catch {
      // --- Continue to the next function if the current one throws.
    }
  }
}

/* v8 ignore start */
if (import.meta.vitest) {
  const noop = () => {}
  const throws = () => { throw new Error('Error') }
  const returnsBoolean = () => true
  const returnsString = () => 'string'
  const resolvesNumber = () => Promise.resolve(1)

  it('should return the first result that does not throw', () => {
    const result = tries(throws, returnsBoolean, returnsString, resolvesNumber)
    expect(result).toEqual(true)
    expectTypeOf(result).toEqualTypeOf<Promise<number> | boolean | string | undefined>()
  })

  it('should return undefined if all functions throw or return undefined', () => {
    const result = tries(throws, noop)
    expect(result).toEqual(undefined)
    expectTypeOf(result).toEqualTypeOf<undefined>()
  })
}
