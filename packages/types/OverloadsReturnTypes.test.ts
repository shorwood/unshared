import type { OverloadsReturnTypes } from './OverloadsReturnTypes'

describe('OverloadsReturnTypes', () => {
  test('should infer the return type of a function with no overloads', () => {
    type Method = (a: number, b: string) => boolean
    type Result = OverloadsReturnTypes<Method>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  test('should infer the return type of a function with multiple overloads', () => {
    interface Method {
      (a: number, b: string): string
      (a: string, b: number): number
    }
    type Result = OverloadsReturnTypes<Method>
    expectTypeOf<Result>().toEqualTypeOf<number | string>()
  })
})
