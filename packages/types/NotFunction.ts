import { Any } from './Any'
import { IsUnknown } from './utils/predicate'

/**
 * Matches anything that is not a function. If a generic is provided, it will
 * exclude functions from that type.
 *
 * @template T The type to exclude functions from.
 * @returns A type that excludes functions.
 * @example NotFunction & Function // never
 */
export type NotFunction<T = unknown> =
  IsUnknown<T> extends true
    ? Any & { apply?: never }
    : T extends Function ? never : T

/** c8 ignore next */
if (import.meta.vitest) {
  it('should exclude functions', () => {
    type Result = NotFunction<string | {} | (() => void)>
    expectTypeOf<Result>().toEqualTypeOf<string | {}>()
  })

  it('should match a non-function', () => {
    interface Matches {}
    type Result = NotFunction
    expectTypeOf<Matches>().toMatchTypeOf<Result>()
  })

  it('should not match a function', () => {
    type Matches = () => void
    type Result = NotFunction
    expectTypeOf<Matches>().not.toMatchTypeOf<Result>()
  })
}
