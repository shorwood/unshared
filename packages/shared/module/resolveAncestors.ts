import { cwd } from 'node:process'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

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
export const resolveAncestors = (fileName: string, from: string = cwd()): string[] => {
  const paths: string[] = []

  // --- Try to find the file in the current working directory or parent directories.
  while (from !== '/') {
    const filePath = resolve(from, fileName)
    if (existsSync(filePath))
      paths.push(filePath)
    from = dirname(from)
  }

  // --- If the file was not found, return undefined.
  return paths
}
