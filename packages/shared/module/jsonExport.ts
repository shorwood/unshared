import { PathOrFileDescriptor } from 'node:fs'
import { requireSafe } from './requireSafe'

/**
 * Exports an object as a JSON file.
 * @param pathOrFd The path or file descriptor to the output file.
 * @param object The object to export.
 */
export const jsonExport = (pathOrFd: PathOrFileDescriptor, object: any) => {
  const fs = requireSafe('node:fs')
  if (fs) fs.writeFileSync(pathOrFd, JSON.stringify(object, undefined, 2))
}
