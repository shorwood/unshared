import { execSync } from 'node:child_process'
import { sync as glob } from 'fast-glob'
import consola from 'consola'

glob('packages/*', { onlyDirectories: true }).forEach((packageDirectory) => {
  execSync(`pnpm upgrade -C ${packageDirectory} -i --latest`)
  consola.success(`Finished upgrading package "${packageDirectory}" dependencies.`)
})
