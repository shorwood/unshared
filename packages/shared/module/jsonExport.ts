import { requireSafe } from './requireSafe'

/**
 * Exports an object to a JSON file.
 * @param {string} path The path to the file
 * @param {any} object The object to export
 */
export const jsonExport = (path: string, object: any) => {
  const fs = requireSafe('node:fs')
  if (fs) fs.writeFileSync(path, JSON.stringify(object, undefined, 2))
}
