import type { Nil } from './Nil'

/**
 * Matches anything that is not `null`, `undefined` or `void`. If a generic is
 * provided, it will exclude `null`, `undefined` and `void` from that type.
 *
 * @template U The type to exclude `null`, `undefined` and `void` from.
 * @returns A type that excludes `null`, `undefined` and `void`.
 * @example NotNil<number | undefined> // number
 */
export type NotNil<U = unknown> = U extends Nil ? never : U

/* v8 ignore next */
if (import.meta.vitest) {
  test('should exclude null', () => {
    type Result = NotNil<null | number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should exclude undefined', () => {
    type Result = NotNil<number | undefined>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should exclude void', () => {
    type Result = NotNil<number | void>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should exclude null, undefined and void', () => {
    type Result = NotNil<null | number | undefined | void>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should match non-null, non-undefined and non-void', () => {
    expectTypeOf<number>().toMatchTypeOf<NotNil>()
  })

  test('should equal to unknown when no generic is provided', () => {
    expectTypeOf<NotNil>().toEqualTypeOf<unknown>()
  })
}
