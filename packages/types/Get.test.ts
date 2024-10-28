import type { Get } from './Get'

describe('Get', () => {
  test('should infer the value in an object at the given key', () => {
    type Result = Get<{ foo: 'foo' }, 'foo'>
    expectTypeOf<Result>().toEqualTypeOf<'foo'>()
  })

  test('should infer the value in an object at the given path', () => {
    type Result = Get<{ foo: { bar: 'bar' } }, 'foo.bar'>
    expectTypeOf<Result>().toEqualTypeOf<'bar'>()
  })

  test('should infer the value in an array at the given index', () => {
    type Result = Get<[1, 2], '0'>
    expectTypeOf<Result>().toEqualTypeOf<1>()
  })

  test('should infer the value in an array at the given path', () => {
    type Result = Get<[1, [2, 3]], '1.0'>
    expectTypeOf<Result>().toEqualTypeOf<2>()
  })

  test('should infer the value in a Set at the given index', () => {
    type Result = Get<Set<number>, '42'>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should infer the value in a Map at the given index', () => {
    type Result = Get<Map<string, number>, '0'>
    expectTypeOf<Result>().toEqualTypeOf<[string, number]>()
  })

  test('should infer the value in a Map at the given path', () => {
    type Result = Get<Map<string, { foo: number }>, '0.1.foo'>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return never if the path is invalid', () => {
    type Result = Get<{ foo: string }, 'foo.bar'>
    expectTypeOf<Result>().toEqualTypeOf<never>()
  })
})
