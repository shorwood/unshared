/* eslint-disable n/no-unsupported-features/node-builtins */
import { cwd as getCwd } from 'node:process'
import { cp } from 'node:fs/promises'
import { createSemver } from '@unshared/string/createSemver'
import { execute } from '@unshared/process/execute'
import { resolvePackageNames } from './resolvePackageNames'
import { resolvePackage } from './resolvePackage'

const DEFAULT_TAG = 'next'
const DEFAULT_REGISTRY = 'https://registry.npmjs.org'

export interface PublishOneOptions {
  cwd: string
  tag: string
  registry: string
  packageName: string
}

export interface PublishOptions {
  cwd?: string
  tag?: string
  registry?: string
  packageNames?: string[]
}

/**
 * Set the version of the package to the version in the package.json file.
 * If the published version is a release candidate or a build, the commit
 * hash will be appended to the version.
 *
 * @param options The options for setting the version.
 * @returns A promise that resolves when the version is set.
 */
async function publishOne(options: PublishOneOptions) {
  const { cwd, tag, registry, packageName } = options

  // --- Get the package metadata.
  const { packageJson, packageJsonFS, packagePath } = await resolvePackage(packageName, { cwd })
  const semver = createSemver(packageJson.version)

  // --- If the current hash has a tag, get the tag.
  if (tag === 'latest') {
    semver.build = undefined
    semver.prerelease = undefined
    packageJson.version = semver.toString()
  }

  else {
    const hash = await execute('git', ['rev-parse', 'HEAD'], 'utf8')
    semver.patch += 1
    semver.prerelease = `build-${hash.slice(0, 7)}`
    packageJson.version = semver.toString()
  }

  // --- Get the latest version from the registry.
  const npmView = await execute('pnpm', ['view', packageJson.name!, '--registry', registry, '--json'], 'utf8')
    .then(JSON.parse)
    .catch(() => ({ versions: [] })) as { versions?: string[] } | undefined

  // --- Check if the current version is already released.
  if (npmView?.versions?.includes(packageJson.version)) {
    console.log(`The package "${packageJson.name!}@${semver.toString()}" already exists in the registry.`)
    return
  }

  // --- Set the version in the package.json file.
  for (const name in packageJson.dependencies) {
    const value = packageJson.dependencies[name]
    if (value.startsWith('workspace:')) packageJson.dependencies[name] = packageJson.version!
  }

  await packageJsonFS.commit()
  const isNext = semver.prerelease !== undefined
  await execute('pnpm', [
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

/**
 * Publish multiple packages to the registry with the specified tag. If the
 * `CI` environment variable is not set, the process will be aborted.
 *
 * @param options The options for publishing the packages.
 * @returns A promise that resolves when the packages are published.
 * @example publish(['my-package'], { tag: 'next' })
 */
export async function publish(options: PublishOptions = {}) {
  const {
    cwd = getCwd(),
    tag = DEFAULT_TAG,
    registry = DEFAULT_REGISTRY,
    packageNames = await resolvePackageNames(cwd),
  } = options

  // --- If not in CI, abort the process.
  const token = process.env.NODE_AUTH_TOKEN
  if (token) await execute('pnpm', ['set', `//${registry.replace('https://', '')}/:_authToken=${token}`])

  // --- Registry must be explicitly set to avoid accidental publishing.
  if (!process.env.CI) console.warn('This script is intended to be run in a CI environment. Forcing a dry run.')

  // --- Prepare the package for publishing.
  for (const packageName of packageNames) {
    await cp('LICENSE.md', `packages/${packageName}/LICENSE.md`)
    await publishOne({ packageName, cwd, tag, registry })
  }
}
