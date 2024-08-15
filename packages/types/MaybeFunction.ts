import type { Function } from './Function'

/**
 * A type that may be a function that returns a value of type `T`
 * or a value of type `T` itself.
 *
 * @template T The type of the value that the function returns.
 * @template P The arguments that the function takes.
 * @example MaybeFunction<number> // number | (() => number)
 */
export type MaybeFunction<T, P extends any[] = []> = Function<T, P> | T

/* v8 ignore start */
if (import.meta.vitest) {
  test('should return a union of a number and a function that returns a number', () => {
    type Result = MaybeFunction<number>
    expectTypeOf<Result>().toEqualTypeOf<(() => number) | number>()
  })

  test('should return a union of a string and a function that returns a string', () => {
    type Result = MaybeFunction<string>
    expectTypeOf<Result>().toEqualTypeOf<(() => string) | string>()
  })

  test('should return a union of a number and a function that returns a number with arguments', () => {
    type Result = MaybeFunction<number, [n: number]>
    expectTypeOf<Result>().toEqualTypeOf<((n: number) => number) | number>()
  })
}
