import { tries } from '@unshared-dev/function/tries'
import { requireSafe } from './requireSafe'

/**
 * Resolve the absolute path of a relative or package module.
 * @param path The import path.
 * @param from The base path.
 * @returns If the import was found, returns it's absolute path.
 * @throws If the import was not found.
 */
export const resolveImport = (path: string, from?: string): string => {
  const nodePath = requireSafe('node:path')
  const nodeProcess = requireSafe('node:process')

  // --- Check if native Node.js modules are available.
  if (!nodePath) throw new Error('Native Node.js module "path" is not available.')
  if (!nodeProcess) throw new Error('Native Node.js module "process" is not available.')
  if (!from) from = nodeProcess.cwd()

  // --- Try to resolve import's absolute path.
  // --- If the path is a package import.
  // --- If the path is a relative import.
  const resolvedPath = tries(
    // @ts-expect-error: `from` is defined.
    () => require.resolve(path, { paths: [from] }),
    // @ts-expect-error: `from` is defined.
    () => require.resolve(nodePath.resolve(from, path)),
  )

  // --- Throw if the import was not found.
  if (!resolvedPath) throw new Error(`Could not resolve import "${path}" from "${from}".`)

  // --- Return the absolute path.
  return resolvedPath
}
