import { cwd } from 'node:process'
import { realpath } from 'node:fs/promises'
import { resolveAncestor } from './resolveAncestor'

/**
 * Get the path of the `package.json` file from a context directory.
 * @param from
 * The path to start from. Can be a file, a directory or a package name.
 * Defaults to the current working directory.
 * @returns The path of the `package.json` file.
 */
export const getTsConfigPath = async(from: string = cwd()): Promise<string> => {
  const absolutePath = await realpath(from)
  return resolveAncestor('tsconfig.json', absolutePath)
}
