import type { Function } from './Function'

describe('Function', () => {
  test('should return a function type', () => {
    expectTypeOf<Function>().toEqualTypeOf<(...args: any[]) => any>()
  })

  test('should return an function type with no parameters', () => {
    type Result = Function<boolean>
    expectTypeOf<Result>().toEqualTypeOf<(...args: any[]) => boolean>()
  })

  test('should return a function type with 1 parameter', () => {
    type Result = Function<string, [value: number]>
    expectTypeOf<Result>().toEqualTypeOf<(value: number) => string>()
  })

  test('should return a function with 3 parameters', () => {
    type Result = Function<string, [a: number, b: string, c: boolean]>
    expectTypeOf<Result>().toEqualTypeOf<(a: number, b: string, c: boolean) => string>()
  })

  test('should return a function with rest parameters', () => {
    type Result = Function<string, [a: number, ...b: string[]]>
    expectTypeOf<Result>().toEqualTypeOf<(a: number, ...b: string[]) => string>()
  })

  test('should return a function with optional parameters', () => {
    type Result = Function<string, [a: number, b: string, c?: boolean]>
    expectTypeOf<Result>().toEqualTypeOf<(a: number, b: string, c?: boolean) => string>()
  })

  test('should return a function with `this` context', () => {
    type Result = Function<string, [number, string], { foo: string }>
    expectTypeOf<Result>().toEqualTypeOf<(this: { foo: string }, a: number, b: string) => string>()
  })
})
