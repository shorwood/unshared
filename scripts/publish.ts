import { cp } from 'node:fs/promises'
import { argv } from 'node:process'
import { execute as $ } from '../packages/process/execute'
import { parseArgv } from '../packages/process/parseCliArgv'
import { SemverComponents, createSemver } from '../packages/string/createSemver'
import { PACKAGES_NAMES } from './constants'
import { getPackageMetadata } from './utils'

/**
 * Set the version of the package to the version in the package.json file.
 * If the published version is a release candidate or a build, the commit
 * hash will be appended to the version.
 *
 * @param packageName The name of the package to set the version for.
 * @returns A promise that resolves when the version is set.
 */
export async function publishPackage(packageName: string) {
  const { packageJson, packageJsonFS, packagePath } = await getPackageMetadata(packageName)
  const version = createSemver(packageJson.version)

  // --- If the current hash has a tag, get the tag.
  const hash = await $('git', ['rev-parse', 'HEAD'], 'utf8')
  const gitTag = await $('git', ['describe', '--tags', '--exact-match', hash], 'utf8')
    .then(tag => tag.trim())
    .catch(() => {})

  // --- Check if the current version is already released.
  // const npmViewJSON = await $('npm', ['view', packageName, 'version', '--json'], 'utf8')
  // const npmView = JSON.parse(npmViewJSON) as Record<string, unknown>

  if (!gitTag) {
    const hash = await $('git', ['rev-parse', 'HEAD'], 'utf8')
    version.prerelease = `build-${hash.slice(0, 7)}`
    packageJson.version = version.toString()
  }

  else if (gitTag.startsWith('v')) {
    const tagVersion = createSemver(gitTag.slice(1))
    if (version.satisfies(`>${tagVersion.toString()}`))
      throw new Error(`The current version ${version.toString()} is already released.`)
    version.major = tagVersion.major
    version.minor = tagVersion.minor
    version.patch = tagVersion.patch
    version.prerelease = tagVersion.prerelease
    version.build = undefined
  }

  else {
    throw new Error(`Invalid tag ${gitTag}`)
  }

  // --- Set the version in the package.json file.
  packageJson.version = version.toString()
  await packageJsonFS.commit()

  // --- Publish the package.
  const isNext = version.prerelease !== undefined
  const access = isNext ? 'restricted' : 'public'
  const tag = isNext ? 'next' : 'latest'

  // --- Publish the package.
  await $('npm', ['publish', '--access', access, '--tag', tag, '--dry-run'], {
    stdio: 'inherit',
    cwd: packagePath,
  })
}

export async function publish() {
  const { args } = parseArgv(argv)

  const packageNames = args.length > 0
    ? args.filter(argument => PACKAGES_NAMES.includes(argument))
    : PACKAGES_NAMES

  // --- Prepare the package for publishing.
  for (const packageName of packageNames) {
    await cp('LICENSE.md', `packages/${packageName}/LICENSE.md`)
    await publishPackage(packageName)
  }
}

// --- Run the build script.
await publish()
