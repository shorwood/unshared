import { copyFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { sync as glob } from 'fast-glob'
import consola from 'consola'

// --- Compute paths.
const root = resolve(__dirname, '../')
const distPath = resolve(root, 'dist')
const distPackages = glob('*', { cwd: distPath, onlyDirectories: true, absolute: true })

// --- Get root licence path.
const licencePath = glob('LI(C|S)ENCE(.md)?', { cwd: root, onlyFiles: true, absolute: true })[0]

for (const distPackage of distPackages) {
  consola.success(`Copied LICENCE to ${relative(root, distPackage)}`)
  copyFileSync(licencePath, join(distPackage, 'LICENCE'))
}
