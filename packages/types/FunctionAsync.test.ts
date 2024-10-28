import type { FunctionAsync } from './FunctionAsync'

describe('FunctionAsync', () => {
  test('should return an asyncronous function type', () => {
    expectTypeOf<FunctionAsync>().toEqualTypeOf<(...args: any[]) => Promise<any>>()
  })

  test('should return an asyncronous function type with no parameters', () => {
    type Result = FunctionAsync<boolean>
    expectTypeOf<Result>().toEqualTypeOf<(...args: any[]) => Promise<boolean>>()
  })

  test('should return an asyncronous function type with 1 parameter', () => {
    type Result = FunctionAsync<string, [value: number]>
    expectTypeOf<Result>().toEqualTypeOf<(value: number) => Promise<string>>()
  })

  test('should return an asyncronous function with 3 parameters', () => {
    type Result = FunctionAsync<string, [a: number, b: string, c: boolean]>
    expectTypeOf<Result>().toEqualTypeOf<(a: number, b: string, c: boolean) => Promise<string>>()
  })

  test('should return an asyncronous with rest parameters', () => {
    type Result = FunctionAsync<string, [a: number, ...b: string[]]>
    expectTypeOf<Result>().toEqualTypeOf<(a: number, ...b: string[]) => Promise<string>>()
  })

  test('should return an asyncronous with optional parameters', () => {
    type Result = FunctionAsync<string, [a: number, b: string, c?: boolean]>
    expectTypeOf<Result>().toEqualTypeOf<(a: number, b: string, c?: boolean) => Promise<string>>()
  })

  test('should return an asyncronous function with `this` context', () => {
    type Result = FunctionAsync<string, [number, string], { foo: string }>
    expectTypeOf<Result>().toEqualTypeOf<(this: { foo: string }, a: number, b: string) => Promise<string>>()
  })
})
