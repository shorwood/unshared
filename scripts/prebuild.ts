import { join } from 'node:path'
import { writeFile } from 'node:fs/promises'
import { buildIndex } from '@unshared/build/buildIndex'

export async function prebuild(path: string) {
  // --- Generate the index.ts file.
  const indexTsPath = join(path, 'index.ts')
  const indexTsContent = await buildIndex(path)
  await writeFile(indexTsPath, indexTsContent, 'utf8')
}
