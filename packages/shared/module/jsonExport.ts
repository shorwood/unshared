import { requireSafe } from './requireSafe'

/**
 * Save object as JSON file.
 * @param path Path to file.
 * @param object Object to save.
 */
export const jsonExport = (path: string, object: JSON) => {
  const fs = requireSafe('node:fs')
  if (fs) fs.writeFileSync(path, JSON.stringify(object, undefined, 2))
}
