/**
 * A negative decimal number.
 *
 * @template N Number to match.
 * @returns A number that is garanteed to be a negative decimal number.
 * @example NumberDecimalNegative<-1.1> // -1.1
 */
export type NumberDecimalNegative<N extends number = number> =
  number extends N ? number
    : `${N}` extends `-${number}.${number}` ? N
      : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should not match a positive decimal', () => {
    type result = NumberDecimalNegative<1.1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should not match a positive integer', () => {
    type result = NumberDecimalNegative<1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should match a negative decimal', () => {
    type result = NumberDecimalNegative<-1.1>
    expectTypeOf<result>().toEqualTypeOf<-1.1>()
  })

  it('should not match a negative integer', () => {
    type result = NumberDecimalNegative<-1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should not match zero', () => {
    type result = NumberDecimalNegative<0>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should match number', () => {
    type result = NumberDecimalNegative<number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
