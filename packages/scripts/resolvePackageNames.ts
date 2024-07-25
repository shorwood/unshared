import { cwd as getCwd } from 'node:process'
import { resolve } from 'node:path'
import { readdir } from 'node:fs/promises'

/**
 * List all the packages in the `packages` directory from the root path.
 *
 * @param path The root path of the repository.
 * @returns The list of package names.
 */
export async function resolvePackageNames(path = getCwd()) {
  const packagesPath = resolve(path, 'packages')
  return await readdir(packagesPath)
}
