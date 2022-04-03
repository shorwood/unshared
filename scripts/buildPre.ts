import { sync as glob } from 'fast-glob'
import { generateIndex } from './utils'

glob('packages/*', { onlyDirectories: true }).forEach((packageDirectory) => {
  generateIndex(packageDirectory)
})
