import { Awaitable, awaitable } from '@unshared/functions/awaitable'
import { createPattern } from '@unshared/string/createPattern'
import { MaybeArray } from '@unshared/types'
import { Stats } from 'node:fs'
import { readdir, stat } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { cwd as getCwd } from 'node:process'

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
  /**
   * A list of patterns to exclude from the result.
   *
   * @default []
   */
  exclude?: MaybeArray<string>
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
    getStats = false,
    getRelative = false,
    onlyFiles = false,
    onlyDirectories = false,
    exclude = [],
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
        if (getRelative) result = `./${pathRelative}`
        if (getStats) result = await stat(pathAbsolute)
        yield result
      }
    }
  }

  // --- Instantiate the iterator.
  const iterator = createIterator()

  // --- Return the iterator or the result as an array.
  return awaitable(iterator) as GlobResult
}

/** c8 ignore next */
if (import.meta.vitest) {
  // eslint-disable-next-line n/no-extraneous-import
  const { vol } = await import('memfs')

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

  it('should yield the paths matching a glob pattern', async() => {
    const files = glob('*.ts', { cwd: '/project' })
    const result = []
    for await (const file of files) result.push(file)
    expect(result).toEqual([
      '/project/bar.ts',
      '/project/baz.ts',
      '/project/foo.ts',
    ])
  })

  it('should find the absolute path matching a glob pattern', async() => {
    const files = await glob('*.ts', { cwd: '/project' })
    expect(files).toEqual([
      '/project/bar.ts',
      '/project/baz.ts',
      '/project/foo.ts',
    ])
  })

  it('should find the relative path matching a glob pattern', async() => {
    const files = await glob('*.ts', { cwd: '/project', getRelative: true })
    expect(files).toEqual([
      './bar.ts',
      './baz.ts',
      './foo.ts',
    ])
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
    const files = await glob('*.ts', { cwd: '/project', exclude: 'baz.ts' })
    const expected = [
      '/project/bar.ts',
      '/project/foo.ts',
    ]
    expect(files).toEqual(expected)
  })

  it('should find nested and non-nested files', async() => {
    const files = await glob('**/*', { cwd: '/project', onlyFiles: true })
    expect(files).toEqual([
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

  it('should find nested and non-nested directories', async() => {
    const files = await glob('**/*', { cwd: '/project', onlyDirectories: true })
    expect(files).toEqual([
      '/project/dist',
      '/project/dist/docs',
    ])
  })

  it('should find files but exclude the dist directory', async() => {
    const files = await glob('*', { cwd: '/project', exclude: 'dist/**' })
    expect(files).toEqual([
      '/project/README.md',
      '/project/bar.ts',
      '/project/baz.ts',
      '/project/foo.ts',
    ])
  })

  it('should infer the return type as a collection of `Stats`', () => {
    const files = glob('*.ts', { cwd: '/project', getStats: true })
    expectTypeOf(files).toEqualTypeOf<Awaitable<AsyncIterable<Stats>, Stats[]>>()
  })

  it('should infer the return type as a collection of `string`', () => {
    const files = glob('*.ts', { cwd: '/project', getStats: false })
    expectTypeOf(files).toEqualTypeOf<Awaitable<AsyncIterable<string>, string[]>>()
  })

  it('should infer the return type as a collection of `Stats` or `string`', () => {
    const files = glob('*.ts', { cwd: '/project', getStats: true as boolean })
    expectTypeOf(files).toEqualTypeOf<Awaitable<AsyncIterable<Stats>, Stats[]> | Awaitable<AsyncIterable<string>, string[]>>()
  })
}
