import { Constructor } from './Constructor'

/**
 * Extract the instance type from a constructor or instance of a class.
 *
 * @template T The constructor type or instance type.
 * @example
 * // Given a constructor type, extract the instance type.
 * type Result = MaybeInstance<typeof Set> // Set<unknown>
 *
 * // Given an instance type, extract the instance type.
 * type Result = MaybeInstance<Set<number>> // Set<number>
 */
export type MaybeInstance<T> = T extends Constructor<infer C> ? C : T

/* v8 ignore start */
if (import.meta.vitest) {
  test('should extract the instance type from a constructor', () => {
    type Result = MaybeInstance<typeof Set>
    type Expected = Set<unknown>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should extract the instance type from an instance', () => {
    type Result = MaybeInstance<Set<number>>
    type Expected = Set<number>
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
}
