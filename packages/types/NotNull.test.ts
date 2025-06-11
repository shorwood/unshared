import type { NotNull } from './NotNull'

describe('NotNull', () => {
  test('should exclude null', () => {
    type Result = NotNull<null | number>
    expectTypeOf<Result>().toEqualTypeOf<number>()
  })

  test('should match non-null', () => {
    expectTypeOf<number>().toExtend<NotNull>()
  })

  test('should equal to unknown when no generic is provided', () => {
    expectTypeOf<NotNull>().toEqualTypeOf<unknown>()
  })
})
