/**
 * A strictly positive integer number. Excludes zero.
 *
 * @param N Number to match.
 * @returns A number that is garanteed to be a strict positive integer.
 * @example NumberIntegerPositive<1> // 1
 */
export type NumberIntegerPositive<N extends number> =
  number extends N ? number
    :`${N}` extends `${number}.${number}` ? never
      :`${N}` extends `-${number}` ? never
        : N extends 0 ? never
          : N

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match a positive integer', () => {
    type result = NumberIntegerPositive<1>
    expectTypeOf<result>().toEqualTypeOf<1>()
  })

  it('should not match a positive decimal', () => {
    type result = NumberIntegerPositive<1.1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should not match a negative integer', () => {
    type result = NumberIntegerPositive<-1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should not match a negative decimal', () => {
    type result = NumberIntegerPositive<-1.1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should not match zero', () => {
    type result = NumberIntegerPositive<0>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should match number', () => {
    type result = NumberIntegerPositive<number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
