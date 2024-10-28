import type { Tuple } from './Tuple'

describe('Tuple', () => {
  test('should build a tuple of length 3', () => {
    type Result = Tuple<3>
    expectTypeOf<Result>().toEqualTypeOf<[unknown, unknown, unknown]>()
  })

  test('should build a tuple of length 0', () => {
    type Result = Tuple<0>
    expectTypeOf<Result>().toEqualTypeOf<[]>()
  })

  test('should build a tuple of length 3 with string', () => {
    type Result = Tuple<3, string>
    expectTypeOf<Result>().toEqualTypeOf<[string, string, string]>()
  })

  test('should build an array if L is number', () => {
    type Result = Tuple<number, string>
    expectTypeOf<Result>().toEqualTypeOf<string[]>()
  })

  test('should build an array of unknown by default', () => {
    expectTypeOf<Tuple>().toEqualTypeOf<unknown[]>()
  })

  test('should return never if L is negative', () => {
    type Result = Tuple<-1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should return never if L is a decimal', () => {
    type Result = Tuple<1.1>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
})
