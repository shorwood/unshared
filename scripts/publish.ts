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
 * @param tag The tag to use for the package. This is either `latest` or `next`.
 * @returns A promise that resolves when the version is set.
 */
export async function pnpmPublish(packageName: string, registry: string, tag: string) {
  const { packageJson, packageJsonFS, packagePath } = await getPackageMetadata(packageName)
  const semver = createSemver(packageJson.version)

  // --- If the current hash has a tag, get the tag.
  if (tag === 'public') {
    semver.build = undefined
    semver.prerelease = undefined
    packageJson.version = semver.toString()
  }

  else {
    const hash = await $('git', ['rev-parse', 'HEAD'], 'utf8')
    semver.patch += 1
    semver.prerelease = `build-${hash.slice(0, 7)}`
    packageJson.version = semver.toString()
  }

  // --- Get the latest version from the registry.
  const npmView = await $('pnpm', ['view', packageJson.name!, '--registry', registry, '--json'], 'utf8')
    .then(JSON.parse)
    .catch(() => ({ versions: [] })) as { versions?: string[] } | undefined

  // --- Check if the current version is already released.
  if (npmView?.versions?.includes(packageJson.version)) {
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
    tag,
    '--registry',
    registry,
    '--no-git-checks',
    process.env.CI ? '' : '--dry-run',
  ].filter(Boolean), {
    cwd: packagePath,
    stdio: 'inherit',
  })
}

export async function publish() {
  const { options } = parseCliArguments<{ registry?: string; tag: string }>(argv)
  const { registry = 'https://registry.npmjs.org', tag = 'next' } = options

  // --- If not in CI, abort the process.
  const token = process.env.NODE_AUTH_TOKEN
  if (token) await $('pnpm', ['set', `//${registry.replace('https://', '')}/:_authToken=${token}`])

  // --- Registry must be explicitly set to avoid accidental publishing.
  if (!process.env.CI) console.warn('This script is intended to be run in a CI environment. Forcing a dry run.')

  // --- Prepare the package for publishing.
  for (const packageName of PACKAGES_NAMES) {
    await cp('LICENSE.md', `packages/${packageName}/LICENSE.md`)
    await pnpmPublish(packageName, registry, tag)
  }
}

await publish()
