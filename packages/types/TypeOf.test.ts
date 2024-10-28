import type { Function } from './Function'
import type { TypeOf } from './TypeOf'

describe('TypeOf', () => {
  test('should infer the type of "number"', () => {
    type Result = TypeOf<'number'>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should infer the type of "string"', () => {
    type Result = TypeOf<'string'>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })

  test('should infer the type of "boolean"', () => {
    type Result = TypeOf<'boolean'>
    expectTypeOf<Result>().toEqualTypeOf<boolean>()
  })

  test('should infer the type of "object"', () => {
    type Result = TypeOf<'object'>
    expectTypeOf<Result>().toEqualTypeOf<object>()
  })

  test('should infer the type of "symbol"', () => {
    type Result = TypeOf<'symbol'>
    expectTypeOf<Result>().toEqualTypeOf<symbol>()
  })

  test('should infer the type of "bigint"', () => {
    type Result = TypeOf<'bigint'>
    expectTypeOf<Result>().toEqualTypeOf<bigint>()
  })

  test('should infer the type of "undefined"', () => {
    type Result = TypeOf<'undefined'>
    expectTypeOf<Result>().toEqualTypeOf<undefined>()
  })

  test('should infer the type of "function"', () => {
    type Result = TypeOf<'function'>
    expectTypeOf<Result>().toEqualTypeOf<Function>()
  })

  test('should infer "never" for non-matching literals', () => {
    type Result = TypeOf<'foo'>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should infer "never" for non-literal strings', () => {
    type Result = TypeOf<string>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
})
