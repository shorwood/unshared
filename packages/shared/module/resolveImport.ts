import { cwd } from 'node:process'
import { resolve } from 'node:path'
import { createRequire } from 'node:module'
import { tries } from '../misc/tries'

/**
 * Resolve the absolute path of a relative or package module.
 * @param path The import path.
 * @param from The base path.
 * @returns If the import was found, returns it's absolute path.
 * @throws If the import was not found.
 */
export const resolveImport = (path: string, from: string = cwd()): string => {
  if (!path) throw new Error('Missing import path.')

  // --- Create the `require` function.
  const require = createRequire(from)

  // --- Try to resolve import's absolute path.
  // --- If the path is a package import.
  // --- If the path is a relative import.
  const resolvedPath = tries(
    () => require.resolve(path, { paths: [from] }),
    () => require.resolve(resolve(from, path)),
  )

  // --- Throw if the import was not found.
  if (!resolvedPath) throw new Error(`Could not resolve import "${path}" from "${from}".`)

  // --- Return the absolute path.
  return resolvedPath
}
