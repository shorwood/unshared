import { argv } from 'node:process'
import { parseArgv } from '../packages/process/parseCliArgv'
import { buildBundle } from './buildBundle'
import { buildIndexes } from './buildIndexes'
import { buildPackageJson } from './buildPackageJson'
import { PACKAGES_NAMES } from './constants'

export async function build() {
  const { args } = parseArgv<{ watch: boolean }>(argv)

  // --- Get the package names to build.
  const packageNames = args.length > 0
    ? args.filter(argument => PACKAGES_NAMES.includes(argument))
    : PACKAGES_NAMES

  // --- Log the packages to build.
  console.log('Building packages:', packageNames.join(', '))

  // --- Build all packages.
  for (const packageName of packageNames) {
    await buildIndexes(packageName)
    await buildBundle(packageName)
    await buildPackageJson(packageName)
  }
}

// --- Run the build script.
await build()
