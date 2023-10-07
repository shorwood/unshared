import type { Any } from './Any'

/**
 * Matches anything that is not `undefined`. If a generic is provided, it will
 * exclude `undefined` from that type.
 *
 * @template U The type to exclude `undefined` from.
 * @returns A type that excludes `undefined`.
 * @example NotUndefined<number | undefined> // number
 */
export type NotUndefined<U = Any> = U extends undefined ? never : U

/** c8 ignore next */
if (import.meta.vitest) {
  it('should exclude undefined', () => {
    type Result = NotUndefined<number | undefined>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  it('should match non-undefined', () => {
    expectTypeOf<number>().toMatchTypeOf<NotUndefined>()
  })

  it('should not match undefined', () => {
    expectTypeOf<undefined>().not.toMatchTypeOf<NotUndefined>()
  })
}
