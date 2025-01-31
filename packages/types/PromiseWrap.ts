/**
 * Wrap a type or the return type of `T` in a promise. If the type is already a
 * promise, the type is returned as-is. This is useful for dynamically wrapping
 * a function, a value, or a promise without inadvertedly nesting promises.
 *
 * @template T The type to wrap.
 * @example
 * // Wrap a type in a promise.
 * PromiseWrap<number> // Promise<number>
 *
 * // Keep a promise as-is.
 * PromiseWrap<Promise<number>> // Promise<number>
 *
 * // Wrap the return type of a function in a promise.
 * PromiseWrap<() => number> // () => Promise<number>
 *
 * // Extract the return type of an async function as-is.
 * PromiseWrap<() => Promise<number>> // () => Promise<number>
 */
export type PromiseWrap<T = unknown> =
  T extends Promise<unknown> ? T :
    T extends (...parameters: infer P) => infer U
      ? (...parameters: P) => U extends Promise<unknown> ? U
        : Promise<U>
      : Promise<T>
