import type { Path } from './Path'

describe('Path', () => {
  test('should infer the path of a nested object', () => {
    type Result = Path<{ foo: { bar: { baz: string } } }>
    type Expected = 'foo' | 'foo.bar' | 'foo.bar.baz'
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should not infer nested paths if the recursion threshold is reached', () => {
    type Result = Path<{ foo: { bar: { baz: string } } }, 1>
    type Expected = 'foo'
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should infer the path of a nested array', () => {
    type Result = Path<{ foo: { bar: { baz: string[] } } }>
    type Expected = 'foo' | 'foo.bar' | 'foo.bar.baz' | `foo.bar.baz.${number}`
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should infer the path of a nested object with a number key', () => {
    type Result = Path<{ [x: number]: string; foo: string }>
    type Expected = 'foo' | `${number}`
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should infer the path of a nested object with a symbol key', () => {
    type Result = Path<{ [x: symbol]: string; foo: string }>
    type Expected = 'foo'
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should ignore nested symbol keys', () => {
    type Result = Path<{ foo: Record<symbol, string> }>
    type Expected = 'foo'
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should infer the path of an array of strings', () => {
    type Result = Path<string[]>
    type Expected = `${number}`
    expectTypeOf<Result>().toEqualTypeOf<Expected>()
  })

  test('should infer the path of a string to never', () => {
    type Result = Path<string>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should infer the path of a number to never', () => {
    type Result = Path<number>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })

  test('should infer the path of a boolean to never', () => {
    type Result = Path<boolean>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
})
