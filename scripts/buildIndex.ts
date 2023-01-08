import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { sync as glob } from 'fast-glob'
import consola from 'consola'

export const buildIndex = (cwd: string) => {
  const files = glob('./*.(t|j)s', { cwd, onlyFiles: true })

  // --- Abort if already exists.
  if (files.includes('index.ts')) return
  if (files.length === 0) return

  const content = files
    .map(x => x.replace(/\.[^./]+$/, ''))
    .sort()
    .map(file => `export * from './${file}'\n`)
    .join('')

  if (content.length > 0) {
    writeFileSync(join(cwd, 'index.ts'), content)
    consola.success(`Generated index file "${join(cwd, 'index.ts')}"`)
  }
}
