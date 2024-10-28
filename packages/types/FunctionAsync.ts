/**
 * A FunctionAsync that takes parameters and returns a promise.
 *
 * @template U The type of the value returned by the promise.
 * @template P The type of the parameters.
 * @template T The type of the `this` context.
 * @example FunctionAsync<boolean, [a: number, b: string]> // (a: number, b: string) => boolean
 */
export type FunctionAsync<U = any, P extends any[] = any[], T = void> =
  T extends void
    ? (...args: P) => Promise<U>
    : (this: T, ...args: P) => Promise<U>
