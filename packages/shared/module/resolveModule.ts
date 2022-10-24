import { cwd } from 'node:process'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { resolveAncestors } from './resolveAncestors'

/**
 * Resolve the path of a node module relative to a base path.
 * @param moduleName The name of the module.
 * @param from The base path.
 * @throws If the module was not found.
 * @returns If the module was found, returns it's absolute path.
 */
export const resolveModule = (moduleName: string, from: string = cwd()): string => {
  // --- Find all parent package directories.
  const packageDirectories = resolveAncestors('package.json', from).map(dirname)

  // --- Find the first directory that contains the module.
  for (const directory of packageDirectories) {
    const modulePath = resolve(directory, 'node_modules', moduleName)
    if (existsSync(modulePath)) return modulePath
  }

  // --- Throw if the module was not found.
  throw new Error(`Could not resolve node module "${moduleName}" out of "${from}".`)
}
