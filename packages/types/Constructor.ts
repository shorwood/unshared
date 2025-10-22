/* oxlint-disable @typescript-eslint/no-empty-object-type */

/**
 * A constructor with parameters, instance properties and static properties. This is a type that
 * can be used to create a class with a specific constructor signature, instance properties and
 * static properties.
 *
 * @template P The constructor parameters.
 * @template R The instance properties.
 * @template S The static properties.
 * @returns A typed constructor.
 * @example
 * type P = [a: number, b: string] // Constructor parameters
 * type R = { a: number; b?: string } // Instance properties
 * type S = { c: number } // Static properties
 * type Foo = Constructor<P, R, S> // (new (a: number, b: string) => { a: number; b?: string }) & { c: number }
 */
export type Constructor<
  R extends object = {},
  P extends any[] = any[],
  S extends object = {},
> =
  keyof S extends never
    ? new (...parameters: P) => R
    : (new (...parameters: P) => R) & S
