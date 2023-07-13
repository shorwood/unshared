import { Tuple } from './Tuple'
import { IsDecimal, IsNumber } from './utils/predicate'

/**
 * An array of elements of type `U`.
 *
 * @template U The type of the elements.
 * @template L The length of the array.
 * @example Array<number> // number[]
 */
export type Array<U = unknown, L extends number = number> =
  IsNumber<L> extends true ? U[]
    : IsDecimal<L> extends true ? never
      : Tuple<L, U>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return an array of 3 numbers', () => {
    type Result = Array<number, 3>
    type Expected = [number, number, number]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should return an array of numbers by default', () => {
    type Result = Array<number>
    type Expected = number[]
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  it('should return an array of unknown by default', () => {
    type Result = Array
    expectTypeOf<Result>().toEqualTypeOf<unknown[]>()
  })

  it('should return an empty array if L is zero', () => {
    type Result = Array<number, 0>
    expectTypeOf<Result>().toEqualTypeOf<[]>()
  })

  it('should return never if L is negative', () => {
    type Result = Array<number, -1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  it('should return never if L is a decimal', () => {
    type Result = Array<number, 1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
}
