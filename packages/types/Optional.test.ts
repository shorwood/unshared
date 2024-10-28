import type { Optional } from './Optional'

describe('Optional', () => {
  test('should make all properties of T optionally `undefined`', () => {
    type Result = Optional<{ a: string; b: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string | undefined; b: number | undefined }>()
  })

  test('should make partial properties of T optionally `undefined`', () => {
    type Result = Optional<{ a?: string; b: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a?: string; b: number | undefined }>()
  })

  test('should make only some properties of T optionally `undefined`', () => {
    type Result = Optional<{ a: string; b: number }, 'a'>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string | undefined; b: number }>()
  })

  test('should make no properties of T optionally `undefined`', () => {
    type Result = Optional<{ a: string; b: number }, never>
    expectTypeOf<Result>().toEqualTypeOf<{ a: string; b: number }>()
  })
})
