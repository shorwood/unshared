import { IsUnknown } from './utils'
import { Any } from './Any'

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
    ? { apply?: never } & Any
    : T extends Function ? never : T

/* v8 ignore next */
if (import.meta.vitest) {
  test('should exclude functions', () => {
    type Result = NotFunction<(() => void) | {} | string>
    expectTypeOf<Result>().toEqualTypeOf<{} | string>()
  })

  test('should match a non-function', () => {
    interface Matches {}
    type Result = NotFunction
    expectTypeOf<Matches>().toMatchTypeOf<Result>()
  })

  test('should not match a function', () => {
    type Matches = () => void
    type Result = NotFunction
    expectTypeOf<Matches>().not.toMatchTypeOf<Result>()
  })
}
