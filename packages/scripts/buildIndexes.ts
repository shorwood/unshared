import { createPattern } from '@unshared/string/createPattern'
import { readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { resolvePackage } from './resolvePackage'

interface IndexFile {
  content: string
  path: string
}

export const EXCLUDE_FROM_INDEX = [
  'index.*',
  '.*',
  '__*',
  '*.d.ts',
  'cli.*',
  '*.worker.ts',
  '*.test.ts',
  '*.fixtures.ts',
]

/**
 * Generates an index file from all the TypeScript files in a directory.
 *
 * @param path The directory to generate the index file for.
 * @returns The generated index file.
 * @example await buildIndex('/foo') // [{ path: '/foo/index.ts', content: '...' }]
 */
async function buildIndex(path: string): Promise<IndexFile> {
  const entities = await readdir(path, { withFileTypes: true })
  const imports: string[] = []
  const pattern = createPattern('*.{ts,tsx,js,jsx}')
  const excludePatterns = EXCLUDE_FROM_INDEX.map(pattern => createPattern(pattern))

  // --- Iterate over the directory entities.
  for (const entity of entities) {
    try {
      if (entity.isDirectory()) continue
      if (!entity.isFile()) continue
      if (!pattern.test(entity.name)) continue
      if (excludePatterns.some(exclude => exclude.test(entity.name))) continue

      // --- Push the import.
      const importId = entity.name.split('.').slice(0, -1).join('.')
      imports.push(importId)
    }
    catch { /** Ignore */ }
  }

  // ---Sort the imports alphabetically and generate the index file content.
  const indexContent = [...new Set(imports)]
    .toSorted((a, b) => a.localeCompare(b))
    .map(script => `export * from './${script}'`)
    .join('\n')

  // --- Return the index file.
  return {
    content: `${indexContent}\n`,
    path: join(path, 'index.ts'),
  }
}

export interface BuildIndexesOptions {
  cwd?: string
}

/**
 * Generate the `index.ts` files for the given package.
 *
 * @param packageName The name of the package to build the indexes for.
 * @param options The options for building the indexes.
 * @example buildIndexes('my-package')
 * @returns A promise that resolves when the indexes are built.
 */
export async function buildIndexes(packageName: string, options: BuildIndexesOptions = {}): Promise<void> {
  const { packagePath } = await resolvePackage(packageName, options)

  // --- Do not build the index for these packages.
  if (packageName === 'eslint-config') return

  // --- Build the index file for the current directory.
  const indexFiles: IndexFile[] = [await buildIndex(packagePath)]

  // --- Read the directory and recursively build indexes for subdirectories.
  const entities = await readdir(packagePath, { withFileTypes: true })
  for (const entity of entities) {
    if (!entity.isDirectory()) continue
    if (entity.name === 'node_modules') continue
    if (entity.name === 'dist') continue
    if (entity.name === 'scripts') continue
    if (entity.name === 'index.ts') continue
    if (entity.name.startsWith('__')) continue

    const subdirectoryPath = join(packagePath, entity.name)
    const subdirectoryIndexFiles = await buildIndex(subdirectoryPath)
    indexFiles.push(subdirectoryIndexFiles)
  }

  // --- Return the index files.
  const indexes = indexFiles
    .filter(indexFile => indexFile.content.trim() !== '')
    .filter(indexFile => ['dist', 'node_modules'].every(path => !indexFile.path.includes(path)))

  // --- Write and log the index files.
  for (const { content, path } of indexes)
    await writeFile(path, content, 'utf8')
}
