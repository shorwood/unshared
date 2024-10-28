import type { MathModulo } from './MathModulo'

describe('MathModulo', () => {
  test('should compute the remainder of 10 and 8 as 2', () => {
    type Result = MathModulo<10, 8>
    expectTypeOf<Result>().toEqualTypeOf<2>()
  })

  test('should compute the remainder of 10 and -8 as -2', () => {
    type Result = MathModulo<10, -8>
    expectTypeOf<Result>().toEqualTypeOf<-2>()
  })

  test('should compute the remainder of -10 and 8 as -2', () => {
    type Result = MathModulo<-10, 8>
    expectTypeOf<Result>().toEqualTypeOf<-2>()
  })

  test('should compute the remainder of -10 and -8 as 2', () => {
    type Result = MathModulo<-10, -8>
    expectTypeOf<Result>().toEqualTypeOf<2>()
  })

  test('should compute the remainder of 0 and 10 as 0', () => {
    type Result = MathModulo<0, 10>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should compute the remainder of 10 and 0 as never', () => {
    type Result = MathModulo<10, 0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should compute the remainder of 0 and 0 as never', () => {
    type Result = MathModulo<0, 0>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should return number when a number is passed', () => {
    type Result = MathModulo<10, number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return number when a decimal is passed', () => {
    type Result = MathModulo<10, 3.14>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
})
