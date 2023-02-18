/**
 * A strictly positive number. Excludes zero.
 *
 * @param N Number to match.
 * @returns A number that is garanteed to be striclty positive.
 * @example NumberPositive<1> // 1
 */
export type NumberPositive<N extends number> =
  number extends N ? number
    : `${N}` extends `-${number}` ? never
      : N extends 0 ? never
        : N

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match a positive integer', () => {
    type result = NumberPositive<1>
    expectTypeOf<result>().toEqualTypeOf<1>()
  })

  it('should match a positive decimal', () => {
    type result = NumberPositive<1.1>
    expectTypeOf<result>().toEqualTypeOf<1.1>()
  })

  it('should not match a negative integer', () => {
    type result = NumberPositive<-1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should not match a negative decimal', () => {
    type result = NumberPositive<-1.1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should not match zero', () => {
    type result = NumberPositive<0>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should match number', () => {
    type result = NumberPositive<number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
