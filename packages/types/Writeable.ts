/**
 * Make all properties in T writeable. This type reverses the effects of the
 * `readonly` modifier and is the opposite of the `Readonly` type. Keep in mind
 * that this does not affect nested properties.
 *
 * @template T The type to make writeable
 * @returns A new type with all properties in T writeable
 * @example Writeable<{ readonly a: string; b:{ readonly c: number } }> // { a: string; b: { readonly c: number } }
 */
export type Writeable<T> =
  T extends object
    ? T extends ReadonlyArray<infer U> ? U[]
      : { -readonly [P in keyof T]: T[P] }
    : T
