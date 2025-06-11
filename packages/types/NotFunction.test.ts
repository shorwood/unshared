import type { NotFunction } from './NotFunction'

describe('NotFunction', () => {
  test('should exclude functions', () => {
    type Result = NotFunction<(() => void) | object | string>
    expectTypeOf<Result>().toEqualTypeOf<object | string>()
  })

  test('should match a non-function', () => {
    expectTypeOf<object>().toExtend<NotFunction>()
  })

  test('should not match a function', () => {
    expectTypeOf<() => void>().not.toExtend<NotFunction>()
  })
})
