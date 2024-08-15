import type { PackageJSON } from 'types-pkg-json'
import { loadObject } from '@unshared/fs/loadObject'
import { toPascalCase } from '@unshared/string/toPascalCase'
import { relative, resolve } from 'node:path'
import { cwd as getCwd } from 'node:process'

export interface GetPackageMetadataOptions {
  cwd?: string
}

/**
 * Get the package metadata from a package name.
 *
 * @param packageName The name of the package.
 * @param options The options for getting the package metadata.
 * @returns The package metadata.
 * @example resolvePackage('my-package') // { name: 'my-package', version: '0.0.1' }
 */
export async function resolvePackage(packageName: string, options: GetPackageMetadataOptions) {
  const { cwd = getCwd() } = options
  if (!packageName) throw new Error('Could not resolve the package metadata: No package name were provided.')

  // --- Get the package metadata.
  const outputDirectory = resolve(cwd, 'packages', packageName, 'dist')
  const packagePath = resolve(cwd, 'packages', packageName)
  const packageRelativePath = relative(cwd, packagePath)
  const packageJsonPath = resolve(packagePath, 'package.json')
  const packageJsonFS = loadObject<PackageJSON>(packageJsonPath, {
    createIfNotExists: true,
    ignoreFileChanges: true,
    ignoreObjectChanges: true,
  })

  // --- Get the specified `package.json` content.
  const packageJson = await packageJsonFS
  const packageDependencies = {
    ...packageJson.dependencies,
    ...packageJson.peerDependencies,
  }

  // --- Get the root `package.json` content.
  const rootPackageJsonpath = resolve(cwd, 'package.json')
  const rootPackageJson = await loadObject<PackageJSON>(rootPackageJsonpath, {
    createIfNotExists: true,
    ignoreFileChanges: true,
    ignoreObjectChanges: true,
  })

  // --- Get the global name of the project from the root package.json.
  if (!rootPackageJson.name) throw new Error('The root package.json does not have a name.')
  const rootPackageName = rootPackageJson.name.includes('/')
    ? rootPackageJson.name.split('/').shift()!
    : rootPackageJson.name
  const globalName = toPascalCase(rootPackageName, packageName)

  // --- Return the package metadata.
  return {
    globalName,
    outputDirectory,
    packageDependencies,
    packageJson,
    packageJsonFS,
    packageJsonPath,
    packageName,
    packagePath,
    packageRelativePath,
    rootPackageJson,
    rootPackageName,
    rootPackageJsonpath,
  }
}
