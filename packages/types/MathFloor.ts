import type { Add, IsInteger, IsNumber, Negative } from './utils'

/**
 * Floors a number to the nearest integer.
 *
 * @template N The number to floor.
 * @returns The floored number.
 * @example MathFloor<1.1> // 1
 */
export type MathFloor<N extends number> =
  IsNumber<N> extends true ? number
    : IsInteger<N> extends true ? N
      : `${N}` extends `-${infer S extends number}.${number}` ? Negative<Add<S, 1>>
        : `${N}` extends `${infer S extends number}.${number}` ? S
          : never

/* v8 ignore next */
if (import.meta.vitest) {
  test('should floor a positive decimal', () => {
    type Result = MathFloor<1.1>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  test('should floor a negative decimal', () => {
    type Result = MathFloor<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<-2>()
  })

  test('should floor a positive integer', () => {
    type Result = MathFloor<1>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  test('should floor a negative integer', () => {
    type Result = MathFloor<-1>
    expectTypeOf<Result>().toEqualTypeOf<-1>()
  })

  test('should floor zero to zero', () => {
    type Result = MathFloor<0>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should return number when given number', () => {
    type Result = MathFloor<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
