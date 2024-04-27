import { argv } from 'node:process'
// eslint-disable-next-line n/no-unsupported-features/node-builtins
import { cp } from 'node:fs/promises'
import { mapValues } from '@unshared/collection'
import { getPackageMetadata } from './utils'
import { PACKAGES_NAMES } from './constants'
import { createSemver } from '../packages/string/createSemver'
import { parseCliArguments } from '../packages/process/parseCliArguments'
import { execute as $ } from '../packages/process/execute'

interface NPMView {
  versions: string[]
}

/**
 * Set the version of the package to the version in the package.json file.
 * If the published version is a release candidate or a build, the commit
 * hash will be appended to the version.
 *
 * @param packageName The name of the package to set the version for.
 * @param registry The registry to publish the package to.
 * @returns A promise that resolves when the version is set.
 */
export async function pnpmPublish(packageName: string, registry: string) {
  const { packageJson, packageJsonFS, packagePath } = await getPackageMetadata(packageName)
  const semver = createSemver(packageJson.version)

  // --- If the current hash has a tag, get the tag.
  const hash = await $('git', ['rev-parse', 'HEAD'], 'utf8')
  const gitTag = await $('git', ['describe', '--tags', '--exact-match', hash], 'utf8')
    .then(tag => tag.trim())
    .catch(() => {})

  if (!gitTag) {
    const hash = await $('git', ['rev-parse', 'HEAD'], 'utf8')
    semver.prerelease = `build-${hash.slice(0, 7)}`
    packageJson.version = semver.toString()
  }

  else if (gitTag.startsWith('v')) {
    const tagVersion = createSemver(gitTag.slice(1))
    semver.major = tagVersion.major
    semver.minor = tagVersion.minor
    semver.patch = tagVersion.patch
    semver.prerelease = tagVersion.prerelease
    semver.build = undefined
    packageJson.version = semver.toString()
  }

  else {
    throw new Error(`Invalid tag ${gitTag}`)
  }

  // --- Get the latest version from the registry.
  const npmViewJSON = await $('pnpm', ['view', packageJson.name!, '--registry', registry, '--json'], 'utf8')
  const npmView = JSON.parse(npmViewJSON) as NPMView

  // --- Check if the current version is already released.
  if (npmView.versions.includes(packageJson.version)) {
    console.log(`The package "${packageJson.name!}@${semver.toString()}" already exists in the registry.`)
    return
  }

  // --- Set the version in the package.json file.
  packageJson.dependencies = mapValues(packageJson.dependencies ?? {}, dependency =>
    (dependency.startsWith('workspace:')
      ? packageJson.version!
      : dependency
    ))

  await packageJsonFS.commit()
  const isNext = semver.prerelease !== undefined
  await $('pnpm', [
    'publish',
    '--access',
    isNext ? 'restricted' : 'public',
    '--tag',
    isNext ? 'next' : 'latest',
    '--registry',
    registry,
    '--no-git-checks',
  ], {
    cwd: packagePath,
    stdio: 'inherit',
  })
}

export async function publish() {
  const { options } = parseCliArguments<{ registry?: string }>(argv)
  const { registry } = options

  // --- If not in CI, abort the process.
  if (!process.env.CI) {
    console.log('This script is intended to be run in a CI environment.')
    return
  }

  // --- Registry must be explicitly set to avoid accidental publishing.
  const token = process.env.NODE_AUTH_TOKEN
  if (!registry) throw new Error('The NPM_REGISTRY environment variable is not set.')
  if (!token) throw new Error('The NODE_AUTH_TOKEN environment variable is not set.')
  await $('pnpm', ['set', `//${registry.replace('https://', '')}/:_authToken=${token}`])

  // --- Prepare the package for publishing.
  for (const packageName of PACKAGES_NAMES) {
    await cp('LICENSE.md', `packages/${packageName}/LICENSE.md`)
    await pnpmPublish(packageName, registry)
  }
}

await publish()
