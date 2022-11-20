/**
 * Find paths of files in the context directory or one of its ancestors.
 * @param fileName The file name to find.
 * @param from The path to start from.
 * @returns The absolute paths of the files found.
 * @example
 * resolveAncestors('.npmrc') // ['/home/user/project/.npmrc', '/home/user/.npmrc']
 * resolveAncestors('package.json') // ['/home/user/project/package.json']
 * resolveAncestors('tsconfig.json') // ['/home/user/project/tsconfig.json']
 */
export const resolveAncestors = async(fileName: string, from: string): Promise<string[]> => {
  const { constants } = await import('node:fs')
  const { access } = await import('node:fs/promises')
  const { resolve, dirname } = await import('node:path')

  // --- Initialize variables.
  const paths: string[] = []
  let lastFrom = from

  // --- Try to find the file in the current working directory or parent directories.
  do {
    const filePath = resolve(from, fileName)
    try {
      await access(filePath, constants.F_OK)
      paths.push(filePath)
    }
    catch {}
    lastFrom = from
    from = dirname(from)
  } while (from !== lastFrom)

  // --- Return the paths.
  return paths
}
