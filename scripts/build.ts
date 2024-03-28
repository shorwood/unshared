import { rm } from 'node:fs/promises'
import { argv } from 'node:process'
import { parseCliArguments } from '../packages/process/parseCliArguments'
import { buildBundle } from './buildBundle'
import { buildDts } from './buildDts'
import { buildIndexes } from './buildIndexes'
import { buildPackageJson } from './buildPackageJson'
import { PACKAGES_NAMES } from './constants'
import { getPackageMetadata } from './utils'

export async function build() {
  const { args } = parseCliArguments<{ watch: boolean }>(argv)

  // --- Get the package names to build.
  const packageNames = args.length > 0
    ? PACKAGES_NAMES.filter(argument => args.includes(argument))
    : PACKAGES_NAMES

  // --- Cleanup the output directories.
  for (const packageName of packageNames) {
    const { outputPath } = await getPackageMetadata(packageName)
    await rm(outputPath, { recursive: true, force: true })
  }

  // --- Build all packages.
  for (const packageName of packageNames) await buildIndexes(packageName)
  for (const packageName of packageNames) await buildBundle(packageName)
  for (const packageName of packageNames) await buildDts(packageName)
  for (const packageName of packageNames) await buildPackageJson(packageName)
}

// --- Run the build script.
await build()
