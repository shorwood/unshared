/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * Save object as JSON file.
 * @param path Path to file.
 * @param object Object to save.
 */
export const jsonExport = (path: string, object: JSON) => {
  require('node:fs').writeFileSync(path, JSON.stringify(object, undefined, 2))
}
