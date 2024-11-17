import type { Pretty } from './Pretty'

/**
 * Make all nested `undefined` or `void` properties of T optional. This type is
 * similar to `Partial` but it only makes properties optional if they are
 * `undefined` or `void`. Meaning they non-`undefined` or non-`void` properties
 * will remain required.
 *
 * @template T The type to make optional
 * @returns A new type with all nested `undefined` or `void` properties of T optional
 * @example LooseDeep<{ a: { b: string | undefined, c: number } }> // { a: { b?: string, c: number } }
 */
export type LooseDeep<T> = Pretty<
  { [P in keyof T as undefined extends T[P] ? never : P]: T extends object ? LooseDeep<T[P]> : T[P]; } &
  { [P in keyof T as undefined extends T[P] ? P : never]?: T[P]; }
>
