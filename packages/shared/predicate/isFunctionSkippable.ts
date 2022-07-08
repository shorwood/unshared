/* eslint-disable unicorn/prevent-abbreviations */

/**
 * Check if a function is skippable, meaning it is empty or returns undefined.
 * @param {Function} fn The function to check
 * @returns {boolean} `true` if the function is skippable, `false` otherwise
 * @example
 * isFunctionSkippable(() => {}) // true
 * isFunctionSkippable(() => null) // false
 * isFunctionSkippable(() => undefined) // true
 */
export const isFunctionSkippable = (fn: Function): fn is () => {} => {
  // --- Make sure it is a function
  if (typeof fn !== 'function') return false

  // --- Get function body
  const fnString = fn.toString()

  // --- Check if function is empty
  return /^\s*(function)?\s*(\w*?)\(.*?\)\s*(=>)?\s*{?\s*(return)?\s*(void 0)?;?\s*}?\s*$/.test(fnString)
}
