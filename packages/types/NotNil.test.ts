import type { NotNil } from './NotNil'

describe('NotNil', () => {
  test('should exclude null', () => {
    type Result = NotNil<null | number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should exclude undefined', () => {
    type Result = NotNil<number | undefined>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should exclude void', () => {
    type Result = NotNil<number | void>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should exclude null, undefined and void', () => {
    type Result = NotNil<null | number | undefined | void>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should match non-null, non-undefined and non-void', () => {
    expectTypeOf<number>().toExtend<NotNil>()
  })

  test('should equal to unknown when no generic is provided', () => {
    expectTypeOf<NotNil>().toEqualTypeOf<unknown>()
  })
})
