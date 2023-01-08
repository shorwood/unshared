import { cwd as getCwd } from 'node:process'
import { buildPackageJson } from './buildPackageJson'
import { buildReadme } from './buildReadme'
import { buildLicence } from './buildLicence'

const main = async() => {
  const cwd = getCwd()
  buildPackageJson(cwd)
  buildLicence(cwd)
  buildReadme(cwd)
}

main()
