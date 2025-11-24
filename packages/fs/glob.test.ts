/* eslint-disable n/no-extraneous-import */
import type { Awaitable } from '@unshared/functions'
import type { Stats } from 'node:fs'
import { vol } from 'memfs'
import { glob } from './glob'

describe('glob', () => {
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
})
