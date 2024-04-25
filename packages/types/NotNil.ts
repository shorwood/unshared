import { IsUnknown } from './utils'
import { Nil } from './Nil'
import { Any } from './Any'

/**
 * Matches anything that is not `null`, `undefined` or `void`. If a generic is
 * provided, it will exclude `null`, `undefined` and `void` from that type.
 *
 * @template U The type to exclude `null`, `undefined` and `void` from.
 * @returns A type that excludes `null`, `undefined` and `void`.
 * @example NotNil<number | undefined> // number
 */
export type NotNil<U = unknown> = IsUnknown<U> extends true ? NotNil<Any> : U extends Nil ? never : U

/* v8 ignore next */
if (import.meta.vitest) {
  test('should exclude null', () => {
    type Result = NotNil<number | null>
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
    type Result = NotNil<number | void | null | undefined>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should match non-null, non-undefined and non-void', () => {
    expectTypeOf<number>().toMatchTypeOf<NotNil>()
  })

  test('should not match null', () => {
    expectTypeOf<null>().not.toMatchTypeOf<NotNil>()
  })

  test('should not match undefined', () => {
    expectTypeOf<undefined>().not.toMatchTypeOf<NotNil>()
  })

  test('should not match void', () => {
    expectTypeOf<void>().not.toMatchTypeOf<NotNil>()
  })
}
