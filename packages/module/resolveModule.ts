import { resolveAncestors } from './resolveAncestors'

/**
 * Resolve the path of a node module relative to a base path.
 * @param moduleName The name of the module.
 * @param from The base path.
 * @throws If the module was not found.
 * @returns If the module was found, returns it's absolute path.
 */
export const resolveModule = async(moduleName: string, from?: string): Promise<string> => {
  const { cwd } = await import('node:process')
  const { access } = await import('node:fs/promises')
  const { resolve, dirname } = await import('node:path')
  if (!from) from = cwd()

  // --- Find all parent package directories.
  const packageJsons = await resolveAncestors('package.json', from)
  const packageDirectories = packageJsons.map(dirname)

  // --- Find the first directory that contains the module.
  for (const directory of packageDirectories) {
    const modulePath = resolve(directory, 'node_modules', moduleName)
    try { await access(modulePath); return modulePath }
    catch {}
  }

  // --- Throw if the module was not found.
  throw new Error(`Could not resolve node module "${moduleName}" from "${from}".`)
}
