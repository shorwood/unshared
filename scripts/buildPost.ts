import { cwd as getCwd } from 'node:process'
import { join, relative } from 'node:path'
import consola from 'consola'
import { generateLicence, generatePackageJson, generateReadme } from './utils'

const cwd = getCwd()
const root = join(__dirname, '..')
const cwdRelative = relative(root, cwd)

generatePackageJson(cwd)
generateLicence(cwd)
generateReadme(cwd)
consola.success(`Finished post-build script for package "${cwdRelative}".`)
