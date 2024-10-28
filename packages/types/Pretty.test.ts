import type { Pretty } from './Pretty'

describe('Pretty', () => {
  type UppercaseKeys<T> = {
    [K in keyof T as Uppercase<K & string>]:
    T[K] extends string ? Uppercase<T[K]>
      : T[K] extends Record<PropertyKey, unknown> ? UppercaseKeys<T[K]>
        : T[K]
  }

  test('should return the same type as the input', () => {
    type Input = UppercaseKeys<{ name: 'JOHN'; flags: { isAdmin: true } }>
    type Output = Pretty<Input>
    expectTypeOf<Output>().toEqualTypeOf<Input>()
  })

  test('should not unwrap function types', () => {
    type Input = UppercaseKeys<{ fn: { value: (value: string) => void } }>
    type Output = Pretty<Input>
    expectTypeOf<Output>().toEqualTypeOf<Input>()
  })
})
