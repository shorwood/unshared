import { Stats } from 'node:fs'
import { Awaitable } from '@unshared/types/Awaitable'
import { sync as _glob } from 'fast-glob'
import { MaybeArray } from '@unshared/types'

export type GlobResult<T extends string | Stats> = Awaitable<AsyncGenerator<T>, T[]>

/**
 * A glob pattern or regular expression.
 */
export type GlobPattern = string | RegExp

export interface GlobOptions<T extends string | Stats> {
  /**
   * The current working directory. Used to determine the base path for the glob
   * pattern.
   *
   * @default process.cwd()
   */
  cwd?: string
  /**
   * Only return entries that matches the path of a file.
   *
   * @default false
   * @example glob('src/**', { onlyFiles: true }) // ['src/foo.ts', 'src/foo/bar.ts']
   */
  onlyFiles?: boolean
  /**
   * If `true` and the glob pattern will only match directories.
   *
   * @default false
   * @example glob('src/**', { onlyDirectories: true }) // ['src/foo', 'src/foo/bar']
   */
  onlyDirectories?: boolean
  /**
   * 

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
export async function glob<T>(pattern: MaybeArray<GlobPattern>, options: GlobOptions<T> = {}): GlobResult<T> {}
