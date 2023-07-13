/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable sonarjs/cognitive-complexity */
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { cwd } from 'node:process'
import { defaults } from '@unshared/collection/defaults'
import { PackageJSON } from 'types-pkg-json'

export interface BuildPackageJsonOptions {
  /**
   * The output directory to list the files from.
   *
   * @default './dist'
   */
  outDir?: string
  /**
   * A map of export types to regular expressions. The regular expression will be
   * matched against the file name. If the file name matches the regular expression,
   * the given extension will be added to the corresponding field in the `exports`
   * field.
   *
   * @example
   * {
   *   import: /\.mjs$/,
   *   require: /\.cjs$/,
   *   types: /\.d\.ts$/,
   *   browser: /\.global\.js$/,
   *   bin: /\.cli\.js$/,
   * }
   */
  outTypes?: Record<'import' | 'require' | 'types' | 'browser' | 'bin', RegExp>
  /**
   * The current content of the `package.json` file.
   *
   * @default {}
   */
  packageJson?: PackageJSON
}

/**
 * Load the `package.json` file and fill in the entry points and exports field based
 * on the files in the `outDir` directory.
 *
 * @param path The path to the package directory.
 * @param options The plugin options.
 * @returns The updated `package.json` file.
 */
export async function buildPackageEntries(path: string = cwd(), options: BuildPackageJsonOptions = {}): Promise<PackageJSON> {
  const {
    outDir = './dist',
    packageJson = {},
  } = options

  // --- Defaults the outTypes.
  const outTypes = defaults(options.outTypes, {
    import: /\.m?js$/,
    require: /\.cjs$/,
    types: /\.d\.ts$/,
    browser: /\.(global|browser)\.js$/,
  })

  // --- List the files in the output directory.
  const outDirAbsolute = join(path, outDir)
  const outDirEntities = await readdir(outDirAbsolute, { withFileTypes: true })
  const outDirPaths = outDirEntities
    .filter(dirent => dirent.isFile())
    .map(dirent => dirent.name)

  // --- Fill the exports field.
  packageJson.exports = {}
  for (const outPath of outDirPaths) {
    // --- Infer the type of the file.
    let type: string | undefined
    for (const exportType in outTypes) {
      const regex: RegExp = outTypes[exportType]
      const matches = regex.test(outPath)
      if (matches) { type = exportType; break }
    }

    // --- If matching type was found, add the path to the exports field.
    if (!type) continue
    const key = outPath.startsWith('index') ? '*' : outPath.split('.').shift()
    const value = `./${join(outDir, outPath)}`
    packageJson.exports[key] = packageJson.exports[key] ?? {}
    packageJson.exports[key][type] = value
  }

  const indexExport = packageJson.exports['./'] as Record<string, string>
  if (indexExport) {
    packageJson.types = indexExport.types
    packageJson.main = indexExport.require
    packageJson.module = indexExport.import
    packageJson.browser = indexExport.browser
  }

  // --- Fill in the bin field.
  packageJson.type = packageJson.module ? 'module' : 'commonjs'
  packageJson.sideEffects = false

  // --- Return the package.json file.
  return packageJson
}
