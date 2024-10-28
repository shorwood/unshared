/**
 * A function that returns a promise.
 *
 * @template T The type of the promise.
 * @example PromiseFactory<void> // () => Promise<void>
 */
export type PromiseFactory<T = unknown> = () => Promise<T>
