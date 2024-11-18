import type { WriteableDeep } from './WriteableDeep'

describe('WriteableDeep', () => {
  test('should make all nested properties writeable', () => {
    type Result = WriteableDeep<{ readonly a: string; b: { readonly c: number } }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string; b: { c: number } }>()
  })

  test('should not affect non-object types', () => {
    type Result = WriteableDeep<string>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })

  test('should make array elements writeable', () => {
    type Result = WriteableDeep<ReadonlyArray<{ readonly a: string }>>
    expectTypeOf<Result>().toEqualTypeOf<Array<{ a: string }>>()
  })
})
