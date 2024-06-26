import { PackageJSON } from 'types-pkg-json'
import { cwd as getCwd } from 'node:process'
import { relative, resolve } from 'node:path'
import { execFile } from 'node:child_process'
import { ROOT_PATH } from './constants'
import { toPascalCase } from '../packages/string/toPascalCase'
import { loadObject } from '../packages/fs/loadObject'

/** The current working directory. */
const cwd = getCwd()

/**
 * Get the package metadata from a package name.
 *
 * @param packageName The name of the package.
 * @returns The package metadata.
 * @example getPackageMetadata('my-package') // { name: 'my-package', version: '0.0.1' }
 */
export async function getPackageMetadata(packageName: string) {
  const globalName = toPascalCase('Unshared', packageName)
  const outputDirectory = resolve(ROOT_PATH, 'packages', packageName, 'dist')
  const packagePath = resolve(ROOT_PATH, 'packages', packageName)
  const packageRelativePath = relative(ROOT_PATH, packagePath)
  const packageJsonPath = resolve(packagePath, 'package.json')
  const packageJsonFS = loadObject<PackageJSON>(packageJsonPath, {
    createIfNotExists: true,
    ignoreFileChanges: true,
    ignoreObjectChanges: true,
  })
  const packageJson = await packageJsonFS
  const packageDependencies = {
    ...packageJson.dependencies,
    ...packageJson.peerDependencies,
  }

  const rootPackageJsonPath = resolve(ROOT_PATH, 'package.json')
  const rootPackageJson = await loadObject<PackageJSON>(rootPackageJsonPath, {
    createIfNotExists: true,
    ignoreFileChanges: true,
    ignoreObjectChanges: true,
  })

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
    rootPackageJsonPath,
  }
}

/**
 * Get the hash of a commit in a repository at a given path.
 *
 * @param path The path to the repository directory.
 * @param name The name or refence of the commit.
 * @returns The git hash of the current commit.
 * @example getGitHash() // 'a1b2c3d4e5f6g7h8i9j0'
 */
export async function getGitHash(path: string = cwd, name = 'HEAD'): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    execFile(
      'git',
      ['-C', path, 'rev-parse', name],
      { encoding: 'utf8' },
      (error, stdout) => (error ? reject(error) : resolve(stdout.trim())),
    )
  })
}

/**
 * Get the remote URL of a repository at a given path.
 *
 * @param path The path to the repository.
 * @param name The name of the remote.
 * @returns The remote URL of the repository.
 * @example getGitRemoteUrl() // 'git@github.com:example/project.git'
 */
export async function getGitRemoteUrl(path: string = cwd, name = 'origin'): Promise<string> {
  return await new Promise<string>((resolve, reject) => {
    execFile(
      'git',
      ['-C', path, 'config', '--get', `remote.${name}.url`],
      { encoding: 'utf8' },
      (error, stdout) => (error ? reject(error) : resolve(stdout.trim())),
    )
  })
}
