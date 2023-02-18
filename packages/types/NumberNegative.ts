/**
 * A negative number.
 *
 * @param N Number to match.
 * @returns A number that is garanteed to be negative.
 * @example NumberNegative<-1> // -1
 */
export type NumberNegative<N extends number> =
  number extends N ? number
    : `${N}` extends `-${number}` ? N
      : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match a negative integer', () => {
    type result = NumberNegative<-1>
    expectTypeOf<result>().toEqualTypeOf<-1>()
  })

  it('should match a negative decimal', () => {
    type result = NumberNegative<-1.1>
    expectTypeOf<result>().toEqualTypeOf<-1.1>()
  })

  it('should not match a positive integer', () => {
    type result = NumberNegative<1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should not match a positive decimal', () => {
    type result = NumberNegative<1.1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should not match zero', () => {
    type result = NumberNegative<0>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should match number', () => {
    type result = NumberNegative<number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
