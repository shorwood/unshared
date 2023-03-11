/* eslint-disable unicorn/prevent-abbreviations */
import { join } from 'node:path'
import { PackageJSON } from 'types-pkg-json'
import { loadObject } from '@unshared/fs/loadObject'
import { buildPackageMetadata } from '@unshared/build/buildPackageMetadata'
import { buildPackageEntries } from '@unshared/build/buildPackageEntries'

const ROOT_DIR = new URL('../', import.meta.url).pathname

export async function postbuild(path: string) {
  const packageJsonPath = join(path, 'package.json')
  const rootPackageJsonPath = join(ROOT_DIR, 'package.json')

  // --- Load the root and current package.json files.
  const packageJson = loadObject<PackageJSON>(packageJsonPath)
  const rootPackageJson = loadObject<PackageJSON>(rootPackageJsonPath)

  // --- Extend the current package.json file.
  Object.assign(
    packageJson,
    await buildPackageMetadata(path, { rootPackageJson, rootDir: ROOT_DIR }),
    await buildPackageEntries(path, { outDir: './dist' }),
    {
      type: 'module',
      sideEffects: false,
      scripts: { ...packageJson.scripts, build: 'tsup', dev: 'tsup --watch' },
      files: ['dist', 'README.md', 'LICENSE'],
    },
  )
}
