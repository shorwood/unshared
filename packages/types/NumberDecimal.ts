/**
 * A decimal number.
 *
 * @param N Number to match.
 * @returns A number that is garanteed to be a positive decimal number.
 * @example NumberDecimal<1.1> // 1.1
 */
export type NumberDecimal<N extends number = number> =
  number extends N ? number
    : `${N}` extends `${number}.${number}` ? N
      : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match a positive decimal', () => {
    type result = NumberDecimal<1.1>
    expectTypeOf<result>().toEqualTypeOf<1.1>()
  })

  it('should not match a positive integer', () => {
    type result = NumberDecimal<1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should not match a negative decimal', () => {
    type result = NumberDecimal<-1.1>
    expectTypeOf<result>().toEqualTypeOf<-1.1>()
  })

  it('should not match a negative integer', () => {
    type result = NumberDecimal<-1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should not match zero', () => {
    type result = NumberDecimal<0>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should match number', () => {
    type result = NumberDecimal<number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
