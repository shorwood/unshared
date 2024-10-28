import type { Required } from './Required'

describe('Required', () => {
  test('should make all properties required', () => {
    type Actual = Required<{ a?: string; b?: string }>
    interface Expected { a: string; b: string }
    expectTypeOf<Actual>().toEqualTypeOf<Expected>()
  })

  test('should make some properties required', () => {
    type Actual = Required<{ a?: string; b?: string }, 'a'>
    interface Expected { a: string; b?: string }
    expectTypeOf<Actual>().toEqualTypeOf<Expected>()
  })
})
