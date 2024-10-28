import { glob } from '@unshared/fs'
import { toKebabCase } from '@unshared/string'
import { join, relative } from 'node:path'
import { getGitRemoteUrl } from './getGitRemoteUrl'
import { resolvePackage } from './resolvePackage'

export interface BuildPackageJsonOptions {
  cwd?: string
}

export interface CreatePackageBinOptions {
  outPath: string
  packagePath: string
  packageName: string
  rootPackageName: string
}

async function createPackageExports(outPath: string, packagePath: string): Promise<Record<string, Record<string, string>>> {
  const packageOutFiles = glob('*.{js,mjs,cjs,d.ts}', { cwd: outPath, getRelative: true, onlyFiles: true })
  const packageExports: Record<string, Record<string, string>> = {}

  // --- Set the exports for each file depending on the file extension.
  for await (const path of packageOutFiles) {
    if (path.includes('.min.')) continue
    if (path.includes('.map')) continue
    if (path.includes('cli')) continue

    const outPathRelative = relative(packagePath, outPath)
    const importPath = `./${join(outPathRelative, path)}`
    const importName = `./${path.split('/').pop()!.replace(/(\.d)?\.(ts|mjs|cjs|js)$/, '')}`
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

async function createPackageBin(options: CreatePackageBinOptions): Promise<Record<string, string> | undefined> {
  const { outPath, packagePath, packageName, rootPackageName } = options
  const packageBinFiles = glob(['cli.*.{js,mjs,cjs}', 'cli.{js,mjs,cjs}'], { cwd: outPath, getRelative: true, onlyFiles: true })
  const packageBin: Record<string, string> = {}
  const defaultBinName = toKebabCase(rootPackageName, packageName)

  // --- Set the bin for each file depending on the file extension.
  for await (const path of packageBinFiles) {
    const outPathRelative = relative(packagePath, outPath)
    const importPath = `./${join(outPathRelative, path)}`
    const binName = /cli\.(?<name>.+?)\.(ts|mjs|cjs|js)$/.exec(path)?.groups?.name
    packageBin[binName ?? defaultBinName] = importPath
  }

  // --- If there are no bin files, return undefined.
  if (Object.keys(packageBin).length === 0) return
  return packageBin
}

/**
 * Define the version of the package at the given path based on the release type.
 *
 * @param packageName The name of the package to build.
 * @param options The options for building the package.json file.
 * @example buildPackageJson('my-package')
 * @returns A promise that resolves when the package.json file is built.
 */
export async function buildPackageJson(packageName: string, options: BuildPackageJsonOptions = {}): Promise<void> {
  const {
    packageJson,
    packageJsonFS,
    packagePath,
    packageRelativePath,
    rootPackageJson,
    rootPackageName,
  } = await resolvePackage(packageName, options)

  // --- Load the root and current package.json files.
  const outPath = join(packagePath, 'dist')
  const packageRemoteUrl = await getGitRemoteUrl(packagePath)
  const packageRemoteUrlHttps = packageRemoteUrl?.replace(/^git@([^:]+):([^/]+)\/(.+)\.git$/, 'https://$1/$2/$3')
  const packageExports = await createPackageExports(outPath, packagePath)
  const packageBin = await createPackageBin({ outPath, packagePath, packageName, rootPackageName })

  // --- Update the package.json file.
  packageJson.version = rootPackageJson.version
  packageJson.type = 'module'
  packageJson.sideEffects = false
  packageJson.bin = packageBin
  packageJson.exports = packageExports
  packageJson.files = ['dist', 'README.md', 'LICENSE.md']
  packageJson.main = packageExports['.']?.require
  packageJson.module = packageExports['.']?.import
  packageJson.types = packageExports['.']?.types
  packageJson.browser = packageExports['.']?.browser
  packageJson.license = 'MIT'
  packageJson.author = 'Stanley Horwood <stanley@hsjm.io>'
  packageJson.bugs = `${packageRemoteUrlHttps}/issues`
  packageJson.homepage = `${packageRemoteUrlHttps}#readme`
  packageJson.repository = {
    directory: packageRelativePath,
    type: 'git',
    url: packageRemoteUrl,
  }

  // --- Save the package.json file.
  await packageJsonFS.commit()
}
