/**
 * Clean a class object by removing empty or disabled classes.
 *
 * @param classes The classes to clean.
 * @returns The cleaned classes.
 * @example cleanClasses({ '': true, 'text-blue': false, 'text-red': true }) // { 'text-red': true }
 */
export function cleanClasses(classes: Record<string, unknown>): Record<string, boolean> {
  const result: Record<string, boolean> = {}
  for (const key in classes) {
    if (key.trim() === '') continue
    if (key === 'undefined') continue
    if (classes[key] === false) continue
    result[key] = !!classes[key]
  }
  return result
}
