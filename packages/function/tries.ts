/* eslint-disable jsdoc/require-param */
/* eslint-disable jsdoc/check-param-names */

/**
 * Try multiple functions and return the first one that does not throw or is not undefined.
 *
 * @param functions The functions to try.
 * @returns The first stateful result. Returns `undefined` if all functions throw or return `undefined`.
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
    try {
      const fn = functions.shift()
      const result = fn?.()

      // --- If one of the functions returns a promise, recursively call `tries` until the promise is resolved.
      if (result instanceof Promise) {
        return result
          .then(value => value ?? tries(...functions))
          .catch(() => tries(...functions))
      }

      // --- If one of the functions returns a value, return it.
      if (result !== undefined) return result
    }
    catch { /* Ignore errors */ }
  }
}

/* c8 ignore next */
if (import.meta.vitest) {
  const noop = () => {}
  const noopAsync = async() => {}
  const throws = () => { throw new Error('Error') }
  const throwsAsync = async() => { throw new Error('Error') }
  const now = () => true
  const nowAsync = async() => true

  it('should return the first non-undefined result', () => {
    const result = tries(now, noop, throws)
    expect(result).toEqual(true)
  })

  it('should return undefined if all functions throw or return undefined', () => {
    const result = tries(throws, noop)
    expect(result).toEqual(undefined)
  })

  it('should return the first non-undefined result (async)', async() => {
    const result = await tries(noopAsync, throwsAsync, nowAsync)
    expect(result).toEqual(true)
  })

  it('should return undefined if all functions throw or return undefined (async)', async() => {
    const result = await tries(throwsAsync, noopAsync)
    expect(result).toEqual(undefined)
  })

  it('should return synchronous results before asynchronous results', async() => {
    const result = tries(now, nowAsync)
    expect(result).toEqual(true)
  })
}
