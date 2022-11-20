/* eslint-disable unicorn/prevent-abbreviations */

/**
 * Try multiple functions and return the first one that does not throw or is not undefined.
 * @param functions The functions to try.
 * @return The first stateful result. Returns `undefined` if all functions throw or return `undefined`.
 * @example
 * const noop = () => {}
 * const throws = () => { throw new Error }
 * tries(throws, noop, Date.now) // returns 1658682347132
 */
export function tries<R1, R2>(fn1: () => R1, fn2: () => R2): R1 | R2 | undefined
export function tries<R1, R2, R3>(fn1: () => R1, fn2: () => R2, fn3: () => R3): R1 | R2 | R3 | undefined
export function tries<R1, R2, R3, R4>(fn1: () => R1, fn2: () => R2, fn3: () => R3, fn4: () => R4): R1 | R2 | R3 | R4 | undefined
export function tries<R1, R2, R3, R4, R5>(fn1: () => R1, fn2: () => R2, fn3: () => R3, fn4: () => R4, fn5: () => R5): R1 | R2 | R3 | R4 | R5 | undefined
export function tries<R1, R2, R3, R4, R5, R6>(fn1: () => R1, fn2: () => R2, fn3: () => R3, fn4: () => R4, fn5: () => R5, fn6: () => R6): R1 | R2 | R3 | R4 | R5 | R6 | undefined
export function tries<R>(...functions: Array<() => R>): R | undefined
export function tries(...functions: Array<() => unknown>): unknown {
  // --- Execute each function until one returns a value.
  while (functions.length > 0) {
    const result = functions.shift()?.()

    // --- If one of the functions returns a promise
    // --- Recursively call `tries` until the promise is resolved.
    if (result instanceof Promise) {
      return result
        .then(value => value ?? tries(...functions))
        .catch(() => tries(...functions))
    }

    // --- If one of the functions returns a value, return it.
    if (result !== undefined) return result
  }
}
