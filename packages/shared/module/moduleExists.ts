/**
 * Determines if a module exists safely.
 * @param {string} moduleId The module ID
 * @returns {boolean} Whether or not the module exists
 */
export const moduleExists = (moduleId: string): boolean => {
  try { require(moduleId); return true }
  catch { return false }
}
