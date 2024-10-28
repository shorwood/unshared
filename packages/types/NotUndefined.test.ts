import type { NotUndefined } from './NotUndefined'

describe('NotUndefined', () => {
  test('should exclude undefined', () => {
    type Result = NotUndefined<number | undefined>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should match non-undefined', () => {
    expectTypeOf<number>().toMatchTypeOf<NotUndefined>()
  })

  test('should not match undefined', () => {
    expectTypeOf<undefined>().not.toMatchTypeOf<NotUndefined>()
  })
})
