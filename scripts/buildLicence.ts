import { copyFileSync } from 'node:fs'
import { join } from 'node:path'
import { sync as glob } from 'fast-glob'
import { ROOT_PATH } from './utils'

export const buildLicence = (cwd: string) => {
  const licencePath = glob('LI(C|S)ENCE(.md)?', { cwd: ROOT_PATH, onlyFiles: true, absolute: true, caseSensitiveMatch: false })[0]
  if (licencePath) copyFileSync(licencePath, join(cwd, 'LICENCE'))
}
