/**
 * Find path of a file in the context directory or one of its ancestors.
 * @param fileName The file name to find.
 * @param from
 * The absolute path to start from.
 * Defaults to the current working directory.
 * @returns If the file was found, returns the absolute path.
 * @throws If the file was not found.
 * @example
 * resolveAncestor('.npmrc') // '/home/user/.npmrc'
 * resolveAncestor('package.json') // '/home/user/project/package.json'
 * resolveAncestor('tsconfig.json') // '/home/user/project/tsconfig.json'
 */
export const resolveAncestor = async(fileName: string, from: string): Promise<string> => {
  const { constants } = await import('node:fs')
  const { access } = await import('node:fs/promises')
  const { dirname, resolve } = await import('node:path')

  // --- Try to find the file in the current working directory or parent directories.
  while (from !== '/') {
    const filePath = resolve(from, fileName)
    try { await access(filePath, constants.F_OK); return filePath }
    catch {}
    from = dirname(from)
  }

  // --- If the file was not found, return undefined.
  throw new Error(`Could not find "${fileName}" out of "${from}".`)
}
