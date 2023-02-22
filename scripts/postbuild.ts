import { resolve } from 'node:path'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { PackageJSON } from 'types-pkg-json'
import { ESLint } from 'eslint'
// import { sync as glob } from 'fast-glob'

const PATH_SCRIPTS = import.meta.url.slice(7, import.meta.url.lastIndexOf('/'))
const PATH_ROOT = resolve(PATH_SCRIPTS, '..')
const PATH_PACKAGES = resolve(PATH_ROOT, 'packages')

/**
 * Generate the `package.json` file for the sub-package.
 *
 * @param name The name of the sub-package.
 */
export const generatePackageJson = async(name: string) => {
  const packageDirectory = resolve(PATH_PACKAGES, name)

  // --- Get the package.json file for the sub-package
  const packageJsonPath = resolve(packageDirectory, 'package.json')
  const packageJsonUtf8 = await readFile(packageJsonPath, 'utf8').catch(() => '{}')
  const packageJson = JSON.parse(packageJsonUtf8)

  // --- Get the package.json file for the root package
  const rootPackageJsonPath = resolve(PATH_ROOT, 'package.json')
  const rootPackageJsonUtf8 = await readFile(rootPackageJsonPath, 'utf8')
  const rootPackageJson = JSON.parse(rootPackageJsonUtf8)

  // --- Return path if exists in package
  const existReturn = (path: string) => {
    const absolute = resolve(packageDirectory, path)
    return existsSync(absolute) ? path : undefined
  }

  // --- Get the list of files in the distribution directory
  const distributionPath = resolve(PATH_PACKAGES, name, 'dist')
  const distributionEntries = await readdir(distributionPath, { withFileTypes: true }).catch(() => [])
  const exports = distributionEntries
    .filter(entry => entry.isFile())
    .map(entry => entry.name.split('.').shift() as string)
    // eslint-disable-next-line unicorn/no-array-reduce
    .reduce((object, name) => {
      const key = name === 'index' ? '.' : `./${name}`
      // @ts-expect-error: This is a dynamic property name.
      object[key] = {
        import: existReturn(`./dist/${name}.js`),
        require: existReturn(`./dist/${name}.cjs`),
        types: existReturn(`./dist/${name}.d.ts`),
      }

      const exportLength = Object.values(object[key]).filter(Boolean).length
      if (exportLength === 1) {
        // @ts-expect-error: This is a dynamic property name.
        object[key] = object[key].import ?? object[key].require
      }

      if (exportLength === 0) {
        // @ts-expect-error: This is a dynamic property name.
        delete object[key]
      }

      return object
    }, {})

  const finalPackage = <PackageJSON>({
    ...packageJson,
    name: `@unshared/${name}`,
    version: undefined,
    type: existReturn('./dist/index.d.ts') ? 'module' : undefined,
    description: packageJson.description,
    license: rootPackageJson.license,
    author: rootPackageJson.author,
    repository: {
      ...rootPackageJson.repository,
      directory: `packages/${name}`,
    },
    homepage: undefined, // `${rootPackageJson.homepage}/tree/main/packages/${name}#readme`,
    files: ['dist', 'README.md', 'LICENSE'],
    main: existReturn('./dist/index.cjs'),
    module: existReturn('./dist/index.js'),
    types: existReturn('./dist/index.d.ts'),
    exports: Object.keys(exports).length > 0 ? exports : undefined,
    sideEffects: false,
  })

  const finalPackageJson = `${JSON.stringify(finalPackage, undefined, 2)}\n`
  const finalPackageJsonPath = resolve(PATH_PACKAGES, name, 'package.json')
  await writeFile(finalPackageJsonPath, finalPackageJson)
  await new ESLint({ fix: true }).lintFiles(finalPackageJsonPath)
}

/**
 * Copy the `LICENSE` file from the root directory to the sub-package.
 *
 * @param name The name of the sub-package.
 */
export const copyLicense = async(name: string) => {
  const rootLicensePath = resolve(PATH_SCRIPTS, '../LICENCE')
  const rootLicens = await readFile(rootLicensePath, 'utf8')
  const licensePath = resolve(PATH_PACKAGES, name, 'LICENCE')
  await writeFile(licensePath, rootLicens)
}

export const postbuild = async(name: string) => {
  await generatePackageJson(name)
  await copyLicense(name)
}
