import { PackageJSON } from 'types-pkg-json'
import { argv } from 'node:process'
import { join } from 'node:path'
import { PACKAGES_NAMES, ROOT_PATH } from './constants'
import { SemverComponents, createSemver } from '../packages/string/createSemver'
import { execute } from '../packages/process/execute'
import { loadObject } from '../packages/fs/loadObject'

async function main(type = 'patch') {

  // --- Check there is no uncommitted changes.
  const status = await execute('git', ['status', '--porcelain'], 'utf8')
  if (status) throw new Error('There are uncommitted changes in the repository.')

  // --- Get the version of the root package.
  const rootPackagePath = join(ROOT_PATH, 'package.json')
  const rootPackageFS = loadObject<PackageJSON>(rootPackagePath)
  const rootPackage = await rootPackageFS
  if (!rootPackage.version) throw new Error('The root package.json does not have a version.')

  // --- Bump the version of the root package.
  if (!['major', 'minor', 'patch'].includes(type)) throw new Error(`Invalid bump type "${type}".`)
  rootPackage.version = createSemver(rootPackage.version).bump(type as SemverComponents).toString()
  await rootPackageFS.commit()

  // --- Set the version of all packages to the root package version.
  const packagePaths = PACKAGES_NAMES.map(packageName => `./packages/${packageName}/package.json`)
  for (const path of packagePaths) {
    const packageJsonFS = loadObject<PackageJSON>(path, { ignoreFileChanges: true, ignoreObjectChanges: true })
    const packageJson = await packageJsonFS
    packageJson.version = rootPackage.version
    await packageJsonFS.commit()
  }

  // --- Add the changes to the git repository.
  await execute('git', ['add', '.'])
  await execute('git', ['commit', '-m', `"chore: release v${rootPackage.version}"`])
  await execute('git', ['tag', '-a', `v${rootPackage.version}`, '-m', `v${rootPackage.version}`])
}

await main(argv[2])
