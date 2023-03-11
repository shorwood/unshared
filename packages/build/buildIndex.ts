import { readdir } from 'node:fs/promises'
import { cwd } from 'node:process'
import { vol } from 'memfs'

/**
 * Generates an index file from all the TypeScript files in a directory.
 *
 * @param path The directory to generate the index file for.
 * @returns The generated index file.
 * @example
 * const index = await buildIndex('/foo')
 * await writeFile('/foo/index.ts', index)
 *
 * // /foo/index.ts
 * export * from './bar'
 * export * from './baz'
 * export * from './qux'
 */
export async function buildIndex(path: string = cwd()): Promise<string> {
  if (typeof path !== 'string')
    throw new TypeError('Expected the path to be a string')

  // --- Read the directory.
  const directoryEntities = await readdir(path, { withFileTypes: true })

  // --- Filter out all non-script files.
  const directoryScripts = directoryEntities
    .filter(entity => entity.isFile())
    .map(entity => entity.name)
    .filter(name => /\.[jt]sx?$/.test(name))

  // --- Build the index file.
  const indexContent = directoryScripts
    .map(script => script.replace(/\.ts$/, ''))
    .map(script => `export * from './${script}'`)
    .join('\n')

  // --- Return the index file.
  return `${indexContent}\n`
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should build an index file from a directory', async() => {
    vol.fromJSON({
      '/foo/bar.ts': '',
      '/foo/baz.ts': '',
      '/foo/qux.ts': '',
    })
    const result = await buildIndex('/foo')
    const expected = 'export * from \'./bar\'\nexport * from \'./baz\'\n'
    expect(result).toEqual(expected)
  })

  it('should build an index file ignoring non-TypeScript files', async() => {
    vol.fromJSON({
      '/foo/bar.ts': '',
      '/foo/baz.js': '',
      '/foo/qux.js': '',
    })
    const result = await buildIndex('/foo')
    const expected = 'export * from \'./bar\'\n'
    expect(result).toEqual(expected)
  })

  it('should throw an error if the path is not a string', async() => {
    // @ts-expect-error: invalid type
    const shouldThrow = () => buildIndex(0)
    expect(shouldThrow).toThrowError(TypeError)
  })

  it('should throw an error if the path is not a directory', async() => {
    vol.fromJSON({ '/foo': '' })
    const shouldThrow = () => buildIndex('/foo')
    expect(shouldThrow).toThrowError(Error)
  })
}
