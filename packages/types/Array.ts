import { Tuple } from './Tuple'
import { IsDecimal, IsNumber, IsZero } from './utils/arithmetics'

/**
 * An array of elements of type `U`.
 *
 * @template U The type of the elements.
 * @example Array<number> // number[]
 */
export type Array<U = unknown, L extends number = number> =
  IsNumber<L> extends true ? U[]
    : IsZero<L> extends true ? []
      : IsDecimal<L> extends true ? never
        : Tuple<L, U>

/** c8 ignore next */
if (import.meta.vitest) {
  it('should return an array of 3 numbers', () => {
    type result = Array<number, 3>
    type expected = [number, number, number]
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should return an array of numbers by default', () => {
    type result = Array<number>
    type expected = number[]
    expectTypeOf<result>().toEqualTypeOf<expected>()
  })

  it('should return an array of unknown by default', () => {
    type result = Array
    expectTypeOf<result>().toEqualTypeOf<unknown[]>()
  })

  it('should return an empty array if L is zero', () => {
    type result = Array<number, 0>
    expectTypeOf<result>().toEqualTypeOf<[]>()
  })

  it('should return never if L is negative', () => {
    type result = Array<number, -1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should return never if L is a decimal', () => {
    type result = Array<number, 1.1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })
}
