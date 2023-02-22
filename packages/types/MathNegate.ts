/**
 * The negative of a number.
 *
 * @template N The number to negate.
 * @returns The negative of the number.
 * @example MathNegative<1> // -1
 */
export type MathNegate<N extends number> =
  number extends N ? number
    : N extends 0 ? 0
      : `${N}` extends `-${infer S extends number}` ? S
        : `-${N}` extends `${infer S extends number}` ? S
          : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should negate a positive integer', () => {
    type result = MathNegate<1>
    expectTypeOf<result>().toEqualTypeOf<-1>()
  })

  it('should negate a negative integer', () => {
    type result = MathNegate<-1>
    expectTypeOf<result>().toEqualTypeOf<1>()
  })

  it('should negate a positive decimal', () => {
    type result = MathNegate<1.1>
    expectTypeOf<result>().toEqualTypeOf<-1.1>()
  })

  it('should negate a negative decimal', () => {
    type result = MathNegate<-1.1>
    expectTypeOf<result>().toEqualTypeOf<1.1>()
  })

  it('should not negate zero', () => {
    type result = MathNegate<0>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should negate number', () => {
    type result = MathNegate<number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
