/* eslint-disable sonarjs/cognitive-complexity */
import { Stats } from 'node:fs'
import { readdir, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { cwd as getCwd } from 'node:process'
import { awaitable, Awaitable } from '@unshared/functions/awaitable'
import { createPattern } from '@unshared/string/createPattern'
import { toArray } from '@unshared/collection/toArray'
import { MaybeArray } from '@unshared/types'
import { vol } from 'memfs'

/**
 * An entry in the glob result iterator or array.
 */
export type GlobEntry = Stats | string

/**
 * The result of a glob operation. If `Stat` is `true` the result will be an
 * array of file stats. Otherwise the result will be an array of file paths.
 */
export type GlobResult<T extends boolean> = T extends true
  ? Awaitable<AsyncIterable<Stats>, Stats[]>
  : Awaitable<AsyncIterable<string>, string[]>

export interface GlobOptions<Stat extends boolean> {
  /**
   * The current working directory. Used to determine the base path for the glob
   * pattern.
   *
   * @default process.cwd()
   */
  cwd?: string
  /**
   * Return the file stats instead of the file path. Allowing you to filter-out
   * files based on their stats.
   *
   * @default false
   */
  getStats?: Stat
  /**
   * Return the paths relative to the current working directory. Will be ignored
   * if `stats` is `true`.
   *
   * @default false
   */
  getRelative?: boolean
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
export function glob<Stat extends boolean = false>(pattern: MaybeArray<string>, options: GlobOptions<Stat> = {}): GlobResult<Stat> {
  const {
    cwd = getCwd(),
    getStats = false,
    getRelative = false,
    onlyFiles = false,
    onlyDirectories = false,
  } = options

  // --- Convert the pattern to an array of RegExp.
  const patterns = toArray(pattern).map(createPattern)

  // --- Create an iterator that will yield the matching paths.
  const searchPool: string[] = [cwd]
  async function* createIterator() {
    while (searchPool.length > 0) {
      const directory = searchPool.shift()!
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

        // --- Return the result.
        let result: GlobEntry = pathAbsolute
        if (getRelative) result = `./${pathRelative}`
        if (getStats) result = await stat(pathAbsolute)
        yield result
      }
    }
  }

  // --- Instantiate the iterator.
  const iterator = createIterator()

  // --- Return the iterator or the result as an array.
  return awaitable(iterator) as GlobResult<Stat>
}

/** c8 ignore next */
if (import.meta.vitest) {
  beforeEach(() => {
    vol.fromJSON({
      '/project/foo.ts': '',
      '/project/bar.ts': '',
      '/project/baz.ts': '',
      '/project/README.md': '',
      '/project/dist/foo.js': '',
      '/project/dist/bar.js': '',
      '/project/dist/baz.js': '',
      '/project/dist/docs/README.md': '',
      '/project/dist/docs/CHANGELOG.md': '',
    })
  })

  it('should find the absolute path matching a glob pattern', async() => {
    const files = await glob('*.ts', { cwd: '/project' })
    const expected = [
      '/project/bar.ts',
      '/project/baz.ts',
      '/project/foo.ts',
    ]
    expect(files).toEqual(expected)
  })

  it('should find the relative path matching a glob pattern', async() => {
    const files = await glob('*.ts', { cwd: '/project', getRelative: true })
    const expected = [
      './bar.ts',
      './baz.ts',
      './foo.ts',
    ]
    expect(files).toEqual(expected)
  })

  it('should find the stats matching a glob pattern', async() => {
    const files = await glob('*.ts', { cwd: '/project', getStats: true })
    const expected = [
      vol.statSync('/project/foo.ts'),
      vol.statSync('/project/bar.ts'),
      vol.statSync('/project/baz.ts'),
    ]
    expect(files.map(x => x.uid)).toEqual(expected.map(x => x.uid))
  })

  it('should find the paths matching an exclude pattern', async() => {
    const files = await glob(['*.ts', '!bar.ts'], { cwd: '/project' })
    const expected = [
      '/project/baz.ts',
      '/project/foo.ts',
    ]
    expect(files).toEqual(expected)
  })

  it('should find only files at the root', async() => {
    const files = await glob('*', { cwd: '/project', onlyFiles: true })
    const expected = [
      '/project/README.md',
      '/project/bar.ts',
      '/project/baz.ts',
      '/project/foo.ts',
    ]
    expect(files).toEqual(expected)
  })

  it('should find only directories at the root', async() => {
    const files = await glob('*', { cwd: '/project', onlyDirectories: true })
    const expected = [
      '/project/dist',
    ]
    expect(files).toEqual(expected)
  })
}
