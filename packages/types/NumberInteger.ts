/**
 * An integer number.
 *
 * @param N Number to match.
 * @returns A number that is garanteed to be an integer.
 * @example NumberInteger<1> // 1
 */
export type NumberInteger<N extends number> =
  number extends N ? number
    : `${N}` extends `${number}.${number}` ? never
      : N

/** c8 ignore next */
if (import.meta.vitest) {
  it('should match a positive integer', () => {
    type result = NumberInteger<1>
    expectTypeOf<result>().toEqualTypeOf<1>()
  })

  it('should not match a positive decimal', () => {
    type result = NumberInteger<1.1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should match a negative integer', () => {
    type result = NumberInteger<-1>
    expectTypeOf<result>().toEqualTypeOf<-1>()
  })

  it('should not match a negative decimal', () => {
    type result = NumberInteger<-1.1>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  it('should match zero', () => {
    type result = NumberInteger<0>
    expectTypeOf<result>().toEqualTypeOf<0>()
  })

  it('should match number', () => {
    type result = NumberInteger<number>
    expectTypeOf<result>().toEqualTypeOf<number>()
  })
}
