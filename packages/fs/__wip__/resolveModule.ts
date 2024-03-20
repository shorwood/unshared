import { access } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { cwd } from 'node:process'
import { findAncestors } from '../findAncestors'

/**
 * Resolve the path of a node module relative to a base path.
 *
 * @param moduleName The name of the module.
 * @param from The base path.
 * @throws If the module was not found.
 * @returns If the module was found, returns it's absolute path.
 */
export async function resolveModule(moduleName: string, from = cwd()): Promise<string> {
  const packageJsons = await findAncestors('package.json', from)
  const packageDirectories = packageJsons.map(dirname)

  // --- Find the first directory that contains the module.
  for (const directory of packageDirectories) {
    const modulePath = resolve(directory, 'node_modules', moduleName)
    try {
      await access(modulePath)
      return modulePath
    }
    catch {
      /** Ignore error. */
    }
  }

  // --- Throw if the module was not found.
  throw new Error(`Could not resolve node module "${moduleName}" from "${from}".`)
}
