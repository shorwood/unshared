import { existsSync, rmSync, writeFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { sync as glob } from 'fast-glob'
import consola from 'consola'

// --- Compute paths.
const root = resolve(__dirname, '../')
const cwd = resolve(root, 'packages')

// --- Get all folders under the target.
glob('./*', {
  cwd,
  onlyDirectories: true,
  absolute: true,
})

  // --- Get all sources files.
  .map(x => ({
    folder: x,
    files: glob('./*.(t|j)s', { cwd: x, onlyFiles: true, ignore: ['index.*'] })
      .map(x => x.replace(/\.[^./]+$/, ''))
      .sort(),
  }))

  // --- Compute `index.ts` content.
  .map(x => ({
    filePath: resolve(x.folder, 'index.ts'),
    filePathRelative: relative(root, resolve(x.folder, 'index.ts')),
    ...x,
    content: x.files.map(file => `export * from './${file}'\n`).join(''),
  }))

  // --- Write files and delete when no functions was found.
  .forEach((x) => {
    if (x.files.length > 0) {
      consola.success(`Generated index file "${x.filePathRelative}"`)
      writeFileSync(x.filePath, x.content)
    }
    else if (existsSync(x.filePath)) {
      consola.info(`Deleted file "${x.filePathRelative}"`)
      rmSync(x.filePath)
    }
  })
