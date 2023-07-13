/* eslint-disable unicorn/prevent-abbreviations */
import { join } from 'node:path'
import { buildPackageEntries } from '@unshared/build/buildPackageEntries'
import { buildPackageMetadata } from '@unshared/build/buildPackageMetadata'
import { buildPackageVersion } from '@unshared/build/buildPackageVersion'
import { loadObject } from '@unshared/fs/loadObject'
import { PackageJSON } from 'types-pkg-json'

const ROOT_DIR = new URL('../', import.meta.url).pathname

export async function postbuild(path: string) {
  const packageJsonPath = join(path, 'package.json')
  const rootPackageJsonPath = join(ROOT_DIR, 'package.json')

  // --- Load the root and current package.json files.
  const packageJsonFs = loadObject<PackageJSON>(packageJsonPath)
  const packageJson = await packageJsonFs
  const rootPackageJson = await loadObject<PackageJSON>(rootPackageJsonPath)

  // --- Define the default package json properties.
  const packageJsonBase = {
    type: 'module',
    sideEffects: false,
    scripts: { ...packageJson.scripts, build: 'tsup', dev: 'tsup --watch' },
    files: ['dist', 'README.md', 'LICENSE'],
  }

  // --- Extend the current package.json file.
  Object.assign(
    packageJson,
    packageJsonBase,
    await buildPackageMetadata(path, { rootPackageJson, rootDir: ROOT_DIR }),
    await buildPackageEntries(path, { outDir: './dist' }),
    await buildPackageVersion(path),
  )

  // --- Save the current package.json file.
  await packageJsonFs.commit()
}
