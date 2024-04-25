import { cwd as getCwd } from 'node:process'
import { join, relative } from 'node:path'
import { readdir, stat } from 'node:fs/promises'
import { Stats } from 'node:fs'
import { MaybeArray } from '@unshared/types'
import { createPattern } from '@unshared/string/createPattern'
import { Awaitable, awaitable } from '@unshared/functions/awaitable'

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
    cwd = getCwd(),
    exclude = [],
    getRelative = false,
    getStats = false,
    onlyDirectories = false,
    onlyFiles = false,
  } = options

  // --- Convert the pattern to an array of RegExp.
  const patternArray = Array.isArray(pattern) ? pattern : [pattern]
  const patterns = patternArray.map(createPattern)
  const exludeArray = Array.isArray(exclude) ? exclude : [exclude]
  const excludePatterns = exludeArray.map(createPattern)

  // --- Create an iterator that will yield the matching paths.
  const searchPool: string[] = [cwd]
  async function* createIterator() {
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

/* v8 ignore next */
if (import.meta.vitest) {
  const { vol } = await import('memfs')

  beforeEach(() => {
    vol.fromJSON({
      '/project/bar.ts': '',
      '/project/baz.ts': '',
      '/project/dist/bar.js': '',
      '/project/dist/baz.js': '',
      '/project/dist/docs/CHANGELOG.md': '',
      '/project/dist/docs/README.md': '',
      '/project/dist/foo.js': '',
      '/project/foo.ts': '',
      '/project/README.md': '',
    })
  })

  test('should yield the paths matching a glob pattern', async() => {
    const files = glob('*.ts', { cwd: '/project' })
    const result = []
    for await (const file of files) result.push(file)
    expect(result).toStrictEqual([
      '/project/bar.ts',
      '/project/baz.ts',
      '/project/foo.ts',
    ])
  })

  test('should find the absolute path matching a glob pattern', async() => {
    const files = await glob('*.ts', { cwd: '/project' })
    expect(files).toStrictEqual([
      '/project/bar.ts',
      '/project/baz.ts',
      '/project/foo.ts',
    ])
  })

  test('should find the relative path matching a glob pattern', async() => {
    const files = await glob('*.ts', { cwd: '/project', getRelative: true })
    expect(files).toStrictEqual([
      './bar.ts',
      './baz.ts',
      './foo.ts',
    ])
  })

  test('should find the stats matching a glob pattern', async() => {
    const files = await glob('*.ts', { cwd: '/project', getStats: true })
    const expected = [
      vol.statSync('/project/foo.ts'),
      vol.statSync('/project/bar.ts'),
      vol.statSync('/project/baz.ts'),
    ]
    expect(files.map(x => x.uid)).toStrictEqual(expected.map(x => x.uid))
  })

  test('should find the paths matching an exclude pattern', async() => {
    const files = await glob('*.ts', { cwd: '/project', exclude: 'baz.ts' })
    const expected = [
      '/project/bar.ts',
      '/project/foo.ts',
    ]
    expect(files).toStrictEqual(expected)
  })

  test('should find nested and non-nested files', async() => {
    const files = await glob('**/*', { cwd: '/project', onlyFiles: true })
    expect(files).toStrictEqual([
      '/project/README.md',
      '/project/bar.ts',
      '/project/baz.ts',
      '/project/foo.ts',
      '/project/dist/bar.js',
      '/project/dist/baz.js',
      '/project/dist/foo.js',
      '/project/dist/docs/CHANGELOG.md',
      '/project/dist/docs/README.md',
    ])
  })

  test('should find nested and non-nested directories', async() => {
    const files = await glob('**/*', { cwd: '/project', onlyDirectories: true })
    expect(files).toStrictEqual([
      '/project/dist',
      '/project/dist/docs',
    ])
  })

  test('should find files but exclude the dist directory', async() => {
    const files = await glob('*', { cwd: '/project', exclude: 'dist/**' })
    expect(files).toStrictEqual([
      '/project/README.md',
      '/project/bar.ts',
      '/project/baz.ts',
      '/project/foo.ts',
    ])
  })

  test('should infer the return type as a collection of `Stats`', () => {
    const files = glob('*.ts', { cwd: '/project', getStats: true })
    expectTypeOf(files).toEqualTypeOf<Awaitable<AsyncIterable<Stats>, Stats[]>>()
  })

  test('should infer the return type as a collection of `string`', () => {
    const files = glob('*.ts', { cwd: '/project', getStats: false })
    expectTypeOf(files).toEqualTypeOf<Awaitable<AsyncIterable<string>, string[]>>()
  })

  test('should infer the return type as a collection of `Stats` or `string`', () => {
    const files = glob('*.ts', { cwd: '/project', getStats: true as boolean })
    expectTypeOf(files).toEqualTypeOf<Awaitable<AsyncIterable<Stats>, Stats[]> | Awaitable<AsyncIterable<string>, string[]>>()
  })
}
