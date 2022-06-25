/**
 * Requires a module, but doesn't throw an error if it fails.
 * @param {string} moduleId The id of the module to require
 * @returns {T} The required module, or undefined if it couldn't be required
 */
// @ts-expect-error: behavior wanted.
export const requireSafe = <T = any>(moduleId: string): T => {
  try { return require(moduleId) }
  catch {}
}
