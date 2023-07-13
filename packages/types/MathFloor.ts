import { Add, Negative } from './utils/arithmetics'
import { IsInteger, IsNumber } from './utils/predicate'

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

/** c8 ignore next */
if (import.meta.vitest) {
  it('should floor a positive decimal', () => {
    type Result = MathFloor<1.1>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  it('should floor a negative decimal', () => {
    type Result = MathFloor<-1.1>
    expectTypeOf<Result>().toEqualTypeOf<-2>()
  })

  it('should floor a positive integer', () => {
    type Result = MathFloor<1>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  it('should floor a negative integer', () => {
    type Result = MathFloor<-1>
    expectTypeOf<Result>().toEqualTypeOf<-1>()
  })

  it('should floor zero to zero', () => {
    type Result = MathFloor<0>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  it('should return number when given number', () => {
    type Result = MathFloor<number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
}
