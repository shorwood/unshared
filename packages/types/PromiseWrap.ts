/**
 * Wrap a type or the return type of `T` in a promise. If the type is already a
 * promise, the type is returned as-is.
 *
 * @template T The type to wrap.
 * @example
 * PromiseWrap<number> // Promise<number>
 * PromiseWrap<Promise<number>> // Promise<number>
 * PromiseWrap<() => number> // () => Promise<number>
 * PromiseWrap<() => Promise<number>> // () => Promise<number>
 */
export type PromiseWrap<T = unknown> =
  T extends Promise<unknown> ? T :
    T extends (...parameters: infer P) => infer U
      ? (...parameters: P) => U extends Promise<unknown> ? U
        : Promise<U>
      : Promise<T>
