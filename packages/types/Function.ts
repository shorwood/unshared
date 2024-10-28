/**
 * A function that takes parameters and returns a value.
 *
 * @template U The type of the return value.
 * @template P The type of the parameters.
 * @template T The type of the `this` context.
 * @example Function<boolean, [number, string]> // (a: number, b: string) => boolean
 */
export type Function<U = any, P extends any[] = any[], T = void> =
  T extends void
    ? (...args: P) => U
    : (this: T, ...args: P) => U
