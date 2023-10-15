import { argv } from 'node:process'
import { parseArgv } from '@unshared/process/parseCliArgv'
import { buildBundle } from './buildBundle'
import { buildIndexes } from './buildIndexes'
import { buildPackageJson } from './buildPackageJson'

export async function build() {
  const { args } = parseArgv(argv)

  // --- Build all packages.
  for (const packageName of args) {
    await buildIndexes(packageName)
    await buildBundle(packageName)
    await buildPackageJson(packageName)
  }
}

// --- Run the build script.
await build()
