import type { Predicator } from './Predicator'

describe('Predicator', () => {
  test('should return a predicator for unknowns', () => {
    type Expected = (value: any, ...args: any[]) => value is unknown
    expectTypeOf<Predicator>().toEqualTypeOf<Expected>()
  })

  test('should return a predicator for strings', () => {
    type Result = Predicator<string>
    type Expected = (value: any, ...args: any[]) => value is string
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return a predicator for numbers', () => {
    type Result = Predicator<number>
    type Expected = (value: any, ...args: any[]) => value is number
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should match the predicator', () => {
    type Match = (value: unknown) => value is string
    expectTypeOf<Match>().toExtend<Predicator>()
  })

  test('should not match functions that return a boolean', () => {
    type Match = (value: unknown) => boolean
    expectTypeOf<Match>().not.toExtend<Predicator>()
  })
})
