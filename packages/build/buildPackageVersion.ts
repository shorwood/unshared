import { join } from 'node:path'
import { cwd } from 'node:process'
import { loadObject } from '@unshared/fs/loadObject'
import { semverParse } from '@unshared/semver/semverParse'
import { semverStringify } from '@unshared/semver/semverStringify'
import { PackageJSON } from 'types-pkg-json'
import { getGitHash } from './getGitHash'

export async function buildPackageVersion(path = cwd()): Promise<PackageJSON> {
  // --- Load the root and current package.json files.
  const packageJsonPath = join(path, 'package.json')
  const packageJson = await loadObject<PackageJSON>(packageJsonPath)

  // --- Update the version number.
  const packageSemver = semverParse(packageJson.version ?? '0.0.1')
  const gitHash = await getGitHash()
  const gitHashShort = gitHash.slice(0, 7)
  const version = semverStringify({ ...packageSemver, build: `build.${gitHashShort}` })

  // --- Return the new version number.
  return { version }
}
