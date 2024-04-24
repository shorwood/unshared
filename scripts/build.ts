import { rm } from 'node:fs/promises'
import { argv, stdout } from 'node:process'
import { rollup, watch as rollupWatch } from 'rollup'
import { toArray } from '../packages/collection/toArray'
import { parseCliArguments } from '../packages/process/parseCliArguments'
import { buildBundle } from './buildBundle'
import { buildIndexes } from './buildIndexes'
import { buildPackageJson } from './buildPackageJson'
import { PACKAGES_NAMES } from './constants'
import { getPackageMetadata } from './utils'

export async function build() {
  const { parameters, options } = parseCliArguments<{ watch: boolean }>(argv)
  const { watch = false } = options

  // --- Get the package names to build.
  const packageNames = parameters.length > 0
    ? PACKAGES_NAMES.filter(argument => parameters.includes(argument))
    : PACKAGES_NAMES

  // --- Cleanup the output directories.
  for (const packageName of packageNames) {
    const { outputDirectory } = await getPackageMetadata(packageName)
    await rm(outputDirectory, { recursive: true, force: true })
  }

  // --- Create the configuration for each package.
  for (const packageName of packageNames) await buildIndexes(packageName)
  const bundlesPromises = packageNames.map(buildBundle)
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
        for (const packageName of packageNames) await buildPackageJson(packageName)
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
    for (const packageName of packageNames) await buildPackageJson(packageName)
    console.log('Build complete.')
  }
}

// --- Run the build script.
await build()
