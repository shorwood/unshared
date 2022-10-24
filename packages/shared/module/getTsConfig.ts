import { cwd } from 'node:process'
import { TSConfigJSON } from 'types-tsconfig'
import { jsonImport } from './jsonImport'
import { resolveAncestor } from './resolveAncestor'
import { resolveImport } from './resolveImport'

/**
 * Get the content of the `tsconfig.json` file from a context directory.
 * @param path
 * The path to start from. Can be a file, a directory or a package name.
 * Defaults to the current working directory.
 * @returns The content of the `tsconfig.json` file.
 */
export const getTsConfig = (path: string = cwd()): TSConfigJSON | undefined => {
  const absolutePath = resolveImport(path)

  // --- Try to find the `tsconfig.json` file.
  const tsConfigPath = resolveAncestor('tsconfig.json', absolutePath)
  if (!tsConfigPath) return undefined

  // --- Import and return the `tsconfig.json` as an object.
  return jsonImport<TSConfigJSON>(tsConfigPath)
}
