import { argv } from 'node:process'
// eslint-disable-next-line n/no-unsupported-features/node-builtins
import { cp } from 'node:fs/promises'
import { mapValues } from '@unshared/collection'
import { getPackageMetadata } from './utils'
import { PACKAGES_NAMES } from './constants'
import { createSemver } from '../packages/string/createSemver'
import { parseCliArguments } from '../packages/process/parseCliArguments'
import { execute as $ } from '../packages/process/execute'

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
  const version = createSemver(packageJson.version)

  // --- If the current hash has a tag, get the tag.
  const hash = await $('git', ['rev-parse', 'HEAD'], 'utf8')
  const gitTag = await $('git', ['describe', '--tags', '--exact-match', hash], 'utf8')
    .then(tag => tag.trim())
    .catch(() => {})

  if (!gitTag) {
    const hash = await $('git', ['rev-parse', 'HEAD'], 'utf8')
    version.prerelease = `build-${hash.slice(0, 7)}`
    packageJson.version = version.toString()
  }

  else if (gitTag.startsWith('v')) {
    const tagVersion = createSemver(gitTag.slice(1))
    version.major = tagVersion.major
    version.minor = tagVersion.minor
    version.patch = tagVersion.patch
    version.prerelease = tagVersion.prerelease
    version.build = undefined
  }

  else {
    throw new Error(`Invalid tag ${gitTag}`)
  }

  // --- Check if the current version is already released.
  // --- Get the latest version from the registry.
  const npmViewJSON = await $('pnpm', ['view', packageJson.name!, '--json'], 'utf8')
    .then((json: string) => JSON.parse(json) as { version: string })
    .catch(() => ({})) as { 'dist-tags': Record<string, string> }

  // --- Check if the current version is already released.
  const versionNpm = npmViewJSON?.['dist-tags']?.latest
  const versionPublished = version.toString()
  if (versionPublished === versionNpm){
    console.log(`The package "${packageJson.name!}@${version.toString()}" already exists in the registry.`)
    return
  }

  // --- Set the version in the package.json file.
  packageJson.version = versionPublished
  packageJson.dependencies = mapValues(packageJson.dependencies ?? {}, version =>
    (version.startsWith('workspace:') ? versionPublished : version))

  await packageJsonFS.commit()
  const isNext = version.prerelease !== undefined
  await $('pnpm', [
    'publish',
    '--access',
    isNext ? 'restricted' : 'public',
    '--tag',
    isNext ? 'next' : 'latest',
    '--registry',
    registry,
    '--no-git-checks',
    '--dry-run',
  ], {
    cwd: packagePath,
    stdio: 'inherit',
  })
}

export async function publish() {
  const { options, parameters } = parseCliArguments<{ registry?: string }>(argv)
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

  // --- If package name(s) are provided, only publish the specified packages.
  const packageNames = parameters.length > 0
    ? PACKAGES_NAMES.filter(argument => parameters.includes(argument))
    : PACKAGES_NAMES

  // --- Prepare the package for publishing.
  for (const packageName of packageNames) {
    await cp('LICENSE.md', `packages/${packageName}/LICENSE.md`)
    await pnpmPublish(packageName, registry)
  }
}

await publish()
