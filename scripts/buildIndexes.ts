import { readdir, writeFile } from 'node:fs/promises'
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
  const directoryImports: string[] = []

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


/**
 * Generate the `index.ts` files for every package and their sub-directories.
 *
 * @param directory The path to the directory to build the indexes for.
 * @example
 * $ eskli unshared build-indexes ./packages
 * Built index files for 11 package(s).
 */
export async function buildIndexes(directory: string) {
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
