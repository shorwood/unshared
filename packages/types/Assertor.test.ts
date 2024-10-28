import type { Assertor } from './Assertor'

describe('Assertor', () => {
  test('should give a function that asserts a value is a string', () => {
    type Result = Assertor<string>
    expectTypeOf<Result>().toEqualTypeOf<(value: unknown, ...args: any[]) => asserts value is string>()
  })

  test('should give a function that asserts a value is a number', () => {
    type Result = Assertor<number>
    expectTypeOf<Result>().toEqualTypeOf<(value: unknown, ...args: any[]) => asserts value is number>()
  })

  test('should give a function that asserts a value is a boolean and takes a parameter', () => {
    type Result = Assertor<boolean, [other: string]>
    expectTypeOf<Result>().toEqualTypeOf<(value: unknown, other: string) => asserts value is boolean>()
  })
})
