import { rollup, watch as rollupWatch } from 'rollup'
import { cwd as getCwd, stdout } from 'node:process'
import { rm } from 'node:fs/promises'
import { toArray } from '@unshared/collection/toArray'
import { resolvePackageNames } from './resolvePackageNames'
import { resolvePackage } from './resolvePackage'
import { ResolveBundleOptions, resolveBundle } from './resolveBundle'
import { buildPackageJson } from './buildPackageJson'
import { buildIndexes } from './buildIndexes'

export interface BuildOptions extends ResolveBundleOptions {
  cwd?: string
  watch?: boolean
  packageNames?: string[]
}

/**
 * Build the packages in the current working directory. This will generate
 * CommonJS, ESM, IIFE, UMD, and Typescript declaration files for each package
 * as well as the final package.json file for each package.
 *
 * @param options The build options.
 * @example build({ watch: true, packageNames: ['my-package'] })
 * @returns A promise that resolves when the build is complete.
 */
export async function build(options: BuildOptions = {}) {
  const {
    cwd = getCwd(),
    watch = false,
    packageNames = await resolvePackageNames(cwd),
    tsConfigPath,
  } = options

  // --- Cleanup the output directories.
  for (const packageName of packageNames) {
    const { outputDirectory } = await resolvePackage(packageName, { cwd })
    await rm(outputDirectory, { force: true, recursive: true })
  }

  // --- Create the configuration for each package.
  for (const packageName of packageNames) await buildIndexes(packageName, { cwd })
  const bundlesPromises = packageNames.map(packageName => resolveBundle(packageName, { cwd, tsConfigPath }))
  const bundlesResolved = await Promise.all(bundlesPromises)
  const bundles = bundlesResolved.flat()

  // --- Start watching the files.
  if (watch) {
    const watcher = rollupWatch(bundles)
    watcher.on('event', async(event) => {
      if (event.code === 'ERROR') console.error(event.error)
      if (event.code === 'START') {
        const packagesNames = packageNames.join(', ')
        stdout.write('\u001Bc')
        stdout.write(`Building ${packagesNames}...\n`)
      }

      if (event.code === 'END') {
        for (const packageName of packageNames) await buildPackageJson(packageName, { cwd })
        stdout.write('Build complete.\n')
      }
    })
  }

  // --- Otherwise, build all packages.
  else {
    for (const bundle of bundles) {
      const build = await rollup(bundle)
      const outputs = toArray(bundle.output)
      for (const output of outputs) await build.write(output)
    }
    for (const packageName of packageNames) await buildPackageJson(packageName, { cwd })
    console.log('Build complete.')
  }
}
