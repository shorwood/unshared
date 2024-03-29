import { readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { patternMatch } from '../packages/string/patternMatch'
import { getPackageMetadata } from './utils'

interface IndexFile {
  /** The path to the index file. */
  path: string
  /** The content of the index file. */
  content: string
}

/**
 * Generates an index file from all the TypeScript files in a directory.
 *
 * @param path The directory to generate the index file for.
 * @returns The generated index file.
 * @example await buildIndex('/foo') // [{ path: '/foo/index.ts', content: '...' }]
 */
async function buildIndex(path: string): Promise<IndexFile> {
  const pattern = '*.{ts,tsx,js,jsx}'
  const entities = await readdir(path, { withFileTypes: true })
  const imports: string[] = []

  // --- Iterate over the directory entities.
  for (const entity of entities) {
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
        const hasIndexFile = directoryFiles.some(file => file.name === 'index.ts')
        if (hasIndexFile) imports.push(entity.name)
        continue
      }

      // --- Filter-out the non-matching files.
      if (!isFile || !isPatternMath || isIndexFile) continue

      // --- Push the import.
      const importId = entity.name.split('.').slice(0, -1).join('.')
      imports.push(importId)
    }
    catch { /** Ignore */ }
  }

  // --- Only keep the JavaScript/TypeScript files.
  entities
    .filter(entity => entity.isFile())
    .map(entity => entity.name)
    .filter(name => /\.[jt]sx?$/.test(name))

  // ---Sort the imports alphabetically and generate the index file content.
  const indexContent = imports
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
 * Generate the `index.ts` files for the given package.
 *
 * @param packageName The name of the package to build the indexes for.
 */
export async function buildIndexes(packageName: string): Promise<void> {
  const { packagePath } = await getPackageMetadata(packageName)

  // --- Build the index file for the current directory.
  const indexFiles: IndexFile[] = [await buildIndex(packagePath)]

  // --- Read the directory and recursively build indexes for subdirectories.
  const entities = await readdir(packagePath, { withFileTypes: true })
  for (const entity of entities) {
    if (!entity.isDirectory()) continue
    if (entity.name === 'node_modules') continue
    if (entity.name === 'index.ts') continue

    const subdirectoryPath = join(packagePath, entity.name)
    const subdirectoryIndexFiles = await buildIndex(subdirectoryPath)
    indexFiles.push(subdirectoryIndexFiles)
  }

  // --- Return the index files.
  const indexes = indexFiles
    .filter(indexFile => indexFile.content.trim() !== '')
    .filter(indexFile => ['dist', 'node_modules'].every(path => !indexFile.path.includes(path)))
    .sort((a, b) => a.path.length - b.path.length)

  // --- Write and log the index files.
  for (const { path, content } of indexes)
    await writeFile(path, content, 'utf8')
}
