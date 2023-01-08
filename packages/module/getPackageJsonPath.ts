import { resolve } from 'node:path'
import { resolveAncestor } from './resolveAncestor'

/**
 * Get the path of the `package.json` file from a context directory.
 * @param from The path to start from. Can be a file, a directory or a package name.
 * @returns The path of the `package.json` file.
 */
export const getPackageJsonPath = async(...from: string[]): Promise<string> => {
  const fromResolved = resolve(...from)
  return resolveAncestor('package.json', fromResolved)
}
