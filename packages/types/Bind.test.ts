import type { Bind } from './Bind'

describe('Bind', () => {
  test('should return the type as is if no parameters are provided', () => {
    type Result = Bind<(x: number, y: number) => boolean>
    type Expected = (x: number, y: number) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should return a bound function as is if no other parameters are provided', () => {
    type Result = Bind<(this: string, x: number, y: number) => boolean>
    type Expected = (this: string, x: number, y: number) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should bind the this parameter if using named tuple parameters', () => {
    type Result = Bind<(x: number, y: number) => boolean, [this: string]>
    type Expected = (this: string, x: number, y: number) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should bind the this parameter and append the other parameters', () => {
    type Result = Bind<(x: number, y: number) => boolean, [this: string, x: string]>
    type Expected = (this: string, y: number) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should only bind the parameters if no this parameter is provided', () => {
    type Result = Bind<(x: number, y: number) => boolean, [undefined, x: string]>
    type Expected = (y: number) => boolean
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })
})
