import type { Primitive } from './Primitive'

describe('Primitive', () => {
  test('should match a primitive type', () => {
    expectTypeOf<Primitive>().toEqualTypeOf<bigint | boolean | null | number | string | symbol | undefined>()
  })
})
