import { Pretty } from './Pretty'

/**
 * Make all `undefined` or `void` properties of T optional. This type is
 * similar to `Partial` but it only makes properties optional if they are
 * `undefined` or `void`. Meaning they non-`undefined` or non-`void` properties
 * will remain required.
 *
 * @template T The type to make optional
 * @returns A new type with all `undefined` or `void` properties of T optional
 * @example Loose<{ a: string | undefined, b: number }> // { a?: string, b: number }
 */
export type Loose<T> = Pretty<
  { [P in keyof T as undefined extends T[P] ? P : never]?: T[P]; } &
  { [P in keyof T as undefined extends T[P] ? never : P]: T[P]; }
>

/* v8 ignore next */
if (import.meta.vitest) {
  test('should make all `undefined` properties of T optional', () => {
    type Result = Loose<{ a: string | undefined; b: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a?: string; b: number }>()
  })

  test('should make all `void` properties of T optional', () => {
    type Result = Loose<{ a: string | void; b: number }>
    expectTypeOf<Result>().toEqualTypeOf<{ a?: string | void | undefined; b: number }>()
  })
}
