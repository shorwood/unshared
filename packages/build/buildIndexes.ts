import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { cwd } from 'node:process'
import { vol } from 'memfs'
import { buildIndex } from './buildIndex'

export interface IndexFile {
  /** The path to the index file. */
  path: string
  /** The content of the index file. */
  content: string
}

/**
 * Recursively build indexes for a directory and its subdirectories.
 *
 * @param path The path to the directory to build indexes for.
 * @returns The generated index files in an array of objects.
 * @example buildIndexes('/foo') // [{ path: '/foo/index.ts', content: '...' }]
 */
export async function buildIndexes(path: string = cwd()): Promise<IndexFile[]> {
  const indexFiles: IndexFile[] = [{
    path: join(path, 'index.ts'),
    content: await buildIndex(path),
  }]

  // --- Read the directory.
  const directoryEntities = await readdir(path, { withFileTypes: true })
  for (const entity of directoryEntities) {
    if (entity.isDirectory()) {
      const subdirectoryPath = join(path, entity.name)
      const subdirectoryIndexFiles = await buildIndexes(subdirectoryPath)
      indexFiles.push(...subdirectoryIndexFiles)
    }
  }

  // --- Return the index files.
  return indexFiles
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should build indexes for a directory and its subdirectories', async() => {
    vol.fromJSON({
      '/foo/bar.ts': '',
      '/foo/baz.ts': '',
      '/foo/qux.ts': '',
      '/foo/quux/bar.ts': '',
      '/foo/quux/baz.ts': '',
      '/foo/quux/qux.ts': '',
    })
    const result = await buildIndexes('/foo')
    const expected = [
      { path: '/foo/index.ts', content: 'export * from \'./bar\'\nexport * from \'./baz\'\nexport * from \'./qux\'\n' },
      { path: '/foo/quux/index.ts', content: 'export * from \'./bar\'\nexport * from \'./baz\'\nexport * from \'./qux\'\n' },
    ]
    expect(result).toEqual(expected)
  })
}
