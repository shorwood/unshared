/**
 * Predicator function that returns `true` when the given value
 * is of the specified type.
 *
 * @template T The type to check for.
 * @example Predicator<string> // (value: unknown, ...args: any[]) => value is string
 */
export type Predicator<T = unknown> = (value: any, ...args: any[]) => value is T
