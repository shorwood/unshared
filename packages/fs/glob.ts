import type { Awaitable } from '@unshared/functions/awaitable'
import type { MaybeArray } from '@unshared/types'
import type { Stats } from 'node:fs'
import { awaitable } from '@unshared/functions/awaitable'
import { createPattern } from '@unshared/string/createPattern'
import { readdir, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'

/**
 * An entry in the glob result iterator or array.
 */
export type GlobEntry = Stats | string

/**
 * The result of a glob operation. If `Stat` is `true` the result will be an
 * array of file stats. Otherwise the result will be an array of file paths.
 */
export type GlobResult<T extends boolean = boolean> = T extends true
  ? Awaitable<AsyncIterable<Stats>, Stats[]>
  : Awaitable<AsyncIterable<string>, string[]>

export interface GlobOptions<Stat extends boolean = boolean> {

  /**
   * The current working directory. Used to determine the base path for the glob
   * pattern.
   *
   * @default process.cwd()
   */
  cwd?: string

  /**
   * A list of patterns to exclude from the result.
   *
   * @default []
   */
  exclude?: MaybeArray<string>

  /**
   * Return the paths relative to the current working directory. Will be ignored
   * if `stats` is `true`.
   *
   * @default false
   */
  getRelative?: boolean

  /**
   * Return the file stats instead of the file path. Allowing you to filter-out
   * files based on their stats.
   *
   * @default false
   */
  getStats?: Stat

  /**
   * If `true` and the glob pattern will only match directories.
   *
   * @default false
   * @example glob('src/**', { onlyDirectories: true }) // ['src/foo', 'src/foo/bar']
   */
  onlyDirectories?: boolean

  /**
   * Only return entries that matches the path of a file.
   *
   * @default false
   * @example glob('src/**', { onlyFiles: true }) // ['src/foo.ts', 'src/foo/bar.ts']
   */
  onlyFiles?: boolean
}

/**
 * Find files matching a glob pattern.
 *
 * @param pattern The glob pattern.
 * @param options The glob options.
 * @returns An awaitable asyncronous iterator of file paths.
 * @example
 * const files = glob('src/*.ts')
 * for await (const file of files) { ... }
 */
export function glob(pattern: MaybeArray<string>, options?: GlobOptions<false>): GlobResult<false>
export function glob(pattern: MaybeArray<string>, options?: GlobOptions<true>): GlobResult<true>
export function glob<T extends boolean>(pattern: MaybeArray<string>, options?: GlobOptions<T>): GlobResult<T>
export function glob(pattern: MaybeArray<string>, options: GlobOptions = {}): GlobResult {
  const {
    cwd = process.cwd(),
    exclude = [],
    getRelative = false,
    getStats = false,
    onlyDirectories = false,
    onlyFiles = false,
  } = options

  // --- Convert the pattern to an array of RegExp.
  const patternArray = Array.isArray(pattern) ? pattern : [pattern]
  const patterns = patternArray.map(pattern => createPattern(pattern))
  const exludeArray = Array.isArray(exclude) ? exclude : [exclude]
  const excludePatterns = exludeArray.map(pattern => createPattern(pattern))

  // --- Create an iterator that will yield the matching paths.
  const searchPool: string[] = [cwd]
  async function * createIterator() {
    while (searchPool.length > 0) {
      const directory = searchPool.pop()!
      const entities = await readdir(directory, { withFileTypes: true }).catch(() => [])

      for (const entity of entities) {
        const pathAbsolute = join(directory, entity.name)
        const pathRelative = relative(cwd, pathAbsolute)
        const isFile = entity.isFile()
        const isDirectory = entity.isDirectory()

        // --- Add the directory to the list of directories to check.
        if (isDirectory) searchPool.push(pathAbsolute)

        // --- Filter-out the non-matching entries.
        if (onlyFiles && !isFile) continue
        if (onlyDirectories && !isDirectory) continue

        // --- Check if the path matches the pattern(s).
        const isMatch = patterns.some(pattern => pattern.test(pathRelative))
        if (!isMatch) continue

        // --- Check if the path matches the exclude pattern(s).
        const isExcluded = excludePatterns.some(pattern => pattern.test(pathRelative))
        if (isExcluded) continue

        // --- Return the result.
        let result: GlobEntry = pathAbsolute
        if (getStats) result = await stat(pathAbsolute)
        if (getRelative) result = `./${pathRelative}`
        yield result
      }
    }
  }

  // --- Instantiate the iterator.
  const iterator = createIterator()

  // --- Return the iterator or the result as an array.
  return awaitable(iterator) as GlobResult
}
