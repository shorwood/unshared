/* oxlint-disable @typescript-eslint/no-empty-object-type */
/* oxlint-disable @typescript-eslint/no-unused-vars */
import type { ConstructorStatics } from './ConstructorStatics'

describe('ConstructorStatics', () => {
  test('should extract static properties from a class', () => {
    class Foo { static readonly a = 1 as const }
    type Result = ConstructorStatics<typeof Foo>
    expectTypeOf<Result>().toEqualTypeOf<{ a: 1 }>()
  })

  test('should not extract instance properties', () => {
    class Foo { static readonly a = 1 as const; b = 1 as const }
    type Result = ConstructorStatics<typeof Foo>
    expectTypeOf<Result>().toEqualTypeOf<{ a: 1 }>()
  })

  test('should return an empty object for a class with no static properties', () => {
    class Foo { b = 1 }
    type Result = ConstructorStatics<typeof Foo>
    expectTypeOf<Result>().toEqualTypeOf<{}>()
  })
})
