import { readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { cwd } from 'node:process'
import { IndexFile, buildIndex } from './buildIndex'

/**
 * Generate the `index.ts` files for every package and their sub-directories.
 *
 * @param directory The path to the directory to build the indexes for.
 * @example
 * $ eskli unshared build-indexes ./packages
 * Built index files for 11 package(s).
 */
export async function buildIndexes(directory: string = cwd()) {
  // --- Build the index file for the current directory.
  const indexFiles: IndexFile[] = [await buildIndex(directory)]

  // --- Read the directory and recursively build indexes for subdirectories.
  const directoryEntities = await readdir(directory, { withFileTypes: true })
  for (const entity of directoryEntities) {
    if (!entity.isDirectory()) continue
    if (entity.name === 'node_modules') continue
    if (entity.name === 'index.ts') continue

    const subdirectoryPath = join(directory, entity.name)
    const subdirectoryIndexFiles = await buildIndex(subdirectoryPath)
    indexFiles.push(subdirectoryIndexFiles)
  }

  console.log(`Built index files for ${indexFiles.length} package(s).`)

  // --- Return the index files.
  const indexes = indexFiles
    .filter(indexFile => indexFile.content.trim() !== '')
    .filter(indexFile => ['dist', 'node_modules'].every(path => !indexFile.path.includes(path)))
    .sort((a, b) => a.path.length - b.path.length)

  // --- Write and log the index files.
  for (const { path, content } of indexes) {
    console.log(`Writing ${path}`)
    await writeFile(path, content, 'utf8')
  }
}

// --- Run the script.
await buildIndexes(process.argv[2])

/** c8 ignore next */
// if (import.meta.vitest) {
//   it('should build indexes for a directory and its subdirectories', async() => {
//     vol.fromJSON({
//       '/foo/bar.ts': '',
//       '/foo/baz.ts': '',
//       '/foo/qux.ts': '',
//       '/foo/quux/bar.ts': '',
//       '/foo/quux/baz.ts': '',
//       '/foo/quux/qux.ts': '',
//     })
//     const result = await buildIndexes('/foo')
//     const expected = [
//       { path: '/foo/index.ts', content: 'export * from \'./bar\'\nexport * from \'./baz\'\nexport * from \'./qux\'\n' },
//       { path: '/foo/quux/index.ts', content: 'export * from \'./bar\'\nexport * from \'./baz\'\nexport * from \'./qux\'\n' },
//     ]
//     expect(result).toEqual(expected)
//   })
// }
