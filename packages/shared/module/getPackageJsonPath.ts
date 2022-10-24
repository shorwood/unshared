import { cwd } from 'node:process'
import { resolveAncestor } from './resolveAncestor'
import { resolveImport } from './resolveImport'

/**
 * Get the path of the `package.json` file from a context directory.
 * @param path
 * The path to start from. Can be a file, a directory or a package name.
 * Defaults to the current working directory.
 * @returns The path of the `package.json` file.
 */
export const getPackageJsonPath = (path: string = cwd()): string | undefined => {
  const absolutePath = resolveImport(path)

  // --- Try to find the `package.json` file.
  return resolveAncestor('package.json', absolutePath)
}
