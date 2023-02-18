/**
 * A negative decimal number.
 *
 * @param N Number to match.
 * @returns A number that is garanteed to be a negative decimal number.
 * @example NumberDecimalNegative<-1.1> // -1.1
 */
export type NumberDecimalPositive<N extends number = number> =
  number extends N ? number
    : `${N}` extends `-${number}.${number}` ? N
      : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should not match a positive decimal', () => {
    type result = NumberDecimalPositive<1.1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should not match a positive integer', () => {
    type result = NumberDecimalPositive<1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should match a negative decimal', () => {
    type result = NumberDecimalPositive<-1.1>
    expectTypeOf<result>().toEqualTypeOf<-1.1>()
  })

  it('should not match a negative integer', () => {
    type result = NumberDecimalPositive<-1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should not match zero', () => {
    type result = NumberDecimalPositive<0>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should match number', () => {
    type result = NumberDecimalPositive<number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
