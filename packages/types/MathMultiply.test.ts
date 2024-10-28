import type { MathMultiply } from './MathMultiply'

describe('MathMultiply', () => {
  test('should compute the product of 10 and 10 as 100', () => {
    type Result = MathMultiply<5, 10>
    expectTypeOf<Result>().toEqualTypeOf<50>()
  })

  test('should return number when a negative integer is passed', () => {
    type Result = MathMultiply<5, -10>
    expectTypeOf<Result>().toEqualTypeOf<-50>()
  })

  test('should return number when two negative integer are passed', () => {
    type Result = MathMultiply<-5, -10>
    expectTypeOf<Result>().toEqualTypeOf<50>()
  })

  test('should compute the product of 0 and 10 as 0', () => {
    type Result = MathMultiply<0, 10>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should compute the product of 10 and 0 as 0', () => {
    type Result = MathMultiply<10, 0>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should compute the product of 0 and 0 as 0', () => {
    type Result = MathMultiply<0, 0>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should return number when a number is passed', () => {
    type Result = MathMultiply<10, number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
})
