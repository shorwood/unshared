import { join, relative } from 'node:path'
import { glob } from '../packages/fs/glob'
import { getGitRemoteUrl, getPackageMetadata } from './utils'

async function createPackageExports(outPath: string, packagePath: string) {
  const packageOutFiles = glob('*.{js,mjs,cjs,d.ts}', { cwd: outPath, getRelative: true, onlyFiles: true })
  const packageExports: Record<string, Record<string, string>> = {}

  // --- Set the exports for each file depending on the file extension.
  for await (const path of packageOutFiles) {
    if (path.includes('.min.')) continue
    if (path.includes('.map')) continue

    const outPathRelative = relative(packagePath, outPath)
    const importPath = `./${join(outPathRelative, path)}`
    const importName = `./${path.split('/').pop()!.replace(/\..+$/, '')}`
    packageExports[importName] = packageExports[importName] ?? {}

    if (path.endsWith('.d.ts')) packageExports[importName].types = importPath
    else if (path.endsWith('.umd.js')) continue
    else if (path.endsWith('.iife.js')) packageExports[importName].browser = importPath
    else if (path.endsWith('.mjs')) packageExports[importName].import = importPath
    else if (path.endsWith('.js')) packageExports[importName].import = importPath
    else if (path.endsWith('.cjs')) packageExports[importName].require = importPath
  }

  // --- If there is an `index` key, rename it to `*`.
  if (packageExports['./index']) {
    packageExports['.'] = { ...packageExports['./index'] }
    delete packageExports['./index']
  }

  return packageExports
}

/**
 * Define the version of the package at the given path based on the release type.
 *
 * @param packageName The name of the package to build.
 */
export async function buildPackageJson(packageName: string) {
  const { packagePath, packageJson, packageJsonFS, packageRelativePath } = await getPackageMetadata(packageName)
  const outPath = join(packagePath, 'dist')

  // --- Load the root and current package.json files.
  const packageRemoteUrl = await getGitRemoteUrl(packagePath)
  const packageRemoteUrlHttps = packageRemoteUrl?.replace(/^git@(.+):(.+).git$/, 'https://$1/$2')
  const packageExports = await createPackageExports(outPath, packagePath)

  // --- Update the package.json file.
  packageJson.exports = packageExports
  packageJson.files = packageName === 'eslint-config'
    ? ['lib', 'README.md', 'LICENSE.md']
    : ['dist', 'README.md', 'LICENSE.md']
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
  await packageJsonFS.commit()
}
