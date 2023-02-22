/**
 * A negative integer.
 *
 * @template N Number to match.
 * @returns A number that is garanteed to be a negative integer.
 * @example NumberIntegerNegative<1> // 1
 */
export type NumberIntegerNegative<N extends number> =
  number extends N ? number
    :`${N}` extends `${number}.${number}` ? never
      :`${N}` extends `-${number}` ? N
        : N extends 0 ? never
          : never

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match a negative integer', () => {
    type result = NumberIntegerNegative<-1>
    expectTypeOf<result>().toEqualTypeOf<-1>()
  })

  it('should not match a positive integer', () => {
    type result = NumberIntegerNegative<1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should not match a negative decimal', () => {
    type result = NumberIntegerNegative<-1.1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should not match a positive decimal', () => {
    type result = NumberIntegerNegative<1.1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should not match zero', () => {
    type result = NumberIntegerNegative<0>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should match number', () => {
    type result = NumberIntegerNegative<number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
