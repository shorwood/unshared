/**
 *
 * @param moduleId
 */
export const moduleExists = (moduleId: string): boolean => {
  try { require(moduleId); return true }
  catch { return false }
}
