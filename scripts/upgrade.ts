import { sync as glob } from 'fast-glob'
import consola from 'consola'
import { upgradePackage } from './utils'

glob('packages/*', { onlyDirectories: true }).forEach((packageDirectory) => {
  upgradePackage(packageDirectory)
  consola.success(`Finished upgrading package "${packageDirectory}" dependencies.`)
})
