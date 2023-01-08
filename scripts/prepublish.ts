import { readdir, readFile, writeFile } from 'fs/promises'
import { resolve } from 'path'
import { PackageJSON } from 'types-pkg-json'

const __dirname = import.meta.url.slice(7, import.meta.url.lastIndexOf('/'))

/**
 * Generate the `package.json` file for the sub-package.
 * @param name The name of the sub-package.
 */
export const generatePackageJson = async(name: string) => {
  const packageJsonPath = resolve(__dirname, '../packages', name, 'package.json')
  const packageJsonUtf8 = await readFile(packageJsonPath, 'utf8').catch(() => '{}')
  const packageJson = JSON.parse(packageJsonUtf8)

  const rootPackageJsonPath = resolve(__dirname, '../package.json')
  const rootPackageJsonUtf8 = await readFile(rootPackageJsonPath, 'utf8')
  const rootPackageJson = JSON.parse(rootPackageJsonUtf8)

  const finalPackage = <PackageJSON>({
    ...packageJson,
    name: name !== rootPackageJson.name
      ? `@${rootPackageJson.name}/${name}`
      : rootPackageJson.name,
    description: packageJson.description,
    version: rootPackageJson.version,
    license: rootPackageJson.license,
    author: rootPackageJson.author,
    repository: {
      ...rootPackageJson.repository,
      directory: `packages/${name}`,
    },
    homepage: undefined, //`${rootPackageJson.homepage}/tree/main/packages/${name}#readme`,
    files: ['dist', 'README.md', 'LICENSE'],
    main: 'dist/index.js',
    module: 'dist/index.mjs',
    types: 'dist/index.d.ts',
    sideEffects: false,
  })

  const finalPackageJson = JSON.stringify(finalPackage, null, 2) + '\n'
  const finalPackageJsonPath = resolve(__dirname, '../packages', name, 'package.json')
  await writeFile(finalPackageJsonPath, finalPackageJson)
}

/**
 * Copy the `LICENSE` file from the root directory to the sub-package.
 * @param name The name of the sub-package.
 */
export const copyLicense = async(name: string) => {
  const rootLicensePath = resolve(__dirname, '../LICENCE')
  const rootLicens = await readFile(rootLicensePath, 'utf8')
  const licensePath = resolve(__dirname, '../packages', name, 'LICENCE')
  await writeFile(licensePath, rootLicens)
}

const main = async () => {
  // list directories in packages with 'node:fs/promises'
  const packagePath = resolve(__dirname, '../packages')
  const packagePaths = await readdir(packagePath, { withFileTypes: true })
  const packageDirectories = packagePaths.filter(dirent => dirent.isDirectory())
  const packageNames = packageDirectories.map(dirent => dirent.name)

  for (const name of packageNames) {
    await generatePackageJson(name)
    await copyLicense(name)
  }
}

main()
