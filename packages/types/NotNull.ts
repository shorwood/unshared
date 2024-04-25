import { IsUnknown } from './utils'
import { Any } from './Any'

/**
 * Matches anything that is not `null`. If a generic is provided, it will
 * exclude `null` from that type.
 *
 * @template U The type to exclude `null` from.
 * @returns A type that excludes `null`.
 * @example NotNull<number | null> // number
 */
export type NotNull<U = unknown> =
  IsUnknown<U> extends true
    ? NotNull<Any>
    : U extends null ? never : U

/* v8 ignore next */
if (import.meta.vitest) {
  test('should exclude null', () => {
    type Result = NotNull<null | number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should match non-null', () => {
    expectTypeOf<number>().toMatchTypeOf<NotNull>()
  })

  test('should not match null', () => {
    expectTypeOf<null>().not.toMatchTypeOf<NotNull>()
  })
}
