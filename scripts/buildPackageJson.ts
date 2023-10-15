import { join, relative } from 'node:path'
import { glob, loadPackageJson } from '@unshared/fs'
import { SemverComponents, createSemver } from '@unshared/string'
import { ROOT_PATH } from './constants'
import { getGitHash } from './getGitHash'
import { getGitRemoteUrl } from './getGitRemoteUrl'

async function computePackageVersion(currentVersion = '0.0.1', bumpType: SemverComponents = 'build') {
  const semver = createSemver(currentVersion)
  if (bumpType === 'build') {
    const gitHash = await getGitHash()
    semver.build = gitHash.slice(0, 7)
  }
  else { semver.bump(bumpType) }
  return semver.toString()
}

async function computePackageExports(outPath: string, packagePath: string) {
  const packageOutFiles = glob('*.{js,mjs,cjs,d.ts}', { cwd: outPath, getRelative: true, onlyFiles: true })
  const packageExports: Record<string, Record<string, string>> = {}

  // --- Set the exports for each file depending on the file extension.
  for await (const path of packageOutFiles) {
    if (path.includes('.min.')) continue
    if (path.includes('.map')) continue

    const outPathRelative = relative(packagePath, outPath)
    const importPath = `./${join(outPathRelative, path)}`
    const importName = path.split('/').pop()!.replace(/\..+$/, '')
    packageExports[importName] = packageExports[importName] ?? {}

    if (path.endsWith('.d.ts')) packageExports[importName].types = importPath
    else if (path.endsWith('.umd.js')) continue
    else if (path.endsWith('.iife.js')) packageExports[importName].browser = importPath
    else if (path.endsWith('.mjs')) packageExports[importName].import = importPath
    else if (path.endsWith('.js')) packageExports[importName].import = importPath
    else if (path.endsWith('.cjs')) packageExports[importName].require = importPath
  }

  // --- If there is an `index` key, rename it to `*`.
  if (packageExports.index) {
    packageExports['*'] = { ...packageExports.index }
    delete packageExports.index
  }

  return packageExports
}

/**
 * Define the version of the package at the given path based on the release type.
 *
 * @param packagePath The path to the package directory.
 */
export async function buildPackage(packagePath: string) {
  const outPath = join(packagePath, 'dist')

  // --- Load the root and current package.json files.
  const packageJsonPath = join(packagePath, 'package.json')
  const packageJsonFs = await loadPackageJson(packageJsonPath)
  const packageJson = await packageJsonFs
  const packageRelativePath = relative(ROOT_PATH, packagePath)
  const packageRemoteUrl = await getGitRemoteUrl(packagePath)
  const packageRemoteUrlHttps = packageRemoteUrl?.replace(/^git@(.+):(.+).git$/, 'https://$1/$2')
  const packageExports = await computePackageExports(outPath, packagePath)

  // --- Update the package.json file.
  packageJson.version = await computePackageVersion(packageJson.version, 'build')
  packageJson.exports = packageExports
  packageJson.files = ['dist', 'README.md', 'LICENSE.md']
  packageJson.main = packageExports['*']?.require
  packageJson.module = packageExports['*']?.import
  packageJson.types = packageExports['*']?.types
  packageJson.browser = packageExports['*']?.browser
  packageJson.license = 'MIT'
  packageJson.sideEffects = false
  packageJson.author = 'Stanley Horwood <stanley@hsjm.io>'
  packageJson.bugs = `${packageRemoteUrlHttps}/issues`
  packageJson.homepage = `${packageRemoteUrlHttps}#readme`
  packageJson.repository = {
    type: 'git',
    url: packageRemoteUrl,
    directory: packageRelativePath,
  }

  // --- Save the package.json file.
  await packageJsonFs.commit()
}
