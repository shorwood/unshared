import { writeFile } from 'node:fs/promises'
import { buildIndexes } from '@unshared/build/buildIndexes'

export async function prebuild(path: string) {
  // --- Generate the index.ts file.
  const indexes = await buildIndexes(path)
  for (const { path, content } of indexes)
    await writeFile(path, content, 'utf8')
}
