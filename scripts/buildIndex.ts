/* eslint-disable sonarjs/no-duplicate-string */
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { patternMatch } from '@unshared/string'

export interface BuildIndexOptions {
  /**
   * The pattern to match the file names against.
   *
   * @default '*.{ts,tsx,js,jsx}'
   */
  pattern?: string
}

export interface IndexFile {
  /** The path to the index file. */
  path: string
  /** The content of the index file. */
  content: string
}

/**
 * Generates an index file from all the TypeScript files in a directory.
 *
 * @param path The directory to generate the index file for.
 * @param options The options to use.
 * @returns The generated index file.
 * @example await buildIndex('/foo') // [{ path: '/foo/index.ts', content: '...' }]
 */
export async function buildIndex(path: string, options: BuildIndexOptions = {}): Promise<IndexFile> {
  const { pattern = '*.{ts,tsx,js,jsx}' } = options

  // --- List all subdirectories and files in the directory.
  const directoryEntities = await readdir(path, { withFileTypes: true })
  const directoryImports: Array<string> = []

  // --- Iterate over the directory entities.
  for (const entity of directoryEntities) {
    try {
      // --- Find subdirectories containing an index file.
      const isDirectory = entity.isDirectory()
      const isFile = entity.isFile()
      const isPatternMath = patternMatch(pattern, entity.name)
      const isIndexFile = entity.name.startsWith('index.')

      // --- If subdirectory contains an index file, add it to the imports.
      if (isDirectory) {
        const directoryPath = join(path, entity.name)
        const directoryFiles = await readdir(directoryPath, { withFileTypes: true })
        const hasIndexFile = directoryFiles
          .filter(file => file.isFile())
          .some(file => patternMatch(file.name, pattern))
        if (hasIndexFile) directoryImports.push(entity.name)
        continue
      }

      // --- Filter-out the non-matching files.
      if (!isFile || !isPatternMath || isIndexFile) continue

      // --- Push the import.
      const importId = entity.name.split('.').slice(0, -1).join('.')
      directoryImports.push(importId)
    }
    catch { /** Ignore */ }
  }

  // --- Only keep the JavaScript/TypeScript files.
  directoryEntities
    .filter(entity => entity.isFile())
    .map(entity => entity.name)
    .filter(name => /\.[jt]sx?$/.test(name))

  // ---Sort the imports alphabetically and generate the index file content.
  const indexContent = directoryImports
    .sort((a, b) => a.localeCompare(b))
    .map(script => `export * from './${script}'`)
    .join('\n')

  // --- Return the index file.
  return {
    path: join(path, 'index.ts'),
    content: `${indexContent}\n`,
  }
}

/** c8 ignore next */
// if (import.meta.vitest) {
//   it('should build an index file from a directory', async() => {
//     vol.fromJSON({
//       '/foo/bar.ts': '',
//       '/foo/baz.js': '',
//       '/foo/qux.ts': '',
//     })
//     const result = await buildIndex('/foo')
//     const expected = `${[
//       'export * from \'./bar\'',
//       'export * from \'./baz\'',
//       'export * from \'./qux\'',
//     ].join('\n')}\n`
//     expect(result).toEqual(expected)
//   })

//   it('should build an index file ignoring non-TypeScript files', async() => {
//     vol.fromJSON({
//       '/foo/bar.ts': '',
//       '/foo/baz.js': '',
//       '/foo/qux.js': '',
//     })
//     const result = await buildIndex('/foo', { pattern: '*.ts' })
//     const expected = 'export * from \'./bar\'\n'
//     expect(result).toEqual(expected)
//   })

//   it('should sort the index file alphabetically', async() => {
//     vol.fromJSON({
//       '/foo/z.ts': '',
//       '/foo/a.ts': '',
//     })
//     const result = await buildIndex('/foo')
//     const expected = 'export * from \'./a\'\nexport * from \'./z\'\n'
//     expect(result).toEqual(expected)
//   })

//   it('should build an index file and filter-out the index file', async() => {
//     vol.fromJSON({
//       '/foo/bar.ts': '',
//       '/foo/baz.js': '',
//       '/foo/qux.ts': '',
//       '/foo/index.ts': '',
//     })
//     const result = await buildIndex('/foo')
//     const expected = `${[
//       'export * from \'./bar\'',
//       'export * from \'./baz\'',
//       'export * from \'./qux\'',
//     ].join('\n')}\n`
//     expect(result).toEqual(expected)
//   })

//   it('should build an index file and include subdirectory index files', async() => {
//     vol.fromJSON({
//       '/foo/bar.ts': '',
//       '/foo/baz/index.ts': '',
//       '/foo/qux.ts': '',
//     })
//     const result = await buildIndex('/foo')
//     const expected = `${[
//       'export * from \'./bar\'',
//       'export * from \'./baz\'',
//       'export * from \'./qux\'',
//     ].join('\n')}\n`
//     expect(result).toEqual(expected)
//   })
// }
