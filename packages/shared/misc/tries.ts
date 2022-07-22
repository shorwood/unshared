/* eslint-disable unicorn/prevent-abbreviations */

/**
 * Try multiple functions and return the first one that does not throw.
 * @param {...Function[]} functions The functions to try.
 * @returns {any | undefined} The first function that is not undefined.
 * @example
 * const noop = () => {}
 * const returns = () => 'Returns'
 * const throws = () => { throw new Error('Throws') }
 * tries(throws, returns) // returns 'Returns'
 * tries(throws, noop, returns) // returns undefined
 */
export const tries = <T>(...functions: Array<() => T>): T | undefined => {
  for (const fn of functions) {
    try { return fn() }
    catch {}
  }
}
