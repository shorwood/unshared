import type { Loose } from './Loose'

/**
 * Make all or some properties in T required and non-nullable.
 * This utility is similar to the built-in `Required` utility in TypeScript
 * but allows specifying a subset of properties to be required
 * instead of requiring all properties.
 *
 * @template T The type to make some properties required.
 * @template K The subset of properties to make required.
 * @example Required<{ a?: string, b?: string }, 'a'> // { a: string, b?: string }
 */
export type Required<T, K extends keyof T = keyof T> =
  Loose<{ [P in Exclude<keyof T, K>]: T[P] } & { [P in K]-?: T[P] }>

/* v8 ignore start */
if (import.meta.vitest) {
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
}
