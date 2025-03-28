import type { Key } from './Key'

describe('Key', () => {
  test('should return the keys of an object', () => {
    type Result = Key<{ readonly a: 1; b: 2; c?: 3 }>
    expectTypeOf<Result>().toEqualTypeOf<'a' | 'b' | 'c'>()
  })

  test('should return the keys of an array', () => {
    type Result = Key<number[]>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return the keys of a tuple', () => {
    type Result = Key<readonly [1, 2, 3]>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return the keys of a readonly array', () => {
    type Result = Key<readonly number[]>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return the keys of a set', () => {
    type Result = Key<Set<number>>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return the keys of a map', () => {
    type Result = Key<Map<string, number>>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return the keys of a string', () => {
    type Result = Key<string>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should return the keys of a literal string', () => {
    type Result = Key<'abc'>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should fallback to PropertyKey', () => {
    expectTypeOf<Key>().toEqualTypeOf<PropertyKey>()
  })
})
