import { cwd } from 'node:process'
import { PackageJSON } from 'types-pkg-json'
import { jsonImport } from './jsonImport'
import { resolveAncestor } from './resolveAncestor'
import { resolveImport } from './resolveImport'

/**
 * Get the content of the `package.json` file from a context directory.
 * @param path
 * The path to start from. Can be a file, a directory or a package name.
 * Defaults to the current working directory.
 * @returns The content of the `package.json` file.
 */
export const getPackageJson = (path: string = cwd()): PackageJSON | undefined => {
  const absolutePath = resolveImport(path)

  // --- Try to find the `package.json` file.
  const packageJsonPath = resolveAncestor('package.json', absolutePath)
  if (!packageJsonPath) return undefined

  // --- Import and return the `package.json` as an object.
  return jsonImport<PackageJSON>(packageJsonPath)
}
