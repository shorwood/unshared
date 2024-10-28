/**
 * A function that asserts a value is of a specific type `T`.
 *
 * @template T The type to assert the value is.
 * @example Assertor<string> = (value: unknown) => asserts value is string
 */
export type Assertor<T, P extends any[] = any[]> = (value: unknown, ...args: P) => asserts value is T
