/**
 * Get the parameters of a constructor function type in a tuple.
 *
 * @template T The constructor function type.
 * @returns The parameters of the constructor function type.
 * @example
 * class Foo { constructor(a: number, b: string) {} }
 * type Result = ConstructorParameters<typeof Foo> // [number, string]
 */
export type ConstructorParameters<T extends abstract new (...args: any[]) => unknown> =
  T extends abstract new (...args: infer P) => unknown ? P : never
