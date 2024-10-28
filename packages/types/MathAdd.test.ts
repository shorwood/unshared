import type { MathAdd } from './MathAdd'

describe('MathAdd', () => {
  test('should compute the sum of 10 and 10 as 20', () => {
    type Result = MathAdd<10, 10>
    expectTypeOf<Result>().toEqualTypeOf<20>()
  })

  test('should compute the sum of -10 and -10 as -20', () => {
    type Result = MathAdd<-10, -10>
    expectTypeOf<Result>().toEqualTypeOf<-20>()
  })

  test('should compute the sum of -5 and 10 as 5', () => {
    type Result = MathAdd<-5, 10>
    expectTypeOf<Result>().toEqualTypeOf<5>()
  })

  test('should compute the sum of 5 and -10 as -5', () => {
    type Result = MathAdd<5, -10>
    expectTypeOf<Result>().toEqualTypeOf<-5>()
  })

  test('should compute the sum of 10 and -5 as 5', () => {
    type Result = MathAdd<10, -5>
    expectTypeOf<Result>().toEqualTypeOf<5>()
  })

  test('should compute the sum of -5 and 5 as 0', () => {
    type Result = MathAdd<-5, 5>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should compute the sum of 0 and 10 as 10', () => {
    type Result = MathAdd<0, 10>
    expectTypeOf<Result>().toEqualTypeOf<10>()
  })

  test('should compute the sum of 10 and 0 as 10', () => {
    type Result = MathAdd<10, 0>
    expectTypeOf<Result>().toEqualTypeOf<10>()
  })

  test('should compute the sum of 0 and 0 as 0', () => {
    type Result = MathAdd<0, 0>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should return number the argument is number', () => {
    type Result = MathAdd<number, 0>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return number the argument is decimal', () => {
    type Result = MathAdd<10, 3.14>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
})
