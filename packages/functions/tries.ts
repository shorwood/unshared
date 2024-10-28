import type { Fallback, Function } from '@unshared/types'

/**
 * The result of trying multiple functions.
 *
 * @template F The functions to try.
 * @returns The first non-undefined result.
 * @example type Result = TriesResult<[() => string, () => number]> // string | number | undefined
 */
export type TriesResult<F extends Function[], IsPromise = false, Result extends unknown[] = []> =
  F extends [() => infer U, ...infer FNext extends Function[]]

    // --- Some functions might return `never` and may override the resulting type.
    // --- To avoid this, we fallback to `undefined` since thrown errors are caught and ignored.
    ? Fallback<U, void> extends (infer R)

      // --- If an async function was found before, wrap the next return types in a promise.
      ? R extends Promise<unknown>
        ? TriesResult<FNext, true, [...Result, R]>
        : TriesResult<FNext, IsPromise, [...Result, IsPromise extends true ? Promise<R>: R]>

      // --- Stop the recursion if no more functions are left.
      : TriesResult<[], IsPromise, Result>

    // --- At the end of the recursion, return the result as a union.
    // --- Also add `undefined` to represent the case where all functions have thrown.
    : Exclude<Result[number], void> | (IsPromise extends true ? Promise<void> : void)

/**
 * Try multiple functions and return the result of the first one that does not throw.
 * The functions are called in order until one successfully returns a value.
 *
 * @param functions The functions to try.
 * @returns A promise that resolves to the first non-undefined result.
 * @example tries(throws, Date.now) // 1658682347132
 */
export function tries<F extends Function[]>(...functions: F): TriesResult<F>
export function tries<T>(...functions: Function[]): T
export function tries(...functions: Function[]) {
  for (const element of functions) {
    const fn = element as () => unknown
    try {
      const result = fn()
      if (result instanceof Promise === false) return result

      // --- If the result is a promise, wait for it to resolve.
      // --- If an error occurs, try the next function but return
      // --- wrapped in a promise to keep the result type consistent.
      return result.catch(() => tries(...functions.slice(1)))
    }
    catch { continue }
  }
}
