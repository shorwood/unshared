import type { DefaultObject } from './DefaultObject'
import type { DefaultTuple } from './DefaultTuple'
import type { DefaultValue } from './DefaultValue'

/**
 * Default a value or collection by another value or collection. Meaning that if
 * the first value is undefined or null, the second value will be used instead.
 *
 * You can also apply defaults to nested objects by setting the `N` template to
 * a positive number.
 *
 * @template T The value or collection to default
 * @template U The value or collection to default with
 * @template N The depth to apply the defaults
 * @returns The defaulted value or collection
 * @example Default<number | undefined, string> // number | string
 */
export type Default<T, U, N extends number = 0> =
  T extends unknown[] ? U extends unknown[]
    ? DefaultTuple<T, U, N>
    : DefaultValue<T, U>

    // --- Default objects.
    : T extends object ? U extends object
      ? DefaultObject<T, U, N>
      : DefaultValue<T, U>

      // --- Default primitives.
      : DefaultValue<T, U>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should default objects', () => {
    type Result = Default<{ a: number; b: string | undefined }, { a: number; b: string }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: number; b: string }>()
  })

  it('should default tuples', () => {
    type Result = Default<[number, string | undefined], [number, string]>
    expectTypeOf<Result>().toEqualTypeOf<[number, string]>()
  })

  it('should default arrays', () => {
    type Result = Default<(number | undefined)[], string[]>
    expectTypeOf<Result>().toEqualTypeOf<(number | string)[]>()
  })

  it('should default primitives', () => {
    type Result = Default<number | undefined, string>
    expectTypeOf<Result>().toEqualTypeOf<number | string>()
  })

  it('should default non matching types from left to right', () => {
    type Result = Default<number | undefined, string[]>
    expectTypeOf<Result>().toEqualTypeOf<number | string[]>()
  })
}
