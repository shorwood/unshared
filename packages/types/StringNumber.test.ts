import type { StringNumber } from './StringNumber'

describe('StringNumber', () => {
  test('should infer a positive integer', () => {
    type Result = StringNumber<'42'>
    expectTypeOf<Result>().toEqualTypeOf<42>()
  })

  test('should infer a negative integer', () => {
    type Result = StringNumber<'-42'>
    expectTypeOf<Result>().toEqualTypeOf<-42>()
  })

  test('should infer a positive decimal', () => {
    type Result = StringNumber<'42.1'>
    expectTypeOf<Result>().toEqualTypeOf<42.1>()
  })

  test('should infer a negative decimal', () => {
    type Result = StringNumber<'-42.1'>
    expectTypeOf<Result>().toEqualTypeOf<-42.1>()
  })

  test('should infer number from a string', () => {
    type Result = StringNumber<string>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return never when a non-number is passed', () => {
    type Result = StringNumber<'a'>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
})
