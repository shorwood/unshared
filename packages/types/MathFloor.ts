import { InternalAdd, InternalNegate } from './utils'

/**
 * Floors a number to the nearest integer.
 *
 * @template N The number to floor.
 * @returns The floored number.
 * @example MathFloor<1.1> // 1
 */
export type MathFloor<N extends number> =
  number extends N ? number
    // @ts-expect-error: ignore
    : `${N}` extends `-${infer S extends number}.${number}` ? InternalNegate<InternalAdd<S, 1>>
      : `${N}` extends `${infer S extends number}.${number}` ? S
        : N extends number ? N
          : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should floor a positive decimal', () => {
    type result = MathFloor<1.1>
    expectTypeOf<result>().toEqualTypeOf<1>()
  })

  it('should floor a negative decimal', () => {
    type result = MathFloor<-1.1>
    expectTypeOf<result>().toEqualTypeOf<-2>()
  })

  it('should floor a positive integer', () => {
    type result = MathFloor<1>
    expectTypeOf<result>().toEqualTypeOf<1>()
  })

  it('should floor a negative integer', () => {
    type result = MathFloor<-1>
    expectTypeOf<result>().toEqualTypeOf<-1>()
  })

  it('should floor zero to zero', () => {
    type result = MathFloor<0>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should return number when given number', () => {
    type result = MathFloor<number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
