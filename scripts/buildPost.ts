import { sync as glob } from 'fast-glob'
import consola from 'consola'
import { generateLicence, generatePackageJson, generateReadme } from './utils'

glob('dist/*', { onlyDirectories: true }).forEach((distDirectory) => {
  generatePackageJson(distDirectory)
  generateLicence(distDirectory)
  generateReadme(distDirectory)
  consola.success(`Finished post-build script for package "${distDirectory}".`)
})
