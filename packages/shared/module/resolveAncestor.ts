import { cwd } from 'node:process'
import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

/**
 * Find path of a file in the context directory or one of its ancestors.
 * @param fileName The file name to find.
 * @param from
 * The path to start exploring from.
 * Defaults to the current working directory.
 * @returns If the file was found, returns the absolute path.
 * @throws If the file was not found.
 * @example
 * resolveAncestor('.npmrc') // '/home/user/.npmrc'
 * resolveAncestor('package.json') // '/home/user/project/package.json'
 * resolveAncestor('tsconfig.json') // '/home/user/project/tsconfig.json'
 */
export const resolveAncestor = (fileName: string, from: string = cwd()): string => {
  // --- Try to find the file in the current working directory or parent directories.
  while (from !== '/') {
    const filePath = resolve(from, fileName)
    if (existsSync(filePath)) return filePath
    from = dirname(from)
  }

  // --- If the file was not found, return undefined.
  throw new Error(`Could not find "${fileName}" out of "${from}".`)
}
