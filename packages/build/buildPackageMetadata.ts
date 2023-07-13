/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable unicorn/prevent-abbreviations */
import { execFile } from 'node:child_process'
import { readdir } from 'node:fs/promises'
import { relative, resolve } from 'node:path'
import { cwd } from 'node:process'
import { vol } from 'memfs'
import { PackageJSON } from 'types-pkg-json'

export interface BuildPackageMetadataOptions {
  /**
   * The path to the root directory of the project. Defaults to the resolved path of
   * `../..` from the `path` parameter. This is used to infer and default the
   * properties of the `package.json` file if they are not already set.
   *
   * @default resolve(path, '../..')
   */
  rootDir?: string
  /**
   * The content of the root `package.json` file. This is used to infer and default
   * the properties of the `package.json` file if they are not already set.
   */
  rootPackageJson?: PackageJSON
}

/**
 * Generate a mono-repository sub-package `package.json` file.
 *
 * @param path The path to the package directory.
 * @param options The plugin options.
 * @returns The generated `package.json` object.
 */
export async function buildPackageMetadata(path: string = cwd(), options: BuildPackageMetadataOptions = {}): Promise<PackageJSON> {
  const {
    rootDir = resolve(path, '../..'),
    rootPackageJson = {},
  } = options

  // --- Load the root package.json file.
  const rootPackageName = rootPackageJson.name?.startsWith('@')
    ? rootPackageJson.name.split('/').shift()?.slice(1)
    : rootPackageJson.name

  // --- Abort if no name was found.
  if (!rootPackageName) throw new Error(`Could not generate package name for "${path}"`)

  // --- Load the package.json file.
  const packageJson: PackageJSON = {}
  const packageRelativePath = relative(rootDir, path)
  const packageName = path.split('/').pop()
  const packageFiles = await readdir(path)

  // --- Get the name if extends is set.
  packageJson.name = rootPackageName
    ? `@${rootPackageName}/${packageName}`
    : packageName

  // --- Set the repository if it is not set.
  const repositoryGitUrl = await new Promise<string | void>((resolve) => {
    const { stdout } = execFile('git', ['config', '--get', 'remote.origin.url'])
    stdout?.once('data', data => resolve(data.toString().trim()))
    stdout?.once('end', () => resolve())
    stdout?.once('error', () => resolve())
  })

  // --- Set the repository and page URLs.
  if (repositoryGitUrl) {
    const repositoryUrl = repositoryGitUrl?.replace(/^git@(.+):(.+).git$/, 'https://$1/$2')
    packageJson.bugs = `${repositoryUrl}/issues`
    packageJson.homepage = `${repositoryUrl}#readme`
    packageJson.repository = {
      type: 'git',
      url: `git+${repositoryUrl}.git`,
      directory: packageRelativePath,
    }

    // --- Set the README if it was found.
    const readmeFile = packageFiles.find(file => /^readme(\.(md|txt))?$/i.test(file))
    if (readmeFile) packageJson.readme = `${repositoryUrl}/blob/master/${packageRelativePath}/${readmeFile}`
  }

  // --- Inherit the root package.json file.
  packageJson.author = rootPackageJson.author
  packageJson.license = rootPackageJson.license

  // --- Return the package.json file.
  return packageJson
}

/** c8 ignore next */
if (import.meta.vitest) {
  const repositoryUrl = 'https://github.com/shorwood/unshared'

  it('should generate a name from the root package.json file when name is namespaced', async() => {
    vol.fromJSON({
      '/package.json': JSON.stringify({ name: '@foo/bar' }),
      '/packages/bar/package.json': JSON.stringify({}),
    })
    const result = await buildPackageMetadata('/packages/bar')
    expect(result.name).toEqual('@foo/bar')
  })

  it('should generate a name from the root package.json file when name is not namespaced', async() => {
    vol.fromJSON({
      '/package.json': JSON.stringify({ name: 'foo' }),
      '/packages/bar/package.json': JSON.stringify({}),
    })
    const result = await buildPackageMetadata('/packages/bar')
    expect(result.name).toEqual('@foo/bar')
  })

  it('should generate a name if the root package.json file does not exist', async() => {
    vol.fromJSON({
      '/packages/bar/package.json': JSON.stringify({}),
    })
    const result = await buildPackageMetadata('/packages/bar')
    expect(result.name).toEqual('bar')
  })

  it('should compute the repository and page URLs', async() => {
    vol.fromJSON({
      '/package.json': JSON.stringify({ name: 'foo' }),
      '/packages/bar/package.json': JSON.stringify({}),
      '/packages/bar/README.md': '',
    })
    const result = await buildPackageMetadata('/packages/bar') as PackageJSON & { repository: Exclude<PackageJSON['repository'], string> }
    expect(result.repository?.type).toEqual('git')
    expect(result.repository?.url).toEqual(`git+${repositoryUrl}.git`)
    expect(result.repository?.directory).toEqual('packages/bar')
    expect(result.bugs).toEqual(`${repositoryUrl}/issues`)
    expect(result.readme).toEqual(`${repositoryUrl}/blob/master/packages/bar/README.md`)
    expect(result.homepage).toEqual(`${repositoryUrl}#readme`)
  })

  it('should keep additional properties', async() => {
    vol.fromJSON({
      '/package.json': JSON.stringify({ name: 'foo' }),
      '/packages/bar/package.json': JSON.stringify({ foo: 'bar' }),
    })
    const result = await buildPackageMetadata('/packages/bar')
    expect(result.foo).toEqual('bar')
  })
}
