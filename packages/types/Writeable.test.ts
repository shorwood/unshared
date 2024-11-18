import type { Writeable } from './Writeable'

describe('Writeable', () => {
  test('should make all properties writeable', () => {
    type Result = Writeable<{ readonly a: string }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string }>()
  })

  test('should not make nested properties writeable', () => {
    type Result = Writeable<{ a: { readonly b: string } }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: { readonly b: string } }>()
  })

  test('should not affect non-object types', () => {
    type Result = Writeable<string>
    expectTypeOf<Result>().toEqualTypeOf<string>()
  })

  test('should make array elements writeable', () => {
    type Result = Writeable<ReadonlyArray<{ readonly a: string }>>
    expectTypeOf<Result>().toEqualTypeOf<Array<{ readonly a: string }>>()
  })
})
