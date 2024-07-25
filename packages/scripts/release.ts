import { PackageJSON } from 'types-pkg-json'
import { cwd as getCwd } from 'node:process'
import { join } from 'node:path'
import { SemverComponents, createSemver } from '@unshared/string/createSemver'
import { execute } from '@unshared/process/execute'
import { loadObject } from '@unshared/fs/loadObject'
import { resolvePackageNames } from './resolvePackageNames'

export interface ReleaseOptions {
  cwd?: string
  type?: SemverComponents
  packageNames?: string[]
}

/**
 * Update the version of all packages and create a new git tag with the new version,
 * then, commit the changes.
 *
 * @param options The options for releasing the packages.
 * @returns A promise that resolves when the release is done.
 * @example release({ type: 'minor' })
 */
export async function release(options: ReleaseOptions = {}) {
  const {
    cwd = getCwd(),
    type = 'patch',
    packageNames = await resolvePackageNames(cwd),
  } = options

  // --- Check there is no uncommitted changes.
  const status = await execute('git', ['status', '--porcelain'], 'utf8')
  if (status) throw new Error('There are uncommitted changes in the repository.')

  // --- Get the version of the root package.
  const rootPackagePath = join(cwd, 'package.json')
  const rootPackageFS = loadObject<PackageJSON>(rootPackagePath)
  const rootPackage = await rootPackageFS
  if (!rootPackage.version) throw new Error('The root package.json does not have a version.')

  // --- Bump the version of the root package.
  if (!['major', 'minor', 'patch'].includes(type)) throw new Error(`Invalid bump type "${type}".`)
  rootPackage.version = createSemver(rootPackage.version).bump(type).toString()
  await rootPackageFS.commit()

  // --- Set the version of all packages to the root package version.
  const packagePaths = packageNames.map(packageName => `./packages/${packageName}/package.json`)
  for (const path of packagePaths) {
    const packageJsonFS = loadObject<PackageJSON>(path, { ignoreFileChanges: true, ignoreObjectChanges: true })
    const packageJson = await packageJsonFS
    packageJson.version = rootPackage.version
    await packageJsonFS.commit()
  }

  // --- Add the changes to the git repository.
  await execute('git', ['add', '.'])
  await execute('git', ['commit', '-m', `chore: release v${rootPackage.version}`])
  await execute('git', ['tag', '-a', `v${rootPackage.version}`, '-m', `v${rootPackage.version}`])
}
