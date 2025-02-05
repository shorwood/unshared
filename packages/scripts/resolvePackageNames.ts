import { readdir } from 'node:fs/promises'
import { resolve } from 'node:path'

/**
 * List all the packages in the `packages` directory from the root path.
 *
 * @param path The root path of the repository.
 * @returns The list of package names.
 */
export async function resolvePackageNames(path = process.cwd()): Promise<string[]> {
  const packagesPath = resolve(path, 'packages')
  const entities = await readdir(packagesPath, { withFileTypes: true })
  return entities
    .filter(entity => entity.isDirectory())
    .map(entity => entity.name)
}
