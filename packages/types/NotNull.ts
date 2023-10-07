import type { Any } from './Any'
import type { IsUnknown } from './utils'

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

/** c8 ignore next */
if (import.meta.vitest) {
  it('should exclude null', () => {
    type Result = NotNull<number | null>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should match non-null', () => {
    expectTypeOf<number>().toMatchTypeOf<NotNull>()
  })

  it('should not match null', () => {
    expectTypeOf<null>().not.toMatchTypeOf<NotNull>()
  })
}
