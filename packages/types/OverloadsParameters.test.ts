import type { OverloadsParameters } from './OverloadsParameters'

describe('OverloadsParameters', () => {
  test('should infer the parameters of a function with no overloads', () => {
    type Method = (a: number, b: string) => boolean
    type Result = OverloadsParameters<Method>
    expectTypeOf<Result>().toEqualTypeOf<[number, string]>()
  })

  test('should infer the parameters of a function with multiple overloads', () => {
    interface Method {
      (a: number, b: string): string
      (a: string, b: number): number
    }
    type Result = OverloadsParameters<Method>
    expectTypeOf<Result>().toEqualTypeOf<[number, string] | [string, number]>()
  })
})
