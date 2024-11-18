import type { CollectKey } from './hack'

describe('CollectKey', () => {
  test('should collect keys of the values of an object', () => {
    type Result = CollectKey<{ a: { b: { c: string } } }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: { $key: ['a'] } & { b: { c: string } } }>()
  })

  test('should collect keys of the values of an object with an existing $key property', () => {
    type Result = CollectKey<{ $key: ['root']; a: { b: { c: string } } }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: { $key: ['root', 'a'] } & { b: { c: string } } }>()
  })

  test('should not collect keys of non-object values', () => {
    type Result = CollectKey<{ a: string }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string }>()
  })
})
