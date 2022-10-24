/**
 * Determines if a module exists safely.
 * @param moduleId The module ID
 * @return Whether or not the module exists
 */
export const moduleExists = (moduleId: string): boolean => {
  try { require(moduleId); return true }
  catch { return false }
}
