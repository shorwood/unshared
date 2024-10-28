import type { MathSum } from './MathSum'

describe('MathSum', () => {
  test('should compute the sum of positive integers', () => {
    type Result = MathSum<[1, 2, 3]>
    expectTypeOf<Result>().toEqualTypeOf<6>()
  })

  test('should compute the sum of negative integers', () => {
    type Result = MathSum<[-1, -2, -3]>
    expectTypeOf<Result>().toEqualTypeOf<-6>()
  })

  test('should compute the sum of mixed integers', () => {
    type Result = MathSum<[-1, 2, -3]>
    expectTypeOf<Result>().toEqualTypeOf<-2>()
  })

  test('should compute the sum of a single integer', () => {
    type Result = MathSum<[1]>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  test('should compute the sum of an empty tuple', () => {
    type Result = MathSum<[]>
    expectTypeOf<Result>().toEqualTypeOf<0>()
  })

  test('should compute the sum of decimals to a number', () => {
    type Result = MathSum<[1, 2.5, 3]>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should compute the sum of a tuple of numbers to a number', () => {
    type Result = MathSum<[1, 2, number]>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })
})
