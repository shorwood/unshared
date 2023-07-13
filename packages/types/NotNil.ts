import { Any } from './Any'
import { Nil } from './Nil'
import { IsUnknown } from './utils/predicate'

/**
 * Matches anything that is not `null`, `undefined` or `void`. If a generic is
 * provided, it will exclude `null`, `undefined` and `void` from that type.
 *
 * @template U The type to exclude `null`, `undefined` and `void` from.
 * @returns A type that excludes `null`, `undefined` and `void`.
 * @example NotNil<number | undefined> // number
 */
export type NotNil<U = unknown> = IsUnknown<U> extends true ? NotNil<Any> : U extends Nil ? never : U

/** c8 ignore next */
if (import.meta.vitest) {
  it('should exclude null', () => {
    type Result = NotNil<number | null>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should exclude undefined', () => {
    type Result = NotNil<number | undefined>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should exclude void', () => {
    type Result = NotNil<number | void>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should exclude null, undefined and void', () => {
    type Result = NotNil<number | null | undefined | void>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should match non-null, non-undefined and non-void', () => {
    expectTypeOf<number>().toMatchTypeOf<NotNil>()
  })

  it('should not match null', () => {
    expectTypeOf<null>().not.toMatchTypeOf<NotNil>()
  })

  it('should not match undefined', () => {
    expectTypeOf<undefined>().not.toMatchTypeOf<NotNil>()
  })

  it('should not match void', () => {
    expectTypeOf<void>().not.toMatchTypeOf<NotNil>()
  })
}
