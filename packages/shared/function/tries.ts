/**
 * Try multiple functions and return the first one that does not throw or is not undefined.
 * @param functions The functions to try.
 * @return The first stateful result. Returns `undefined` if all functions throw or return `undefined`.
 * @example
 * const noop = () => {}
 * const throws = () => { throw new Error }
 * tries(throws, noop, Date.now) // returns 1658682347132
 */
export const tries = <T>(...functions: Array<() => T>): T | undefined => {
  // --- Try the functions
  for (const _function of functions) {
    try {
      const result = _function()
      if (result !== undefined) return result
    }

    // --- Ignore errors
    catch {}
  }
}
